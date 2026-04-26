import { useState, useEffect, useRef } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import countriesArray from "./countriesArray";
import ClockContainer from "./ClockContainer";
import Header from "./Header";

const orbitron = { fontFamily: "'Orbitron', sans-serif" };
const ORDER_STORAGE_KEY = "global-clock-order";
const DEFAULT_ORDER_IDS = countriesArray.map((country) => String(country.id));
const countryById = new Map(
  countriesArray.map((country) => [String(country.id), country])
);

const STARS = Array.from({ length: 90 }, (_, i) => ({
  x: (i * 137.508) % 100,
  y: (i * 97.3) % 68,
  size: i % 5 === 0 ? 2 : 1,
  opacity: 0.3 + (i % 7) * 0.1,
  duration: 2 + (i % 4),
  delay: (i * 0.37) % 4,
}));

function getSkyBackground(hour) {
  if (hour >= 22 || hour < 5) {
    return [
      "radial-gradient(ellipse at 32% 22%, rgba(140,175,220,0.08) 0%, transparent 36%)",
      "linear-gradient(to bottom, #010208, #030814, #06101e)",
    ].join(", ");
  }
  if (hour < 7) {
    return [
      "radial-gradient(ellipse at 15% 92%, rgba(200,85,18,0.48) 0%, transparent 38%)",
      "linear-gradient(to bottom, #080318, #1e0a38, #4e1830, #922c10)",
    ].join(", ");
  }
  if (hour < 9) {
    return [
      "radial-gradient(ellipse at 50% 94%, rgba(228,158,28,0.68) 0%, transparent 36%)",
      "radial-gradient(ellipse at 50% 100%, rgba(195,55,8,0.44) 0%, transparent 28%)",
      "linear-gradient(to bottom, #100400, #481200, #a03c10, #d06c18, #eea824)",
    ].join(", ");
  }
  if (hour < 12) {
    return [
      "radial-gradient(ellipse at 80% 8%, rgba(255,248,190,0.28) 0%, transparent 24%)",
      "linear-gradient(to bottom, #0c2c48, #1a5078, #3480a8, #60a8c8, #9ccade)",
    ].join(", ");
  }
  if (hour < 15) {
    return [
      "radial-gradient(ellipse at 50% 2%, rgba(255,250,208,0.32) 0%, transparent 22%)",
      "linear-gradient(to bottom, #0c4878, #1878b0, #3ea0ca, #74bedd, #b0d8ea)",
    ].join(", ");
  }
  if (hour < 18) {
    return [
      "radial-gradient(ellipse at 26% 12%, rgba(255,242,160,0.14) 0%, transparent 24%)",
      "linear-gradient(to bottom, #1a4870, #2e78a8, #5298be, #88bcd2, #c0d8e4)",
    ].join(", ");
  }
  if (hour < 20) {
    return [
      "radial-gradient(ellipse at 55% 92%, rgba(238,135,14,0.78) 0%, transparent 40%)",
      "radial-gradient(ellipse at 50% 100%, rgba(175,32,4,0.38) 0%, transparent 28%)",
      "linear-gradient(to bottom, #182848, #2e2458, #7a2040, #b83c18, #d86810)",
    ].join(", ");
  }
  return [
    "radial-gradient(ellipse at 72% 76%, rgba(180,55,18,0.12) 0%, transparent 28%)",
    "linear-gradient(to bottom, #06040e, #12082c, #200c4a, #140828)",
  ].join(", ");
}

function DragHandle() {
  return (
    <div
      aria-hidden="true"
      className="absolute top-3 right-3 p-2 text-white/35 opacity-70 transition-all pointer-events-none group-hover:text-cyan-300 group-hover:opacity-100"
    >
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="5" cy="4" r="1.2" />
        <circle cx="11" cy="4" r="1.2" />
        <circle cx="5" cy="8" r="1.2" />
        <circle cx="11" cy="8" r="1.2" />
        <circle cx="5" cy="12" r="1.2" />
        <circle cx="11" cy="12" r="1.2" />
      </svg>
    </div>
  );
}

function SortableCard({ country, isDigital, isSelected }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: String(country.id) });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      aria-label={`Drag to reorder ${country.country} clock`}
      data-sortable-card="true"
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`relative group flex items-center justify-center rounded-3xl p-5 w-full cursor-grab select-none touch-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 active:cursor-grabbing ${
        isDragging ? "z-20 opacity-30" : ""
      } ${
        isSelected
          ? "bg-cyan-400/10 ring-1 ring-cyan-400/50 shadow-[0_0_24px_rgba(6,182,212,0.18)]"
        : "bg-black/10"
      }`}
    >
      <DragHandle />
      <ClockContainer country={country} isDigital={isDigital} />
    </div>
  );
}

function getInitialOrderedIds() {
  if (typeof window === "undefined") return DEFAULT_ORDER_IDS;

  try {
    const stored = JSON.parse(window.localStorage.getItem(ORDER_STORAGE_KEY));
    if (!Array.isArray(stored)) return DEFAULT_ORDER_IDS;

    const knownIds = new Set(DEFAULT_ORDER_IDS);
    const normalizedStored = stored.map((id) => String(id));
    const storedIds = normalizedStored.filter(
      (id, index) => knownIds.has(id) && normalizedStored.indexOf(id) === index
    );
    const missingIds = DEFAULT_ORDER_IDS.filter((id) => !storedIds.includes(id));

    return [...storedIds, ...missingIds];
  } catch {
    return DEFAULT_ORDER_IDS;
  }
}

