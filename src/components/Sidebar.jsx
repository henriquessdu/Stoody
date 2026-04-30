import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { useSidebar } from "../context/SidebarContext";
import logo from "../assets/logo-stoody.png";

function Sidebar() {
  const navigate = useNavigate();
  const { resetProgress } = useGame();
  const { isCollapsed, toggleSidebar } = useSidebar();

  function handleLogout() {
    resetProgress();
    navigate("/");
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex fixed left-0 top-0 h-screen bg-white shadow-2xl border-r border-gray-200 flex-col z-40 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
        style={{ paddingTop: "1.5rem" }}
      >
        {/* Logo */}
        <div className="mb-10 flex justify-center px-4">
          {!isCollapsed ? (
            <img
              src={logo}
              alt="Stoody"
              className="h-20 object-contain cursor-pointer hover:opacity-80 transition"
              onClick={() => navigate("/home")}
            />
          ) : (
            <div
              className="h-12 w-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition"
              onClick={() => navigate("/home")}
              title="Stoody"
            >
              <span className="text-white font-bold text-xl">S</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-3 flex-1 px-2 overflow-y-auto">
          <button
            onClick={() => navigate("/home")}
            className="text-left px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-purple-50 hover:text-purple-600 transition flex items-center gap-3 whitespace-nowrap"
            title={isCollapsed ? "Courses" : ""}
          >
            <span className="text-xl flex-shrink-0">📚</span>
            {!isCollapsed && <span>Courses</span>}
          </button>

          <button
            onClick={() => navigate("/shop")}
            className="text-left px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-purple-50 hover:text-purple-600 transition flex items-center gap-3 whitespace-nowrap"
            title={isCollapsed ? "Shop" : ""}
          >
            <span className="text-xl flex-shrink-0">🛒</span>
            {!isCollapsed && <span>Shop</span>}
          </button>

          <button
            onClick={() => navigate("/avatar/profile")}
            className="text-left px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-purple-50 hover:text-purple-600 transition flex items-center gap-3 whitespace-nowrap"
            title={isCollapsed ? "Profile" : ""}
          >
            <span className="text-xl flex-shrink-0">👤</span>
            {!isCollapsed && <span>Profile</span>}
          </button>

          <button
            onClick={() => navigate("/leaderboard")}
            className="text-left px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-purple-50 hover:text-purple-600 transition flex items-center gap-3 whitespace-nowrap"
            title={isCollapsed ? "Leaderboard" : ""}
          >
            <span className="text-xl flex-shrink-0">🏆</span>
            {!isCollapsed && <span>Leaderboard</span>}
          </button>
        </nav>

        {/* About Us Button */}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="text-left px-4 py-3 rounded-lg text-red-600 font-medium hover:bg-red-50 transition flex items-center gap-3 whitespace-nowrap mx-2 mb-4"
          title={isCollapsed ? "Logout" : ""}
        >
          <span className="text-xl flex-shrink-0">🚪</span>
          {!isCollapsed && <span>Logout</span>}
        </button>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition border-t border-gray-200 mx-2 mb-2"
          title={isCollapsed ? "Expandir" : "Minimizar"}
        >
          <span className="text-lg">
            {isCollapsed ? "→" : "←"}
          </span>
        </button>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-gray-200 flex justify-around items-center z-40 h-16">
        <button
          onClick={() => navigate("/home")}
          className="flex flex-col items-center justify-center flex-1 h-full text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition py-2"
          title="Home"
        >
          <span className="text-2xl">🏠</span>
          <span className="text-xs mt-1">Home</span>
        </button>

        <button
          onClick={() => navigate("/leaderboard")}
          className="flex flex-col items-center justify-center flex-1 h-full text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition py-2"
          title="Leaderboard"
        >
          <span className="text-2xl">🏆</span>
          <span className="text-xs mt-1">Leaderboard</span>
        </button>

        <button
          onClick={() => navigate("/shop")}
          className="flex flex-col items-center justify-center flex-1 h-full text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition py-2"
          title="Shop"
        >
          <span className="text-2xl">🛒</span>
          <span className="text-xs mt-1">Shop</span>
        </button>

        <button
          onClick={() => navigate("/avatar/profile")}
          className="flex flex-col items-center justify-center flex-1 h-full text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition py-2"
          title="Profile"
        >
          <span className="text-2xl">👤</span>
          <span className="text-xs mt-1">Profile</span>
        </button>
      </nav>
    </>
  );
}

export default Sidebar;