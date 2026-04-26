import { useState } from "react";
import countriesArray from "./countriesArray";
import ClockContainer from "./ClockContainer";
import Buttons from "./Buttons";

function App() {
  const [currentCountryIndex, setCurrentCountryIndex] = useState(0);

  const handleNext = () => {
    setCurrentCountryIndex(
      (prevIndex) => (prevIndex + 1) % countriesArray.length
    );
  };

  const handlePrevious = () => {
    setCurrentCountryIndex((prevIndex) =>
      prevIndex === 0 ? countriesArray.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="flex-col min-h-screen flex items-center justify-center bg-gray-950 gap-16">
      <ClockContainer country={countriesArray[currentCountryIndex]} />
      <Buttons onPrevious={handlePrevious} onNext={handleNext} />
    </div>
  );
}

export default App;
