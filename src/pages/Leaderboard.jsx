import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useSidebar } from "../context/SidebarContext";
import { useGame } from "../context/GameContext";
import { supabase } from "../lib/supabase";

function Leaderboard() {
  const { isCollapsed } = useSidebar();
  const { userId } = useGame();

  const [filter, setFilter] = useState("xp");
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const marginClass = isCollapsed ? "md:ml-20" : "md:ml-64";

  useEffect(() => {
  async function fetchLeaderboard() {
    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, xp, coins, avatar_url")
      .order(filter, { ascending: false })
      .limit(20);

    if (error) {
      console.error("Erro ao buscar ranking:", error.message);
      setPlayers([]);
    } else {
      setPlayers(data || []);
    }

    setLoading(false);
  }

  fetchLeaderboard();
  }, [filter]);

  return (
    <>
      <Sidebar />

      <div className={`${marginClass} min-h-screen bg-gray-50 transition-all duration-300`}>
        <Navbar />

        <main className="p-6 pb-24">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-8 text-white shadow-xl mb-8">
            <h1 className="text-4xl font-bold">Leaderboard</h1>
            <p className="mt-2 text-purple-100">
              Veja os melhores estudantes no ranking global.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => setFilter("xp")}
              className={`px-5 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 ${
                filter === "xp"
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-600"
              }`}
            >
              Ranking por XP
            </button>

            <button
              onClick={() => setFilter("coins")}
              className={`px-5 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 ${
                filter === "coins"
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-600"
              }`}
            >
              Ranking por Moedas
            </button>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center text-gray-500">
              Carregando ranking...
            </div>
          ) : players.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center text-gray-500">
              Nenhum estudante encontrado no ranking.
            </div>
          ) : (
            <div className="space-y-4">
              {players.map((player, index) => {
                const isCurrentUser = player.id === userId;

                return (
                  <div
                    key={player.id}
                    className={`bg-white rounded-2xl shadow-md p-5 border hover:scale-[1.02] hover:shadow-xl transition-all duration-300 flex items-center gap-5 ${
                      isCurrentUser
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-100"
                    }`}
                  >
                    <div className="text-3xl font-bold w-12 text-center">
                      {index === 0
                        ? "🥇"
                        : index === 1
                        ? "🥈"
                        : index === 2
                        ? "🥉"
                        : `#${index + 1}`}
                    </div>

                    <img
                      src={
                        player.avatar_url ||
                        `https://api.dicebear.com/7.x/adventurer/svg?seed=${player.name || "User"}`
                      }
                      alt={player.name || "Usuário"}
                      className="w-16 h-16 rounded-full bg-purple-100 p-2"
                    />

                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-800">
                        {player.name || "Usuário Stoody"}{" "}
                        {isCurrentUser && (
                          <span className="text-purple-600">(Você)</span>
                        )}
                      </h2>

                      <p className="text-gray-500">
                        {player.xp || 0} XP • 🪙 {player.coins || 0} moedas
                      </p>
                    </div>

                    <div className="text-right hidden sm:block">
                      <p className="text-sm text-gray-500">Pontuação atual</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {player[filter] || 0}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default Leaderboard;