function matchesSearch(country, query) {
  if (!query) return true;

  return (
    country.country.toLowerCase().includes(query) ||
    country.continent.toLowerCase().includes(query) ||
    country.timezone.toLowerCase().includes(query)
  );
}

function App() {
  const [currentHour, setCurrentHour] = useState(() => new Date().getHours());
  const [isDigital, setIsDigital] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [orderedIds, setOrderedIds] = useState(getInitialOrderedIds);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    const interval = setInterval(() => setCurrentHour(new Date().getHours()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orderedIds));
    } catch {
      // Ignore storage failures; dragging should still work for the current session.
    }
  }, [orderedIds]);

  const showStars = currentHour >= 20 || currentHour < 7;

  const orderedCountries = orderedIds
    .map((id) => countryById.get(id))
    .filter(Boolean);
  const safeOrderedCountries =
    orderedCountries.length === countriesArray.length ? orderedCountries : countriesArray;
  const q = search.trim().toLowerCase();
  const visibleCountries = q
    ? safeOrderedCountries.filter((country) => matchesSearch(country, q))
    : safeOrderedCountries;

  const countRef = useRef(visibleCountries.length);
  useEffect(() => { countRef.current = visibleCountries.length; }, [visibleCountries.length]);

  useEffect(() => { setSelectedIndex(null); }, [search]);

  useEffect(() => {
    function onKey(e) {
      if (
        ["BUTTON", "INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName) ||
        document.activeElement?.dataset.sortableCard === "true"
      ) {
        return;
      }
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      setSelectedIndex((prev) => {
        const len = countRef.current;
        if (len === 0) return null;
        if (prev === null) return e.key === "ArrowRight" ? 0 : len - 1;
        return e.key === "ArrowRight" ? (prev + 1) % len : (prev - 1 + len) % len;
      });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onDragStart({ active }) {
    setActiveId(String(active.id));
  }

  function reorderClocks(active, over) {
    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    setOrderedIds((prev) => {
      const visibleIds = prev.filter((id) => {
        const country = countryById.get(id);
        return country && matchesSearch(country, q);
      });
      const oldIdx = visibleIds.indexOf(activeId);
      const newIdx = visibleIds.indexOf(overId);
      if (oldIdx === -1 || newIdx === -1 || oldIdx === newIdx) return prev;

      const reorderedVisible = arrayMove(visibleIds, oldIdx, newIdx);
      const visibleIdSet = new Set(visibleIds);
      let vi = 0;

      return prev.map((id) => (visibleIdSet.has(id) ? reorderedVisible[vi++] : id));
    });
  }

  function onDragEnd({ active, over }) {
    reorderClocks(active, over);
    setActiveId(null);
  }

  const activeCountry = activeId ? countryById.get(activeId) : null;

  return (
    <div
      className="min-h-screen flex flex-col items-center gap-10 py-10 px-4 relative overflow-x-hidden"
      style={{ background: getSkyBackground(currentHour) }}
    >
      {showStars && (
        <div className="absolute inset-0 pointer-events-none">
          {STARS.map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                "--star-opacity": s.opacity,
                opacity: s.opacity,
                animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center gap-4 w-full max-w-6xl">
        <Header />
        <div className="flex gap-2">
          <button
            onClick={() => setIsDigital(false)}
            className={`text-xs px-3 py-1 rounded-full border transition-all duration-200 ${
              !isDigital
                ? "border-cyan-400/70 bg-cyan-400/10 text-cyan-400"
                : "border-white/10 text-white/25 hover:text-white/40"
            }`}
            style={orbitron}
          >
            Analog
          </button>
          <button
            onClick={() => setIsDigital(true)}
            className={`text-xs px-3 py-1 rounded-full border transition-all duration-200 ${
              isDigital
                ? "border-cyan-400/70 bg-cyan-400/10 text-cyan-400"
                : "border-white/10 text-white/25 hover:text-white/40"
            }`}
            style={orbitron}
          >
            Digital
          </button>
        </div>

        <div className="relative w-full max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/50 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search city, region, or timezone…"
            className="w-full pl-9 pr-9 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs placeholder-white/25 focus:outline-none focus:border-cyan-400/50 focus:bg-cyan-400/5 transition-all duration-200"
            style={orbitron}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
        <p className="text-white/20 text-xs" style={orbitron}>← → to navigate</p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragOver={({ active, over }) => reorderClocks(active, over)}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
          <SortableContext
          items={visibleCountries.map((c) => String(c.id))}
          strategy={rectSortingStrategy}
        >
          <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center">
            {visibleCountries.length > 0 ? (
              visibleCountries.map((country, i) => (
                <SortableCard
                  key={country.id}
                  country={country}
                  isDigital={isDigital}
                  isSelected={selectedIndex === i}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center gap-2 py-20 text-white/25" style={orbitron}>
                <span className="text-4xl">🌐</span>
                <p className="text-sm">No clocks match &ldquo;{search}&rdquo;</p>
              </div>
            )}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeCountry && (
            <div className="relative flex items-center justify-center rounded-3xl p-5 bg-cyan-400/10 ring-1 ring-cyan-400/50 shadow-[0_0_40px_rgba(6,182,212,0.25)] opacity-95">
              <ClockContainer country={activeCountry} isDigital={isDigital} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default App;
