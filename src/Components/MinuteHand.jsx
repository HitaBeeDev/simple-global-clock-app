export default function MinuteHand({ minutes }) {
  return (
    <div
      className="rounded-t-full flex items-center justify-center origin-center w-0.5 h-14 bg-cyan-400"
      style={{
        transform: `rotate(${(minutes % 1) * 360}deg) translate(-50%, -50%)`,
        boxShadow: "0 0 6px 1px rgba(34,211,238,0.7)",
      }}
    ></div>
  );
}
