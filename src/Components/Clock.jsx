import HourHand from "./HourHand";
import MinuteHand from "./MinuteHand";
import SecondHand from "./SecondHand";
import numberPositions from "./numberPositions";

const CX = 104, CY = 104, OUTER_R = 101;

const TICKS = Array.from({ length: 60 }, (_, i) => {
  const angle = (i * 6 - 90) * (Math.PI / 180);
  const isHour = i % 5 === 0;
  const innerR = isHour ? 89 : 95;
  return {
    x1: (CX + Math.cos(angle) * innerR).toFixed(2),
    y1: (CY + Math.sin(angle) * innerR).toFixed(2),
    x2: (CX + Math.cos(angle) * OUTER_R).toFixed(2),
    y2: (CY + Math.sin(angle) * OUTER_R).toFixed(2),
    isHour,
  };
});

export default function Clock({ hours, minutes, seconds }) {
  return (
    <div
      className="w-52 h-52 border border-cyan-500/30 relative rounded-full bg-gray-900 flex items-center justify-center"
      style={{
        boxShadow:
          "0 0 30px 6px rgba(6,182,212,0.25), 0 0 70px 15px rgba(6,182,212,0.1), inset 0 0 25px rgba(6,182,212,0.06)",
      }}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 208 208"
      >
        {TICKS.map(({ x1, y1, x2, y2, isHour }, i) => (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={isHour ? "rgba(34,211,238,0.7)" : "rgba(34,211,238,0.25)"}
            strokeWidth={isHour ? 2 : 1}
            strokeLinecap="round"
          />
        ))}
      </svg>

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
