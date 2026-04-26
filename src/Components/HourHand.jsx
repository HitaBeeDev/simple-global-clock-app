export default function HourHand({ hours }) {
  return (
    <div
      className="rounded-t-full flex items-center justify-center origin-center w-1 h-12 bg-cyan-300"
      style={{
        transform: `rotate(${(hours % 1) * 360}deg) translate(-50%, -50%)`,
        boxShadow: "0 0 8px 2px rgba(34,211,238,0.9)",
      }}
    ></div>
  );
}
