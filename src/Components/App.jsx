import { useState, useEffect } from "react";
import countriesArray from "./countriesArray";
import ClockContainer from "./ClockContainer";
import Buttons from "./Buttons";

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
      "radial-gradient(ellipse at 28% 18%, rgba(180,210,255,0.18) 0%, transparent 40%)",
      "linear-gradient(to bottom, #020617, #0b1023, #1a1a3e)",
    ].join(", ");
  }
  if (hour < 7) {
    return [
      "radial-gradient(ellipse at 10% 90%, rgba(255,130,40,0.6) 0%, transparent 45%)",
      "radial-gradient(ellipse at 35% 100%, rgba(180,40,20,0.35) 0%, transparent 35%)",
      "linear-gradient(to bottom, #0c0820, #2d1060, #7c2060, #c2410c)",
    ].join(", ");
  }
  if (hour < 9) {
    return [
      "radial-gradient(ellipse at 50% 94%, rgba(255,215,60,0.8) 0%, transparent 38%)",
      "radial-gradient(ellipse at 50% 100%, rgba(255,90,0,0.55) 0%, transparent 35%)",
      "linear-gradient(to bottom, #3b0a00, #9a2c00, #ea580c, #fbbf24)",
    ].join(", ");
  }
  if (hour < 12) {
    return [
      "radial-gradient(ellipse at 80% 10%, rgba(255,255,210,0.45) 0%, transparent 32%)",
      "linear-gradient(to bottom, #0b3d5e, #0369a1, #0ea5e9, #7dd3fc)",
    ].join(", ");
  }
  if (hour < 15) {
    return [
      "radial-gradient(ellipse at 50% 4%, rgba(255,255,255,0.4) 0%, transparent 28%)",
      "linear-gradient(to bottom, #0277bd, #0ea5e9, #38bdf8, #bae6fd)",
    ].join(", ");
  }
  if (hour < 18) {
    return [
      "radial-gradient(ellipse at 20% 16%, rgba(255,240,160,0.28) 0%, transparent 32%)",
      "linear-gradient(to bottom, #1a3480, #1d4ed8, #3b82f6, #93c5fd)",
    ].join(", ");
  }
  if (hour < 20) {
    return [
      "radial-gradient(ellipse at 50% 92%, rgba(255,160,0,0.9) 0%, transparent 42%)",
      "radial-gradient(ellipse at 50% 100%, rgba(200,30,0,0.45) 0%, transparent 35%)",
      "linear-gradient(to bottom, #150a30, #6d1a0e, #c2410c, #f97316)",
    ].join(", ");
  }
  return [
    "radial-gradient(ellipse at 75% 75%, rgba(255,90,40,0.22) 0%, transparent 35%)",
    "linear-gradient(to bottom, #140830, #3b1080, #26185a, #0f172a)",
  ].join(", ");
}

function App() {
  const [currentCountryIndex, setCurrentCountryIndex] = useState(0);
  const [currentHour, setCurrentHour] = useState(0);

  useEffect(() => {
    const updateHour = () => {
      const localTime = new Date().toLocaleString("en-US", {
        timeZone: countriesArray[currentCountryIndex].timezone,
      });
      setCurrentHour(new Date(localTime).getHours());
    };
    updateHour();
    const interval = setInterval(updateHour, 60000);
    return () => clearInterval(interval);
  }, [currentCountryIndex]);

  const handleNext = () =>
    setCurrentCountryIndex((prev) => (prev + 1) % countriesArray.length);

  const handlePrevious = () =>
    setCurrentCountryIndex((prev) =>
      prev === 0 ? countriesArray.length - 1 : prev - 1
    );

  const showStars = currentHour >= 20 || currentHour < 7;

  return (
    <div
      className="flex-col min-h-screen flex items-center justify-center gap-16 relative overflow-hidden"
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
      <ClockContainer country={countriesArray[currentCountryIndex]} />
      <Buttons onPrevious={handlePrevious} onNext={handleNext} />
    </div>
  );
}

export default App;
