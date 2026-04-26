import { useState, useEffect } from "react";
import countriesArray from "./countriesArray";
import ClockContainer from "./ClockContainer";
import Header from "./Header";

const orbitron = { fontFamily: "'Orbitron', sans-serif" };

const STARS = Array.from({ length: 90 }, (_, i) => ({
  x: (i * 137.508) % 100,
  y: (i * 97.3) % 68,
  size: i % 5 === 0 ? 2 : 1,
  opacity: 0.3 + (i % 7) * 0.1,
  duration: 2 + (i % 4),
  delay: (i * 0.37) % 4,
}));

function getSkyBackground(hour) {
  if (hour >= 22 || hour < 5) {
    return [
      "radial-gradient(ellipse at 32% 22%, rgba(140,175,220,0.08) 0%, transparent 36%)",
      "linear-gradient(to bottom, #010208, #030814, #06101e)",
    ].join(", ");
  }
  if (hour < 7) {
    return [
      "radial-gradient(ellipse at 15% 92%, rgba(200,85,18,0.48) 0%, transparent 38%)",
      "linear-gradient(to bottom, #080318, #1e0a38, #4e1830, #922c10)",
    ].join(", ");
  }
  if (hour < 9) {
    return [
      "radial-gradient(ellipse at 50% 94%, rgba(228,158,28,0.68) 0%, transparent 36%)",
      "radial-gradient(ellipse at 50% 100%, rgba(195,55,8,0.44) 0%, transparent 28%)",
      "linear-gradient(to bottom, #100400, #481200, #a03c10, #d06c18, #eea824)",
    ].join(", ");
  }
  if (hour < 12) {
    return [
      "radial-gradient(ellipse at 80% 8%, rgba(255,248,190,0.28) 0%, transparent 24%)",
      "linear-gradient(to bottom, #0c2c48, #1a5078, #3480a8, #60a8c8, #9ccade)",
    ].join(", ");
  }
  if (hour < 15) {
    return [
      "radial-gradient(ellipse at 50% 2%, rgba(255,250,208,0.32) 0%, transparent 22%)",
      "linear-gradient(to bottom, #0c4878, #1878b0, #3ea0ca, #74bedd, #b0d8ea)",
    ].join(", ");
  }
  if (hour < 18) {
    return [
      "radial-gradient(ellipse at 26% 12%, rgba(255,242,160,0.14) 0%, transparent 24%)",
      "linear-gradient(to bottom, #1a4870, #2e78a8, #5298be, #88bcd2, #c0d8e4)",
    ].join(", ");
  }
  if (hour < 20) {
    return [
      "radial-gradient(ellipse at 55% 92%, rgba(238,135,14,0.78) 0%, transparent 40%)",
      "radial-gradient(ellipse at 50% 100%, rgba(175,32,4,0.38) 0%, transparent 28%)",
      "linear-gradient(to bottom, #182848, #2e2458, #7a2040, #b83c18, #d86810)",
    ].join(", ");
  }
  return [
    "radial-gradient(ellipse at 72% 76%, rgba(180,55,18,0.12) 0%, transparent 28%)",
    "linear-gradient(to bottom, #06040e, #12082c, #200c4a, #140828)",
  ].join(", ");
}

function App() {
  const [currentHour, setCurrentHour] = useState(() => new Date().getHours());
  const [isDigital, setIsDigital] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const interval = setInterval(() => setCurrentHour(new Date().getHours()), 60000);
    return () => clearInterval(interval);
  }, []);

  const showStars = currentHour >= 20 || currentHour < 7;

  const q = search.trim().toLowerCase();
  const visibleCountries = q
    ? countriesArray.filter(
        (c) =>
          c.country.toLowerCase().includes(q) ||
          c.continent.toLowerCase().includes(q) ||
          c.timezone.toLowerCase().includes(q)
      )
    : countriesArray;

  return (
    <div
      className="min-h-screen flex flex-col items-center gap-10 py-10 px-4 relative overflow-x-hidden"
      style={{ background: getSkyBackground(currentHour) }}
    >
      {showStars && (
        <div className="absolute inset-0 pointer-events-none">
          {STARS.map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                "--star-opacity": s.opacity,
                opacity: s.opacity,
                animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center gap-4 w-full max-w-6xl">
        <Header />
        <div className="flex gap-2">
          <button
            onClick={() => setIsDigital(false)}
            className={`text-xs px-3 py-1 rounded-full border transition-all duration-200 ${
              !isDigital
                ? "border-cyan-400/70 bg-cyan-400/10 text-cyan-400"
                : "border-white/10 text-white/25 hover:text-white/40"
            }`}
            style={orbitron}
          >
            Analog
          </button>
          <button
            onClick={() => setIsDigital(true)}
            className={`text-xs px-3 py-1 rounded-full border transition-all duration-200 ${
              isDigital
                ? "border-cyan-400/70 bg-cyan-400/10 text-cyan-400"
                : "border-white/10 text-white/25 hover:text-white/40"
            }`}
            style={orbitron}
          >
            Digital
          </button>
        </div>

        <div className="relative w-full max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/50 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search city, region, or timezone…"
            className="w-full pl-9 pr-9 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs placeholder-white/25 focus:outline-none focus:border-cyan-400/50 focus:bg-cyan-400/5 transition-all duration-200"
            style={orbitron}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center">
        {visibleCountries.length > 0 ? (
          visibleCountries.map((country) => (
            <div
              key={country.id}
              className="flex items-center justify-center rounded-3xl p-5 bg-black/10 w-full"
            >
              <ClockContainer country={country} isDigital={isDigital} />
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center gap-2 py-20 text-white/25" style={orbitron}>
            <span className="text-4xl">🌐</span>
            <p className="text-sm">No clocks match &ldquo;{search}&rdquo;</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
