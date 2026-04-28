import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CoursePlayer from "./pages/CoursePlayer";
import BackgroundLoop from "./components/BackgroundLoop";

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <BackgroundLoop />

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/course/:courseId" element={<CoursePlayer />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;