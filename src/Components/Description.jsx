export default function Description({ country, time }) {
  return (
    <div className="text-center mt-10 text-sm flex flex-col gap-2 text-slate-300">
      <p className="font-semibold text-cyan-300 tracking-wide">{country.country}</p>
      <p className="text-slate-400">
        {time.toLocaleDateString()} {time.toLocaleTimeString()}
      </p>
    </div>
  );
}
