# engine/converters.py
# Central place to store conversion and emission factors
# Replace with authoritative factors for production.

CONVERSION = {
    "kwh_to_gj": 0.0036  # 1 kWh = 0.0036 GJ
}

EMISSION_FACTORS = {
    # example factors (replace with local/official factors if available)
    "diesel_kg_per_l": 2.68,      # kg CO2e per liter diesel (typical value)
    "grid_location_kgCO2_per_kwh": 0.7  # kg CO2e per kWh (example)
}
