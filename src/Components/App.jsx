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
    // Night: near-black with deep midnight blue, faint cool moonlight
    return [
      "radial-gradient(ellipse at 30% 20%, rgba(160,185,230,0.1) 0%, transparent 38%)",
      "linear-gradient(to bottom, #010208, #04091a, #080f28)",
    ].join(", ");
  }
  if (hour < 7) {
    // Dawn: deep indigo at zenith, warm amber glow rising at horizon
    return [
      "radial-gradient(ellipse at 14% 90%, rgba(210,100,25,0.5) 0%, transparent 40%)",
      "radial-gradient(ellipse at 45% 100%, rgba(140,25,10,0.28) 0%, transparent 30%)",
      "linear-gradient(to bottom, #07031a, #1c0a42, #541540, #a83808)",
    ].join(", ");
  }
  if (hour < 9) {
    // Sunrise: coral and amber, sun blooming at horizon
    return [
      "radial-gradient(ellipse at 50% 93%, rgba(235,170,35,0.72) 0%, transparent 36%)",
      "radial-gradient(ellipse at 50% 100%, rgba(210,65,8,0.48) 0%, transparent 30%)",
      "linear-gradient(to bottom, #18060000, #180600, #561400, #bf4808, #e07a18, #f0b830)",
    ].join(", ");
  }
  if (hour < 12) {
    // Morning: deep cerulean at zenith, hazy pale blue at horizon
    return [
      "radial-gradient(ellipse at 82% 10%, rgba(255,248,195,0.3) 0%, transparent 26%)",
      "linear-gradient(to bottom, #0c2a42, #18557a, #2e80b0, #58a8cc, #8cc4de)",
    ].join(", ");
  }
  if (hour < 15) {
    // Midday: bright open sky, sun white-hot overhead, horizon haze
    return [
      "radial-gradient(ellipse at 50% 2%, rgba(255,252,215,0.38) 0%, transparent 24%)",
      "linear-gradient(to bottom, #0e4878, #1a78b0, #3898cc, #6abce0, #aad4ea)",
    ].join(", ");
  }
  if (hour < 18) {
    // Afternoon: rich sky blue, sun shifting west, warm horizon haze
    return [
      "radial-gradient(ellipse at 24% 14%, rgba(255,238,155,0.2) 0%, transparent 26%)",
      "linear-gradient(to bottom, #0b3460, #18609a, #3488c0, #62aad6, #9ccae0)",
    ].join(", ");
  }
  if (hour < 20) {
    // Sunset: dramatic — deep plum at zenith, fire at horizon
    return [
      "radial-gradient(ellipse at 50% 91%, rgba(245,145,18,0.82) 0%, transparent 38%)",
      "radial-gradient(ellipse at 50% 100%, rgba(185,35,5,0.42) 0%, transparent 30%)",
      "linear-gradient(to bottom, #07041c, #22082e, #741808, #c04810, #e08018)",
    ].join(", ");
  }
  // Dusk: last warmth fading into indigo night
  return [
    "radial-gradient(ellipse at 74% 74%, rgba(200,70,25,0.16) 0%, transparent 30%)",
    "linear-gradient(to bottom, #030110, #0e0628, #220e58, #160830)",
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
