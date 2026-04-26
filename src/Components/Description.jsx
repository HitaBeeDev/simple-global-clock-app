export default function Description({ country, time }) {
  const ampm = time.getHours() >= 12 ? "PM" : "AM";

  const utcOffset =
    new Intl.DateTimeFormat("en", {
      timeZone: country.timezone,
      timeZoneName: "shortOffset",
    })
      .formatToParts(new Date())
      .find((p) => p.type === "timeZoneName")
      ?.value?.replace("GMT", "UTC") ?? "UTC";

  return (
    <div className="text-center mt-10 text-sm flex flex-col gap-1 text-slate-300">
      <p className="font-semibold text-cyan-300 tracking-wide">{country.country}</p>
      <div className="flex items-center justify-center gap-2 text-xs">
        <span className="text-amber-400/80 font-medium">{ampm}</span>
        <span className="text-white/20">·</span>
        <span className="text-white/40">{utcOffset}</span>
      </div>
      <p className="text-slate-400 text-xs">
        {time.toLocaleDateString()} {time.toLocaleTimeString()}
      </p>
    </div>
  );
}
