import { useState, useEffect } from "react";
import Clock from "./Clock";
import Description from "./Description";
import ClockSkeleton from "./ClockSkeleton";

function ClockContainer({ country }) {
  const [time, setTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) return <ClockSkeleton />;

  const seconds = (time.getSeconds() + time.getMilliseconds() / 1000) / 60;
  const minutes = (seconds + time.getMinutes()) / 60;
  const hours = (minutes + time.getHours()) / 12;

  return (
    <div className="flex items-center justify-center flex-col origin-center place-content-center fade-in">
      <Clock hours={hours} minutes={minutes} seconds={seconds} />
      <Description country={country} time={time} />
    </div>
  );
}

export default ClockContainer;
