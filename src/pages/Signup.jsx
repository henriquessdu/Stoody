import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import logo from "../assets/logo-stoody.png";

function Signup() {
  const navigate = useNavigate();
  const { signup } = useGame();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Por favor, insira seu nome");
      return;
    }

    if (name.trim().length < 3) {
      setError("Nome deve ter pelo menos 3 caracteres");
      return;
    }

    if (!email.includes("@")) {
      setError("Por favor, insira um email válido");
      return;
    }

    if (password.length < 6) {
      setError("Senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não conferem");
      return;
    }

    setLoading(true);

    const result = await signup(name.trim(), email.toLowerCase(), password);

    if (result.success) {
      navigate("/home");
    } else {
      setError(result.error);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-50">
      <nav className="w-full px-4 sm:px-8 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md shadow-md">
        <img
          src={logo}
          className="h-12 sm:h-16 object-contain cursor-pointer hover:opacity-80 transition"
          alt="Stoody"
          onClick={() => navigate("/")}
        />

        <button
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 sm:px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all text-sm sm:text-base"
        >
          Login
        </button>
      </nav>

      <div className="flex flex-1 items-center justify-center px-4 py-8 sm:py-0">
        <form
          onSubmit={handleSignup}
          className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Criar Conta 🚀
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Comece sua jornada de aprendizado
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nome Completo
            </label>
            <input
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none transition text-base"
              placeholder="Seu Nome"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

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

          <div className="mb-4">
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

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirmar Senha
            </label>
            <div className="relative">
              <input
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none transition pr-12 text-base"
                placeholder="••••••"
                type={showPass ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Criando conta..." : "Criar Conta"}
          </button>

          <div className="text-center text-xs sm:text-sm text-gray-600">
            <p>
              Já tem conta?{" "}
              <span
                className="text-purple-600 font-semibold cursor-pointer hover:underline"
                onClick={() => navigate("/")}
              >
                Fazer login
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;