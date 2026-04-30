import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useSidebar } from "../context/SidebarContext";
import { useGame } from "../context/GameContext";

function Shop() {
  const { isCollapsed } = useSidebar();
  const { coins } = useGame();
  const marginClass = isCollapsed ? "md:ml-20" : "md:ml-64";

  const avatars = [
    { name: "Anime Hero", price: 120, image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Anime" },
    { name: "Space Explorer", price: 180, image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Space" },
    { name: "Magic Student", price: 150, image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Magic" },
    { name: "Cyber Ninja", price: 220, image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ninja" },
  ];

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

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {avatars.map((avatar) => (
              <div
                key={avatar.name}
                className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 hover:scale-105 hover:shadow-xl transition-all duration-300"
              >
                <div className="bg-purple-50 rounded-2xl p-4 mb-4">
                  <img
                    src={avatar.image}
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

                  <button className="bg-purple-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-purple-700 hover:scale-105 transition-all duration-300">
                    Comprar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export default Shop;