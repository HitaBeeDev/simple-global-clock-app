const orbitron = { fontFamily: "'Orbitron', sans-serif" };

export default function Header() {
  return (
    <header className="flex flex-col items-center gap-2 select-none">
      <div className="flex items-center gap-3">
        <div className="h-px w-10 bg-gradient-to-r from-transparent to-cyan-400/50" />
        <p
          className="text-xs tracking-[0.45em] text-cyan-300 uppercase"
          style={orbitron}
        >
          World Time
        </p>
        <div className="h-px w-10 bg-gradient-to-l from-transparent to-cyan-400/50" />
      </div>

      <h1
        className="text-3xl font-bold tracking-[0.18em] uppercase text-white/90"
        style={{
          ...orbitron,
          textShadow:
            "0 0 18px rgba(34,211,238,0.55), 0 0 45px rgba(34,211,238,0.2)",
        }}
      >
        Global<span
          className="text-cyan-400"
          style={{ textShadow: "0 0 18px rgba(34,211,238,0.8), 0 0 40px rgba(34,211,238,0.4)" }}
        >Clock</span>
      </h1>
    </header>
  );
}
