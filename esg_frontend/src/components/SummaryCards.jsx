import GlassCard from "./GlassCard";

export default function SummaryCards({ summary }) {
  if (!summary) return null;

  const items = [
    { label: "Total Energy (GJ)", value: summary.total_energy_GJ },
    { label: "Total Emissions (tCO₂e)", value: summary.total_emissions_tCO2e },
    { label: "Water Consumption (m³)", value: summary.total_water_m3 },
    { label: "Training Hours", value: summary.training_hours_total },
    { label: "New Hires", value: summary.new_hires_count },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {items.map((item, idx) => (
        <GlassCard key={idx} className="text-center py-6 hover:bg-white/20 transition-all duration-300">
          <h3 className="text-xl font-semibold mb-2">{item.label}</h3>
          <p className="text-3xl font-bold text-blue-300 drop-shadow">{item.value}</p>
        </GlassCard>
      ))}
    </div>
  );
}
