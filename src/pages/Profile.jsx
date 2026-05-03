import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useSidebar } from "../context/SidebarContext";
import { useGame } from "../context/GameContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Profile() {
  const { isCollapsed } = useSidebar();
  const { userId, userName, userEmail, xp, xpMax, level, coins, completedCourses } = useGame();
  const navigate = useNavigate();

  const [ownedAvatars, setOwnedAvatars] = useState([]);
  const [currentAvatar, setCurrentAvatar] = useState("");
  const [rankingGlobal, setRankingGlobal] = useState("-");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const marginClass = isCollapsed ? "md:ml-20" : "md:ml-64";
  const initialAvatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
    userName || "Stoody"
  )}`;

  const cursosIniciados = 3;
  const cursosConcluidos = completedCourses.length;
  const avataresComprados = ownedAvatars.filter((avatar) => !avatar.isInitial).length;
  const diasConsecutivos = 7;
  const progressoXp = xpMax ? (xp / xpMax) * 100 : 0;

  useEffect(() => {
    async function loadProfileData() {
      if (!userId) return;

      setLoading(true);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", userId)
        .single();

      setCurrentAvatar(profileData?.avatar_url || initialAvatarUrl);

      const { data: avatarsData, error: avatarsError } = await supabase
        .from("user_avatars")
        .select("avatars(id, name, image_url, price)")
        .eq("user_id", userId);

      if (avatarsError) {
        console.error("Erro ao carregar avatares comprados:", avatarsError.message);
      }

      const formattedAvatars = (avatarsData || [])
        .map((item) => item.avatars)
        .filter(Boolean);

      const avatarsWithInitial = [
        {
          id: "initial-avatar",
          name: "Avatar inicial",
          image_url: initialAvatarUrl,
          isInitial: true,
        },
        ...formattedAvatars.filter(
          (avatar) => avatar.image_url !== initialAvatarUrl
        ),
      ];

      setOwnedAvatars(avatarsWithInitial);

      const { data: rankingData } = await supabase
        .from("profiles")
        .select("id, xp")
        .order("xp", { ascending: false });

      if (rankingData) {
        const position = rankingData.findIndex((user) => user.id === userId) + 1;
        setRankingGlobal(position || "-");
      }

      setLoading(false);
    }

    loadProfileData();
  }, [userId, initialAvatarUrl]);

  async function selectAvatar(avatarUrl) {
    setMessage("");

    const { error } = await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", userId);

    if (error) {
      setMessage("Não foi possível alterar o avatar.");
      return;
    }

    setCurrentAvatar(avatarUrl);
    setMessage("Avatar atualizado com sucesso!");
  }

  const avatarPrincipal = currentAvatar || initialAvatarUrl;

  return (
    <>
      <Sidebar />
      <div className={`${marginClass} min-h-screen bg-gray-50 transition-all duration-300`}>
        <Navbar />

        <main className="p-6 pb-24">
          <section className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-8 text-white shadow-xl mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img
                src={avatarPrincipal}
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

              <div className="bg-white/20 backdrop-blur rounded-2xl p-5 text-center min-w-32">
                <p className="text-sm text-purple-100">Level</p>
                <p className="text-4xl font-bold">{level}</p>
              </div>
            </div>
          </section>

          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Cursos iniciados" value={cursosIniciados} icon="📚" />
            <Card title="Cursos concluídos" value={cursosConcluidos} icon="✅" />
            <Card title="Avatares comprados" value={avataresComprados} icon="🧑‍🎤" />
            <Card title="XP atual" value={xp} icon="⭐" />
            <Card title="Moedas" value={coins} icon="🪙" />
            <Card title="Dias consecutivos" value={diasConsecutivos} icon="🔥" />
          </section>

          <section className="mt-8 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
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

          <section className="mt-8 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Meus Avatares
                </h2>
                <p className="text-gray-500">
                  Escolha um avatar comprado para usar no seu perfil.
                </p>
              </div>

              <button
                onClick={() => navigate("/shop")}
                className="bg-purple-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-purple-700 hover:scale-105 transition-all duration-300"
              >
                Ir para loja
              </button>
            </div>

            {message && (
              <div className="mb-5 bg-purple-50 text-purple-700 rounded-xl p-3">
                {message}
              </div>
            )}

            {loading ? (
              <p className="text-gray-500">Carregando avatares...</p>
            ) : ownedAvatars.length === 0 ? (
              <p className="text-gray-500">
                Você ainda não comprou nenhum avatar.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {ownedAvatars.map((avatar) => {
                  const selected = currentAvatar === avatar.image_url;

                  return (
                    <div
                      key={avatar.id}
                      className={`rounded-2xl shadow-md p-5 border hover:scale-105 hover:shadow-xl transition-all duration-300 ${
                        selected
                          ? "bg-purple-50 border-purple-500"
                          : "bg-white border-gray-100"
                      }`}
                    >
                      <div className="bg-purple-50 rounded-2xl p-4 mb-4">
                        <img
                          src={avatar.image_url}
                          alt={avatar.name}
                          className="w-full h-32 object-contain"
                        />
                      </div>

                      <h3 className="text-lg font-bold text-gray-800">
                        {avatar.name}
                      </h3>

                      <button
                        onClick={() => selectAvatar(avatar.image_url)}
                        disabled={selected}
                        className={`mt-4 w-full px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
                          selected
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-purple-600 text-white hover:bg-purple-700 hover:scale-105"
                        }`}
                      >
                        {selected ? "Selecionado" : "Usar avatar"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
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
