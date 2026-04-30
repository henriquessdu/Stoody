import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useSidebar } from "../context/SidebarContext";
import { useGame } from "../context/GameContext";
import { supabase } from "../lib/supabase";

function Shop() {
  const { isCollapsed } = useSidebar();
  const { userId, coins, addCoins } = useGame();

  const [avatars, setAvatars] = useState([]);
  const [ownedAvatars, setOwnedAvatars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);
  const [message, setMessage] = useState("");

  const marginClass = isCollapsed ? "md:ml-20" : "md:ml-64";

  useEffect(() => {
    async function loadShop() {
      setLoading(true);

      const { data: avatarsData, error: avatarsError } = await supabase
        .from("avatars")
        .select("*")
        .order("price", { ascending: true });

      if (avatarsError) {
        console.error("Erro ao carregar avatares:", avatarsError.message);
      } else {
        setAvatars(avatarsData || []);
      }

      if (userId) {
        const { data: ownedData, error: ownedError } = await supabase
          .from("user_avatars")
          .select("avatar_id")
          .eq("user_id", userId);

        if (ownedError) {
          console.error("Erro ao carregar avatares comprados:", ownedError.message);
        } else {
          setOwnedAvatars((ownedData || []).map((item) => item.avatar_id));
        }
      }

      setLoading(false);
    }

    loadShop();
  }, [userId]);

  async function buyAvatar(avatar) {
    setMessage("");

    if (!userId) {
      setMessage("Você precisa estar logado para comprar avatares.");
      return;
    }

    if (ownedAvatars.includes(avatar.id)) {
      setMessage("Você já comprou este avatar.");
      return;
    }

    if (coins < avatar.price) {
      setMessage("Moedas insuficientes para comprar este avatar.");
      return;
    }

    setBuyingId(avatar.id);

    const { error } = await supabase.from("user_avatars").insert({
      user_id: userId,
      avatar_id: avatar.id,
    });

    if (error) {
      setMessage("Não foi possível comprar este avatar.");
      console.error("Erro ao comprar avatar:", error.message);
      setBuyingId(null);
      return;
    }

    await addCoins(-avatar.price);
    setOwnedAvatars((prev) => [...prev, avatar.id]);
    setMessage("Avatar comprado com sucesso!");
    setBuyingId(null);
  }

  return (
    <>
      <Sidebar />
      <div className={`${marginClass} min-h-screen bg-gray-50 transition-all duration-300`}>
        <Navbar />

        <main className="p-6 pb-24">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-8 text-white shadow-xl mb-8">
            <h1 className="text-4xl font-bold">Avatar Shop</h1>
            <p className="mt-2 text-purple-100">
              Compre avatares para personalizar seu perfil.
            </p>

            <div className="mt-5 bg-white/20 backdrop-blur px-5 py-3 rounded-2xl inline-block font-bold">
              🪙 Suas moedas: {coins}
            </div>
          </div>

          {message && (
            <div className="mb-6 bg-white rounded-2xl shadow-md p-4 text-gray-700 border border-gray-100">
              {message}
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center text-gray-500">
              Carregando avatares...
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {avatars.map((avatar) => {
                const isOwned = ownedAvatars.includes(avatar.id);
                const isBuying = buyingId === avatar.id;

                return (
                  <div
                    key={avatar.id}
                    className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 hover:scale-105 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="bg-purple-50 rounded-2xl p-4 mb-4">
                      <img
                        src={avatar.image_url}
                        alt={avatar.name}
                        className="w-full h-40 object-contain"
                      />
                    </div>

                    <h2 className="text-xl font-bold text-gray-800">{avatar.name}</h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Avatar completo para perfil
                    </p>

                    <div className="flex items-center justify-between mt-5">
                      <span className="font-bold text-purple-600">
                        🪙 {avatar.price}
                      </span>

                      <button
                        onClick={() => buyAvatar(avatar)}
                        disabled={isOwned || isBuying}
                        className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
                          isOwned
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-purple-600 text-white hover:bg-purple-700 hover:scale-105"
                        }`}
                      >
                        {isOwned ? "Comprado" : isBuying ? "Comprando..." : "Comprar"}
                      </button>
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

export default Shop;