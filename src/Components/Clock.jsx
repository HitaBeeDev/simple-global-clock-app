import HourHand from "./HourHand";
import MinuteHand from "./MinuteHand";
import SecondHand from "./SecondHand";
import numberPositions from "./numberPositions";

export default function Clock({ hours, minutes, seconds }) {
  return (
    <div
      className="w-52 h-52 border border-cyan-500/30 relative rounded-full bg-gray-900 flex items-center justify-center"
      style={{
        boxShadow:
          "0 0 30px 6px rgba(6,182,212,0.25), 0 0 70px 15px rgba(6,182,212,0.1), inset 0 0 25px rgba(6,182,212,0.06)",
      }}
    >
      {numberPositions.map(({ num, rotation }) => (
        <h2
          className="absolute w-40 h-40 origin-center transform text-sm flex items-center justify-center text-cyan-400/70"
          style={{
            transform: `rotate(${rotation}deg) translate(-50%) rotate(${-rotation}deg)`,
          }}
          key={num}
        >
          {num}
        </h2>
      ))}

      <MinuteHand minutes={minutes} />
      <HourHand hours={hours} />
      <SecondHand seconds={seconds} />

      <p
        className="absolute flex items-center justify-center w-2 h-2 bg-cyan-400 rounded-full"
        style={{ zIndex: 1, boxShadow: "0 0 6px 2px rgba(34,211,238,0.8)" }}
      ></p>
    </div>
  );
}
