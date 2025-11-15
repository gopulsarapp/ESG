export default function GlassCard({ children, className }) {
  return (
    <div
      className={`backdrop-blur-md bg-white/10 border border-white/20 shadow-xl rounded-2xl p-6 ${className}`}
    >
      {children}
    </div>
  );
}
