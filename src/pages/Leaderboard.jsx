import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useSidebar } from "../context/SidebarContext";
import { useGame } from "../context/GameContext";

function Leaderboard() {
  const { isCollapsed } = useSidebar();
  const { userName, xp, coins } = useGame();
  const [filter, setFilter] = useState("xp");

  const marginClass = isCollapsed ? "md:ml-20" : "md:ml-64";

  const players = [
    { name: "Ana Clara", xp: 2450, coins: 980, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ana" },
    { name: "Lucas", xp: 2210, coins: 1250, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Lucas" },
    { name: userName || "Você", xp, coins, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=You", current: true },
    { name: "Marina", xp: 1780, coins: 720, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Marina" },
    { name: "Pedro", xp: 1510, coins: 1540, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Pedro" },
    { name: "Julia", xp: 1320, coins: 610, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Julia" },
  ];

  const ranking = [...players].sort((a, b) => b[filter] - a[filter]);

  return (
    <>
      <Sidebar />
      <div className={`${marginClass} min-h-screen bg-gray-50 transition-all`}>
        <Navbar />

        <main className="p-6 pb-24">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-8 text-white shadow-xl mb-8">
            <h1 className="text-4xl font-bold">Leaderboard</h1>
            <p className="mt-2 text-purple-100">
              Veja os melhores estudantes no ranking global.
            </p>
          </div>

          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setFilter("xp")}
              className={`px-5 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 ${
                filter === "xp"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-600"
              }`}
            >
              Ranking por XP
            </button>

            <button
              onClick={() => setFilter("coins")}
              className={`px-5 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 ${
                filter === "coins"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-600"
              }`}
            >
              Ranking por Moedas
            </button>
          </div>

          <div className="space-y-4">
            {ranking.map((player, index) => (
              <div
                key={player.name}
                className={`bg-white rounded-2xl shadow-md p-5 border hover:scale-[1.02] hover:shadow-xl transition-all duration-300 flex items-center gap-5 ${
                  player.current ? "border-purple-500 bg-purple-50" : "border-gray-100"
                }`}
              >
                <div className="text-3xl font-bold w-12 text-center">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                </div>

                <img
                  src={player.avatar}
                  alt={player.name}
                  className="w-16 h-16 rounded-full bg-purple-100 p-2"
                />

                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800">
                    {player.name} {player.current && <span className="text-purple-600">(Você)</span>}
                  </h2>
                  <p className="text-gray-500">
                    {player.xp} XP • 🪙 {player.coins} moedas
                  </p>
                </div>

                <div className="text-right hidden sm:block">
                  <p className="text-sm text-gray-500">
                    Pontuação atual
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {player[filter]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export default Leaderboard;