function getOffsetMinutes(timezone) {
  const now = new Date();
  const tz = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
  const utc = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
  return (tz - utc) / 60000;
}

function formatDiff(minutes) {
  if (minutes === 0) return "local";
  const sign = minutes > 0 ? "+" : "−";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return m === 0 ? `${sign}${h}h` : `${sign}${h}:${String(m).padStart(2, "0")}h`;
}

const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function Description({ country, time }) {
  const ampm = time.getHours() >= 12 ? "PM" : "AM";
  const date = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(time);

  const utcOffset =
    new Intl.DateTimeFormat("en", {
      timeZone: country.timezone,
      timeZoneName: "shortOffset",
    })
      .formatToParts(new Date())
      .find((p) => p.type === "timeZoneName")
      ?.value?.replace("GMT", "UTC") ?? "UTC";

  const diffMinutes = getOffsetMinutes(country.timezone) - getOffsetMinutes(localTimezone);
  const diff = formatDiff(diffMinutes);
  const isLocal = diffMinutes === 0;

  return (
    <div className="text-center mt-10 text-sm flex flex-col gap-1 text-slate-300">
      <p className="font-semibold text-cyan-300 tracking-wide">{country.country}</p>
      <div className="flex items-center justify-center gap-2 text-xs">
        <span className="text-amber-400/80 font-medium">{ampm}</span>
        <span className="text-white/20">·</span>
        <span className="text-white/40">{utcOffset}</span>
        <span className="text-white/20">·</span>
        <span className={isLocal ? "text-cyan-400/60" : "text-white/50"}>{diff}</span>
      </div>
      <p className="text-slate-400 text-xs">{date}</p>
    </div>
  );
}
