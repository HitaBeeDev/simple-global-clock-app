const orbitron = { fontFamily: "'Orbitron', sans-serif" };

export default function DigitalClock({ time }) {
  const h = String(time.getHours()).padStart(2, "0");
  const m = String(time.getMinutes()).padStart(2, "0");
  const s = String(time.getSeconds()).padStart(2, "0");

  return (
    <div
      className="w-52 h-52 rounded-full bg-gray-900 border border-cyan-500/30 flex flex-col items-center justify-center gap-3"
      style={{
        boxShadow:
          "0 0 30px 6px rgba(6,182,212,0.25), 0 0 70px 15px rgba(6,182,212,0.1), inset 0 0 25px rgba(6,182,212,0.06)",
      }}
    >
      <div
        className="text-4xl font-bold text-cyan-400 tabular-nums tracking-wider"
        style={{
          ...orbitron,
          textShadow:
            "0 0 16px rgba(34,211,238,0.75), 0 0 36px rgba(34,211,238,0.35)",
        }}
      >
        {h}:{m}
      </div>
      <div
        className="text-xl font-semibold text-amber-400 tabular-nums tracking-widest"
        style={{
          ...orbitron,
          textShadow: "0 0 12px rgba(251,191,36,0.85)",
        }}
      >
        {s}
      </div>
    </div>
  );
}
