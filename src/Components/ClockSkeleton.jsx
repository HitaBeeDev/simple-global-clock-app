export default function ClockSkeleton() {
  return (
    <div className="flex items-center justify-center flex-col origin-center place-content-center">
      <div className="w-52 h-52 rounded-full shimmer border border-cyan-500/10" />
      <div className="flex flex-col items-center gap-2 mt-10">
        <div
          className="h-3 w-24 rounded-full shimmer"
          style={{ animationDelay: "0.15s" }}
        />
        <div
          className="h-2.5 w-36 rounded-full shimmer"
          style={{ animationDelay: "0.3s" }}
        />
      </div>
    </div>
  );
}
