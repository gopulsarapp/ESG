import { useState } from "react";
import GlassCard from "./GlassCard";

export default function JsonInput({ onProcess }) {
  const [text, setText] = useState("");

  const handleProcess = () => {
    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        alert("Input must be a JSON ARRAY.");
        return;
      }
      onProcess(parsed);
    } catch {
      alert("Invalid JSON! Please fix and try again.");
    }
  };

  return (
    <GlassCard className="h-full">
      <h2 className="text-xl font-semibold mb-3">Input JSON</h2>

      <textarea
        className="w-full h-72 bg-white/5 border border-white/20 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        placeholder='Paste JSON array here...'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={handleProcess}
        className="mt-4 w-full py-3 bg-blue-500 hover:bg-blue-600 transition rounded-xl font-semibold shadow-lg"
      >
        Process Data
      </button>
    </GlassCard>
  );
}
