# engine/rule_engine.py
import json
import re
from datetime import datetime
from typing import Any, Dict, List

from .converters import CONVERSION, EMISSION_FACTORS

# Helper transformation functions
def convert_kwh_to_gj(kwh: float) -> float:
    return round(kwh * CONVERSION["kwh_to_gj"], 6)

def emissions_from_electricity(kwh: float) -> float:
    kg_co2 = kwh * EMISSION_FACTORS["grid_location_kgCO2_per_kwh"]
    return round(kg_co2 / 1000.0, 6)  # tonnes

def emissions_from_diesel(liters: float) -> float:
    kg_co2 = liters * EMISSION_FACTORS["diesel_kg_per_l"]
    return round(kg_co2 / 1000.0, 6)  # tonnes

# Allowed functions map — protects from arbitrary code execution
ALLOWED_FUNCTIONS = {
    "convert_kwh_to_gj": convert_kwh_to_gj,
    "emissions_from_electricity": emissions_from_electricity,
    "emissions_from_diesel": emissions_from_diesel
}

class ESGMappingsEngine:
    def __init__(self, rules_path: str):
        with open(rules_path, "r") as f:
            self.rules = json.load(f)["rules"]

    def _condition_true(self, cond: str, record: Dict[str, Any]) -> bool:
        """
        Evaluate condition safely. cond is like "record['type']=='electricity' and ..."
        We pass only 'record' into eval's locals and empty globals.
        """
        try:
            return bool(eval(cond, {}, {"record": record}))
        except Exception:
            return False

    def _eval_transformation(self, trans: str, record: Dict[str, Any]):
        """
        Evaluate the transformation safely.
        Supports:
         - direct expressions using record (e.g., "record['quantity'] / 1000.0")
         - function calls present in ALLOWED_FUNCTIONS, with a single argument that can be an expression using record, e.g.
            "convert_kwh_to_gj(record['quantity'])"
        """
        # detect function call pattern: func_name(arg_expr)
        m = re.match(r"^(\w+)\((.*)\)$", trans.strip())
        if m:
            func_name, arg_expr = m.groups()
            func = ALLOWED_FUNCTIONS.get(func_name)
            if not func:
                raise ValueError(f"Function '{func_name}' is not allowed.")
            # safely evaluate arg expression with only record exposed
            arg_val = eval(arg_expr, {}, {"record": record})
            return func(arg_val)
        else:
            # fallback: evaluate simple expression (safe-ish: only record is exposed)
            return eval(trans, {}, {"record": record})

    def execute(self, record: Dict[str, Any]) -> List[Dict[str, Any]]:
        outputs = []
        for rule in self.rules:
            rid = rule.get("id")
            cond = rule.get("condition", "")
            trans = rule.get("transformation", "")
            target = rule.get("target")
            if self._condition_true(cond, record):
                try:
                    val = self._eval_transformation(trans, record)
                    outputs.append({
                        "input_id": record.get("id"),
                        "rule_id": rid,
                        "target": target,
                        "value": val,
                        "timestamp": datetime.utcnow().isoformat(),
                        "note": rule.get("note")
                    })
                except Exception as e:
                    outputs.append({
                        "input_id": record.get("id"),
                        "rule_id": rid,
                        "error": str(e),
                        "timestamp": datetime.utcnow().isoformat()
                    })
        return outputs
