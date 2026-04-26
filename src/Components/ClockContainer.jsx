import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import Clock from "./Clock";
import DigitalClock from "./DigitalClock";
import Description from "./Description";
import ClockSkeleton from "./ClockSkeleton";

const CONFETTI_COLORS = ["#22d3ee", "#fbbf24", "#ffffff", "#a78bfa", "#f0abfc"];

function fireMidnightConfetti() {
  const side = (angle, x) =>
    confetti({
      particleCount: 90,
      angle,
      spread: 58,
      origin: { x, y: 0.75 },
      colors: CONFETTI_COLORS,
      gravity: 0.85,
      ticks: 320,
    });

  side(60, 0);
  side(120, 1);

  setTimeout(
    () =>
      confetti({
        particleCount: 70,
        spread: 110,
        origin: { x: 0.5, y: 0.25 },
        colors: CONFETTI_COLORS,
        startVelocity: 22,
        gravity: 0.75,
        ticks: 280,
      }),
    380
  );
}

function ClockContainer({ country, isDigital }) {
  const [time, setTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const lastMidnightKey = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().toLocaleString("en-US", {
        timeZone: country.timezone,
      });
      setTime(new Date(currentTime));
    }, 100);
    return () => clearInterval(interval);
  }, [country.timezone]);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 650);
    return () => clearTimeout(timeout);
  }, [country.timezone]);

  useEffect(() => {
    if (isLoading) return;
    if (time.getHours() !== 0 || time.getMinutes() !== 0 || time.getSeconds() !== 0) return;

    const key = `${time.toDateString()}_${country.timezone}`;
    if (lastMidnightKey.current === key) return;

    lastMidnightKey.current = key;
    fireMidnightConfetti();
  }, [time, isLoading, country.timezone]);

  if (isLoading) return <ClockSkeleton />;

  const seconds = (time.getSeconds() + time.getMilliseconds() / 1000) / 60;
  const minutes = (seconds + time.getMinutes()) / 60;
  const hours = (minutes + time.getHours()) / 12;

  return (
    <div className="flex items-center justify-center flex-col fade-in">
      <div key={isDigital ? "digital" : "analog"} className="fade-in">
        {isDigital ? (
          <DigitalClock time={time} />
        ) : (
          <Clock hours={hours} minutes={minutes} seconds={seconds} />
        )}
      </div>
      <Description country={country} time={time} />
    </div>
  );
}

export default ClockContainer;
