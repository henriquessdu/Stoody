import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useSidebar } from "../context/SidebarContext";
import { useGame } from "../context/GameContext";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { isCollapsed } = useSidebar();
  const { userName, userEmail, xp, xpMax, level, coins, completedCourses } = useGame();
  const navigate = useNavigate();

  const marginClass = isCollapsed ? "md:ml-20" : "md:ml-64";

  const cursosIniciados = 3;
  const cursosConcluidos = completedCourses.length;
  const avataresComprados = 4;
  const diasConsecutivos = 7;
  const rankingGlobal = 128;

  const progressoXp = xpMax ? (xp / xpMax) * 100 : 0;

  return (
    <>
      <Sidebar />
      <div className={`${marginClass} min-h-screen bg-gray-50 transition-all duration-300`}>
        <Navbar />

        <main className="p-6 pb-24">
          {/* HEADER */}
          <section className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-8 text-white shadow-xl mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img
                src="https://api.dicebear.com/7.x/adventurer/svg?seed=Henrique"
                alt="Avatar do usuário"
                className="w-32 h-32 rounded-full bg-white/20 p-3"
              />

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold">
                  {userName || "Usuário Stoody"}
                </h1>

                <p className="text-purple-100 mt-1">
                  {userEmail || "email@stoody.com"}
                </p>

                {/* XP BAR */}
                <div className="mt-5">
                  <div className="flex justify-between text-sm text-purple-100 mb-1">
                    <span>XP</span>
                    <span>{xp}/{xpMax}</span>
                  </div>

                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div
                      className="bg-white h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progressoXp}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* LEVEL */}
              <div className="bg-white/20 backdrop-blur rounded-2xl p-5 text-center min-w-32">
                <p className="text-sm text-purple-100">Level</p>
                <p className="text-4xl font-bold">{level}</p>
              </div>
            </div>
          </section>

          {/* CARDS */}
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Cursos iniciados" value={cursosIniciados} icon="📚" />
            <Card title="Cursos concluídos" value={cursosConcluidos} icon="✅" />
            <Card title="Avatares comprados" value={avataresComprados} icon="🧑‍🎤" />
            <Card title="XP atual" value={xp} icon="⭐" />
            <Card title="Moedas" value={coins} icon="🪙" />
            <Card title="Dias consecutivos" value={diasConsecutivos} icon="🔥" />
          </section>

          {/* RANKING */}
          <section className="mt-8 bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:scale-[1.02] hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Ranking Global
            </h2>

            <p className="text-gray-500">
              Você está na posição{" "}
              <span className="font-bold text-purple-600">
                #{rankingGlobal}
              </span>{" "}
              entre os estudantes.
            </p>

            <button
              onClick={() => navigate("/leaderboard")}
              className="mt-5 bg-purple-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-purple-700 hover:scale-105 transition-all duration-300"
            >
              Ver ranking completo
            </button>
          </section>
        </main>
      </div>
    </>
  );
}

function Card({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 hover:scale-105 hover:shadow-xl transition-all duration-300">
      <div className="text-3xl mb-3">{icon}</div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  );
}

export default Profile;