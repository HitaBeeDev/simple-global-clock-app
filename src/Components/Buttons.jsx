export default function Buttons({ onPrevious, onNext }) {
  return (
    <div className="flex items-center justify-center origin-center gap-72">
      <button
        onClick={onPrevious}
        className="transition duration-300 w-10 h-10 rounded-full bg-slate-300 hover:bg-slate-200 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M15.75 4.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-1.28.53L8.47 12.53a.75.75 0 0 1 0-1.06l6.75-6.75a.75.75 0 0 1 .53-.22z" clipRule="evenodd" />
        </svg>
      </button>

      <button
        onClick={onNext}
        className="transition duration-300 w-10 h-10 rounded-full bg-slate-300 hover:bg-slate-200 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M8.25 4.5a.75.75 0 0 0-.75.75v13.5a.75.75 0 0 0 1.28.53l6.75-6.75a.75.75 0 0 0 0-1.06L8.78 4.72a.75.75 0 0 0-.53-.22z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}
