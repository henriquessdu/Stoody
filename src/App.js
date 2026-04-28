import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import { SidebarProvider } from "./context/SidebarContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CoursePlayer from "./pages/CoursePlayer";
import BackgroundLoop from "./components/BackgroundLoop";

function App() {
  return (
    <GameProvider>
      <SidebarProvider>
        <BrowserRouter>
          <BackgroundLoop />

          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/course/:courseId" element={<CoursePlayer />} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </GameProvider>
  );
}

export default App;