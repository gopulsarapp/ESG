import { useState } from "react";
import JsonInput from "./components/JsonInput";
import SummaryCards from "./components/SummaryCards";
import MappedResults from "./components/MappedResults";
import AuditLog from "./components/AuditLog";
import { processRecords } from "./api/esgApi";

export default function App() {
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleProcess = async (records) => {
    setLoading(true);
    setOutput(null);

    try {
      const result = await processRecords(records);
      setOutput(result);
    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-white drop-shadow-lg">
        ESG Demo Platform
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <JsonInput onProcess={handleProcess} />

        {loading ? (
          <div className="flex justify-center items-center text-2xl text-white">
            Processing...
          </div>
        ) : (
          <div>
            {output && (
              <>
                <SummaryCards summary={output.summary} />
                <MappedResults results={output.mapped_results} />
                <AuditLog log={output.audit_log} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
