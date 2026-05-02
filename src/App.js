import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GameProvider, useGame } from "./context/GameContext";
import { SidebarProvider } from "./context/SidebarContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import CoursePlayer from "./pages/CoursePlayer";
import Shop from "./pages/Shop";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isAuthLoading } = useGame();

  if (isAuthLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <GameProvider>
      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />

            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/course/:courseId"
              element={
                <ProtectedRoute>
                  <CoursePlayer />
                </ProtectedRoute>
              }
            />

            <Route
              path="/shop"
              element={
                <ProtectedRoute>
                  <Shop />
                </ProtectedRoute>
              }
            />

            <Route
              path="/avatar/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </GameProvider>
  );
}

export default App;
