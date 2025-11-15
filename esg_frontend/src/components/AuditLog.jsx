import Accordion from "./Accordion";

export default function AuditLog({ log }) {
  if (!log || log.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Audit Log</h2>

      {log.map((entry, index) => (
        <Accordion key={index} title={`Audit Entry: ${entry.input_id || "Unknown"}`}>
          <p><strong>Rule:</strong> {entry.rule_id || "No rule matched"}</p>
          <p><strong>Target:</strong> {entry.target || "--"}</p>
          <p><strong>Value:</strong> {entry.value !== null ? entry.value : "--"}</p>
          <p className="text-xs text-white/50">Timestamp: {entry.timestamp}</p>
          {entry.note && <p className="text-white/70 mt-2">{entry.note}</p>}
        </Accordion>
      ))}
    </div>
  );
}
