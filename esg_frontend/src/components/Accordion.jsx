import { useState } from "react";

export default function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all flex justify-between items-center"
      >
        <span className="font-semibold">{title}</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="mt-2 p-4 bg-white/5 border border-white/10 rounded-xl text-white/90">
          {children}
        </div>
      )}
    </div>
  );
}
