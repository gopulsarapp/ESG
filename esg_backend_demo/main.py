# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from engine.validators import RawRecord
from engine.rule_engine import ESGMappingsEngine
from datetime import datetime

app = FastAPI(title="ESG Rule Engine Demo", version="0.1")

# Allow CORS from any origin (for local frontend demo)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://esg-ebon-chi.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = ESGMappingsEngine("rules.json")

class ProcessRequest(BaseModel):
    records: List[Dict[str, Any]]

@app.post("/process")
def process(request: ProcessRequest):
    records = request.records
    all_mapped = []
    audit_log = []
    validation_errors = []

    for idx, rec in enumerate(records):
        # validate using Pydantic RawRecord (raises if invalid types / missing required)
        try:
            validated = RawRecord(**rec).dict()
        except Exception as e:
            validation_errors.append({
                "index": idx,
                "input": rec,
                "error": str(e)
            })
            # Skip invalid record (you can choose to include or halt)
            continue

        # execute rules for this record
        mapped = engine.execute(validated)
        if mapped:
            all_mapped.extend(mapped)
            audit_log.extend(mapped)
        else:
            # no rule matched: log that explicitly (useful in UI)
            audit_log.append({
                "input_id": validated.get("id"),
                "rule_id": None,
                "target": None,
                "value": None,
                "timestamp": datetime.utcnow().isoformat(),
                "note": "No rule matched"
            })

    # Simple aggregation summary for the demo (energy & emissions & water)
    summary = {
        "total_energy_GJ": 0.0,
        "total_emissions_tCO2e": 0.0,
        "total_water_m3": 0.0,
        "training_hours_total": 0.0,
        "new_hires_count": 0
    }
    for m in all_mapped:
        tgt = m.get("target", "")
        val = m.get("value")
        if not isinstance(val, (int, float)):
            continue
        if "Energy_GJ" in tgt:
            summary["total_energy_GJ"] += val
        elif "Emissions" in tgt:
            summary["total_emissions_tCO2e"] += val
        elif "Water_Consumption_m3" in tgt:
            summary["total_water_m3"] += val
        elif "Training_Hours" in tgt:
            summary["training_hours_total"] += val
        elif "New_Hire_Count" in tgt:
            summary["new_hires_count"] += int(val)

    # rounding for neatness
    summary = {k: (round(v, 6) if isinstance(v, float) else v) for k, v in summary.items()}

    return {
        "mapped_results": all_mapped,
        "audit_log": audit_log,
        "validation_errors": validation_errors,
        "summary": summary
    }
