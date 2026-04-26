export default function SecondHand({ seconds }) {
  return (
    <div
      className="rounded-t-full flex items-center justify-center origin-center w-px h-14 bg-amber-400"
      style={{
        transform: `rotate(${(seconds % 1) * 360}deg) translate(-50%, -50%)`,
        boxShadow: "0 0 6px 2px rgba(251,191,36,0.9)",
      }}
    ></div>
  );
}
