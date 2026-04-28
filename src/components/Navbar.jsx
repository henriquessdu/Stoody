import { useState } from "react";
import { useGame } from "../context/GameContext";

function Navbar() {
  const { level, xp, xpMax, coins, levelPulse, coinAnim, search, setSearch } = useGame();

  const courses = [
    "Learn Japanese with Anime",
    "English with Pokémon",
    "Spanish Basics"
  ];

  const [suggestions, setSuggestions] = useState([]);

  function handleChange(value) {
    const safeValue = value ?? "";
    setSearch(safeValue);

    if (safeValue.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = courses.filter(course =>
      course.toLowerCase().includes(safeValue.toLowerCase())
    );

    setSuggestions(filtered);
  }

  function selectCourse(course) {
    setSearch(course ?? "");
    setSuggestions([]);
  }

  const xpPercent = xpMax ? (xp / xpMax) * 100 : 0;

  return (
    <header className="h-24 bg-white shadow-md flex flex-col px-8 justify-center gap-3 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-xs">
          <input
            value={search ?? ""}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Search courses..."
            className="border-2 border-gray-200 p-2 rounded-lg w-full focus:border-purple-600 focus:outline-none transition"
          />

          {suggestions.length > 0 && (
            <div className="absolute bg-white border-2 border-gray-200 w-full mt-1 rounded-lg shadow-lg z-10">
              {suggestions.map((item, i) => (
                <div
                  key={i}
                  onClick={() => selectCourse(item)}
                  className="p-3 hover:bg-purple-50 cursor-pointer border-b last:border-b-0 transition"
                >
                  <p className="text-sm font-medium text-gray-900">{item}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-6 items-center ml-8">
          {/* Level */}
          <div className={`flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg ${levelPulse ? "animate-pulse" : ""}`}>
            <span className="text-lg">⭐</span>
            <div>
              <p className="text-xs text-gray-600">Level</p>
              <p className="text-lg font-bold text-purple-600">{level}</p>
            </div>
          </div>

          {/* Coins */}
          <div className={`flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-lg ${coinAnim ? "animate-pulse" : ""}`}>
            <span className="text-lg">💰</span>
            <div>
              <p className="text-xs text-gray-600">Coins</p>
              <p className="text-lg font-bold text-yellow-600">{coins}</p>
            </div>
          </div>
        </div>
      </div>

      {/* XP Bar */}
      <div className="w-full">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold text-gray-600">XP Progress</span>
          <span className="text-xs font-semibold text-gray-600">{xp}/{xpMax}</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
      </div>
    </header>
  );
}

export default Navbar;