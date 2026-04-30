import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import { SidebarProvider } from "./context/SidebarContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import CoursePlayer from "./pages/CoursePlayer";
import Shop from "./pages/Shop";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";

function App() {
  return (
    <GameProvider>
      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="/home" element={<Home />} />
            <Route path="/course/:courseId" element={<CoursePlayer />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/avatar/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </GameProvider>
  );
}

export default App;