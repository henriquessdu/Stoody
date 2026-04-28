import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import logo from "../assets/logo-stoody.png";

function Sidebar() {
  const navigate = useNavigate();
  const { resetProgress } = useGame();

  function handleLogout() {
    resetProgress();
    navigate("/");
  }

  return (
    <aside className="w-64 fixed h-screen bg-white shadow-lg p-6 flex flex-col border-r border-gray-200">
      {/* Logo */}
      <div className="mb-10 flex justify-center">
        <img
          src={logo}
          alt="Stoody"
          className="h-20 object-contain cursor-pointer hover:opacity-80 transition"
          onClick={() => navigate("/home")}
        />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3 flex-1">
        <button
          onClick={() => navigate("/home")}
          className="text-left px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-purple-50 hover:text-purple-600 transition flex items-center gap-3"
        >
          <span className="text-xl">📚</span>
          Courses
        </button>

        <button className="text-left px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-purple-50 hover:text-purple-600 transition flex items-center gap-3">
          <span className="text-xl">🛒</span>
          Shop
        </button>

        <button className="text-left px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-purple-50 hover:text-purple-600 transition flex items-center gap-3">
          <span className="text-xl">👤</span>
          Profile
        </button>

        <button className="text-left px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-purple-50 hover:text-purple-600 transition flex items-center gap-3">
          <span className="text-xl">🏆</span>
          Leaderboard
        </button>
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="text-left px-4 py-3 rounded-lg text-red-600 font-medium hover:bg-red-50 transition flex items-center gap-3 w-full"
      >
        <span className="text-xl">🚪</span>
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;