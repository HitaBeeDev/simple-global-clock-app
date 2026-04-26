import { useState, useEffect } from "react";
import countriesArray from "./countriesArray";
import ClockContainer from "./ClockContainer";
import Buttons from "./Buttons";
import Header from "./Header";

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
    // Night — nearly black, barely tinted blue, faint moon glow
    return [
      "radial-gradient(ellipse at 32% 22%, rgba(140,175,220,0.08) 0%, transparent 36%)",
      "linear-gradient(to bottom, #010208, #030814, #06101e)",
    ].join(", ");
  }
  if (hour < 7) {
    // Pre-dawn — dark indigo at zenith, first warmth at horizon
    return [
      "radial-gradient(ellipse at 15% 92%, rgba(200,85,18,0.48) 0%, transparent 38%)",
      "linear-gradient(to bottom, #080318, #1e0a38, #4e1830, #922c10)",
    ].join(", ");
  }
  if (hour < 9) {
    // Sunrise — very dark rust at zenith, coral/gold bloom at horizon
    return [
      "radial-gradient(ellipse at 50% 94%, rgba(228,158,28,0.68) 0%, transparent 36%)",
      "radial-gradient(ellipse at 50% 100%, rgba(195,55,8,0.44) 0%, transparent 28%)",
      "linear-gradient(to bottom, #100400, #481200, #a03c10, #d06c18, #eea824)",
    ].join(", ");
  }
  if (hour < 12) {
    // Morning — steel blue zenith, pale hazy horizon, sun high-right
    return [
      "radial-gradient(ellipse at 80% 8%, rgba(255,248,190,0.28) 0%, transparent 24%)",
      "linear-gradient(to bottom, #0c2c48, #1a5078, #3480a8, #60a8c8, #9ccade)",
    ].join(", ");
  }
  if (hour < 15) {
    // Midday — open bright sky, warm bloom overhead, light horizon haze
    return [
      "radial-gradient(ellipse at 50% 2%, rgba(255,250,208,0.32) 0%, transparent 22%)",
      "linear-gradient(to bottom, #0c4878, #1878b0, #3ea0ca, #74bedd, #b0d8ea)",
    ].join(", ");
  }
  if (hour < 18) {
    // Afternoon — muted cerulean, atmosphere lightens+warms near horizon
    return [
      "radial-gradient(ellipse at 26% 12%, rgba(255,242,160,0.14) 0%, transparent 24%)",
      "linear-gradient(to bottom, #1a4870, #2e78a8, #5298be, #88bcd2, #c0d8e4)",
    ].join(", ");
  }
  if (hour < 20) {
    // Sunset — slate blue → indigo → rose → burnt orange (no purple jump)
    return [
      "radial-gradient(ellipse at 55% 92%, rgba(238,135,14,0.78) 0%, transparent 40%)",
      "radial-gradient(ellipse at 50% 100%, rgba(175,32,4,0.38) 0%, transparent 28%)",
      "linear-gradient(to bottom, #182848, #2e2458, #7a2040, #b83c18, #d86810)",
    ].join(", ");
  }
  // Dusk — purple deepening into midnight
  return [
    "radial-gradient(ellipse at 72% 76%, rgba(180,55,18,0.12) 0%, transparent 28%)",
    "linear-gradient(to bottom, #06040e, #12082c, #200c4a, #140828)",
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
      <Header />
      <ClockContainer country={countriesArray[currentCountryIndex]} />
      <Buttons onPrevious={handlePrevious} onNext={handleNext} />
    </div>
  );
}

export default App;
