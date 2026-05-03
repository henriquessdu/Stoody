import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useSidebar } from "../context/SidebarContext";
import { useGame } from "../context/GameContext";
import { sendContactEmail } from "../lib/emailjs";

function Contact() {
  const { isCollapsed } = useSidebar();
  const { userName, userEmail } = useGame();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const marginClass = isCollapsed ? "md:ml-20" : "md:ml-64";

  async function handleSubmit(e) {
    e.preventDefault();
    setFeedback("");
    setError("");

    if (title.trim().length < 3) {
      setError("Informe um título com pelo menos 3 caracteres.");
      return;
    }

    if (message.trim().length < 10) {
      setError("Escreva uma mensagem com pelo menos 10 caracteres.");
      return;
    }

    setLoading(true);

    try {
      await sendContactEmail({
        name: userName || "Usuário Stoody",
        email: userEmail,
        title: title.trim(),
        message: message.trim(),
      });

      setTitle("");
      setMessage("");
      setFeedback("Mensagem enviada com sucesso!");
    } catch (err) {
      console.error("Erro ao enviar mensagem de contato:", err);
      setError("Não foi possível enviar sua mensagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Sidebar />
      <div className={`${marginClass} min-h-screen bg-gray-50 transition-all duration-300`}>
        <Navbar />

        <main className="p-6 pb-24">
          <section className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-8 text-white shadow-xl mb-8">
            <h1 className="text-4xl font-bold">Contato</h1>
            <p className="mt-2 text-purple-100">
              Envie uma mensagem para a equipe Stoody.
            </p>
          </section>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8 w-full"
          >
            {feedback && (
              <div className="mb-5 bg-green-50 text-green-700 border border-green-200 rounded-xl p-3">
                {feedback}
              </div>
            )}

            {error && (
              <div className="mb-5 bg-red-50 text-red-700 border border-red-200 rounded-xl p-3">
                {error}
              </div>
            )}

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition text-base"
                placeholder="Sobre o que você quer falar?"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mensagem
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
                rows={12}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition text-base resize-none"
                placeholder="Escreva sua mensagem..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </form>
        </main>
      </div>
    </>
  );
}

export default Contact;
