import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import logo from "../assets/logo-stoody.png";
import fundo from "../assets/idiomas.png";

function Login() {
  const navigate = useNavigate();
  const { login } = useGame();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError("Por favor, insira um email válido");
      return;
    }

    if (password.length < 6) {
      setError("Senha deve ter no mínimo 6 caracteres");
      return;
    }

    setLoading(true);

    const result = await login(email.toLowerCase(), password);

    if (result.success) {
      navigate("/home");
    } else {
      setError(result.error);
    }

    setLoading(false);
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(${fundo})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <nav className="relative z-10 w-full px-4 sm:px-8 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md shadow-md">
        <img
          src={logo}
          className="h-12 sm:h-16 object-contain cursor-pointer hover:opacity-80 transition"
          alt="Stoody"
          onClick={() => navigate("/")}
        />

        <div className="flex gap-2 sm:gap-3 items-center">
          <button
            onClick={() => navigate("/about")}
            className="border-2 border-purple-600 text-purple-600 px-3 sm:px-6 py-2 rounded-full font-semibold hover:bg-purple-50 transition text-sm sm:text-base"
          >
            About Us
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 sm:px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all text-sm sm:text-base"
          >
            Sign Up
          </button>
        </div>
      </nav>

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 sm:py-0">
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Welcome Back! 👋
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Continue sua jornada de aprendizado
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>

            <input
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none transition text-base"
              placeholder="seu@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Senha
            </label>

            <div className="relative">
              <input
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none transition pr-12 text-base"
                placeholder="••••••"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-3 text-gray-600 hover:text-purple-600 transition"
                disabled={loading}
              >
                {showPass ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mb-4 text-base"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="text-center text-sm text-gray-600">
            <button
              type="button"
              onClick={() => navigate("/signup")}
              disabled={loading}
              className="w-full border-2 border-purple-600 text-purple-600 font-semibold py-3 rounded-lg hover:bg-purple-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              Criar conta grátis 🚀
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;