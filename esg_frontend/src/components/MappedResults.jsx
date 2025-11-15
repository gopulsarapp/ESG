import Accordion from "./Accordion";
import GlassCard from "./GlassCard";

export default function MappedResults({ results }) {
  if (!results || results.length === 0) {
    return (
      <GlassCard className="mt-6">
        <p className="text-white/70">No results generated yet.</p>
      </GlassCard>
    );
  }

  // Group results by input_id
  const grouped = results.reduce((acc, item) => {
    acc[item.input_id] = acc[item.input_id] || [];
    acc[item.input_id].push(item);
    return acc;
  }, {});

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Detailed Results</h2>

      {Object.keys(grouped).map((inputId) => (
        <Accordion key={inputId} title={`Input Record: ${inputId}`}>
          {grouped[inputId].map((r, idx) => (
            <div
              key={idx}
              className="mb-3 p-3 bg-white/5 rounded-xl border border-white/10"
            >
              <p><strong>Metric:</strong> {r.target}</p>
              <p><strong>Value:</strong> {r.value}</p>
              <p><strong>Rule Applied:</strong> {r.rule_id}</p>
              <p className="text-xs text-white/50">Timestamp: {r.timestamp}</p>
            </div>
          ))}
        </Accordion>
      ))}
    </div>
  );
}
