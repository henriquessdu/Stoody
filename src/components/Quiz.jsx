import React, { useState, useCallback, useMemo } from "react";

// Dados de exemplo - substitua com dados reais da API/contexto
const SAMPLE_QUESTIONS = [
  {
    question: "Qual é a capital do Japão?",
    options: ["Osaka", "Tóquio", "Quioto", "Yokohama"],
    correct: 1,
  },
  {
    question: "Em que ano a série Pokemon foi lançada?",
    options: ["1994", "1996", "1998", "2000"],
    correct: 1,
  },
  {
    question: "Qual é o tipo de Pikachu?",
    options: ["Fogo", "Água", "Elétrico", "Grama"],
    correct: 2,
  },
  {
    question: "Qual desses é um Pokémon tipo água?",
    options: ["Blastoise", "Charizard", "Venusaur", "Alakazam"],
    correct: 0,
  },
  {
    question: "Qual é a cor do cabelo do Ash?",
    options: ["Preto", "Castanho", "Marrom", "Loiro"],
    correct: 0,
  },
];

export default function Quiz({
  questions = SAMPLE_QUESTIONS,
  courseId,
  addXP,
  addCoins,
  onFinish,
  xpPerQuestion = 20,
  coinsPerQuestion = 10,
}) {
  // Estados principais
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizMode, setQuizMode] = useState("selecting"); // selecting | showing-result | final
  const [userAnswers, setUserAnswers] = useState([]); // Array com índices das respostas
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [totalXp, setTotalXp] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);

  // Função auxiliar para obter o índice da resposta correta
  // Normaliza comparação entre diferentes formatos (string ou índice)
  const getCorrectAnswerIndex = useCallback((question) => {
    if (!question) return -1;
    
    const { correct, correctAnswer, options } = question;
    const correctValue = correct !== undefined ? correct : correctAnswer;
    
    // Se é um número, retorna direto (já é índice)
    if (typeof correctValue === 'number') {
      return correctValue;
    }
    
    // Se é uma string, encontra o índice na array de options
    if (typeof correctValue === 'string') {
      return options.indexOf(correctValue);
    }
    
    return -1;
  }, []);

  // Dados derivados
  const currentQuestion = useMemo(
    () => questions[currentQuestionIndex],
    [questions, currentQuestionIndex]
  );
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const correctAnswerCount = useMemo(() => {
    return userAnswers.filter((answer, idx) => {
      const questionAtIndex = questions[idx];
      if (!questionAtIndex) return false;
      
      const correctIndex = getCorrectAnswerIndex(questionAtIndex);
      return answer === correctIndex;
    }).length;
  }, [userAnswers, questions, getCorrectAnswerIndex]);
  const alreadyCompleted = useMemo(() => {
    if (!courseId) return false;
    return localStorage.getItem(`quizCompleted_${courseId}`) === "true";
  }, [courseId]);

  // Função para selecionar resposta (sem confirmar ainda)
  const handleSelectAnswer = useCallback((answerIndex) => {
    if (quizMode !== "selecting") return; // Só permite durante seleção
    setSelectedAnswer(answerIndex);
  }, [quizMode]);

  // Função para confirmar resposta
  const handleConfirmAnswer = useCallback(() => {
    if (selectedAnswer === null) return; // Precisa selecionar algo

    // Obtém o índice correto usando a função normalizada
    const correctIndex = getCorrectAnswerIndex(currentQuestion);
    const isCorrect = selectedAnswer === correctIndex;
    
    setIsAnswerCorrect(isCorrect);

    // Adiciona resposta ao array
    setUserAnswers((prev) => [...prev, selectedAnswer]);

    // Calcula recompensa (só se não completou antes)
    if (!alreadyCompleted && isCorrect) {
      setTotalXp((prev) => prev + xpPerQuestion);
      setTotalCoins((prev) => prev + coinsPerQuestion);
    }

    // Muda para modo de resultado
    setQuizMode("showing-result");
  }, [selectedAnswer, currentQuestion, xpPerQuestion, coinsPerQuestion, alreadyCompleted, getCorrectAnswerIndex]);

  // Função para ir para próxima pergunta
  const handleNextQuestion = useCallback(() => {
    if (isLastQuestion) {
      // Finaliza quiz
      setQuizMode("final");
      
      // Marca como completo no localStorage (se não estava)
      if (courseId && !alreadyCompleted) {
        localStorage.setItem(`quizCompleted_${courseId}`, "true");
      }
    } else {
      // Vai para próxima pergunta
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setQuizMode("selecting");
    }
  }, [isLastQuestion, courseId, alreadyCompleted]);

  // Função para finalizar e integrar com GameContext
  const handleFinishQuiz = useCallback(() => {
    // Só adiciona recompensa se não completou antes
    if (!alreadyCompleted && addXP && addCoins) {
      addXP(totalXp);
      addCoins(totalCoins);
    }

    if (onFinish) {
      onFinish({
        totalXp,
        totalCoins,
        correctAnswers: correctAnswerCount,
        totalQuestions: questions.length,
        accuracy: Math.round((correctAnswerCount / questions.length) * 100),
      });
    }
  }, [totalXp, totalCoins, correctAnswerCount, questions.length, alreadyCompleted, addXP, addCoins, onFinish]);

  // ==================== RENDER ====================

  // TELA FINAL
  if (quizMode === "final") {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Celebração */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Quiz Concluído!
            </h1>
            <p className="text-gray-600">
              Parabéns pelo seu desempenho!
            </p>
          </div>

          {/* Cards de Resultado */}
          <div className="space-y-4 mb-8">
            {/* Acertos */}
            <div className="bg-white rounded-2xl p-6 border-2 border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-semibold">Acertos</span>
                <span className="text-2xl font-bold text-green-600">
                  {correctAnswerCount}/{questions.length}
                </span>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                Taxa de acerto: <span className="font-bold text-green-600">
                  {Math.round((correctAnswerCount / questions.length) * 100)}%
                </span>
              </div>
            </div>

            {/* XP Ganho */}
            {!alreadyCompleted && totalXp > 0 && (
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">XP Ganho</span>
                  <span className="text-3xl font-bold">+{totalXp}</span>
                </div>
                <div className="mt-2 text-sm text-purple-100">
                  ✨ Experiência adquirida
                </div>
              </div>
            )}

            {/* Coins Ganho */}
            {!alreadyCompleted && totalCoins > 0 && (
              <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Moedas Ganhas</span>
                  <span className="text-3xl font-bold">+{totalCoins}</span>
                </div>
                <div className="mt-2 text-sm text-yellow-100">
                  💰 Use na loja
                </div>
              </div>
            )}

            {/* Aviso de Reexecução */}
            {alreadyCompleted && (
              <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">ℹ️</span>
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">Modo Prática</p>
                    <p className="text-sm text-blue-700">
                      Você já completou este quiz! Continue praticando sem ganhar recompensas.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botão Finalizar */}
          <button
            onClick={handleFinishQuiz}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            Finalizar e Voltar
          </button>
        </div>
      </div>
    );
  }

  // TELA PRINCIPAL (SELEÇÃO / RESULTADO)
  return (
    <div className="w-full min-h-screen bg-white">
      {/* HEADER STICKY */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-white to-purple-50 border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* XP */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-purple-100 rounded-full text-sm font-bold text-purple-600">
              ✨
            </span>
            <span className="text-sm font-bold text-gray-900">{totalXp}</span>
          </div>

          {/* COINS */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-yellow-100 rounded-full text-sm font-bold">
              💰
            </span>
            <span className="text-sm font-bold text-gray-900">{totalCoins}</span>
          </div>
        </div>

        {/* PROGRESSO */}
        <div className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {currentQuestionIndex + 1}/{questions.length}
        </div>
      </div>

      {/* BARRA DE PROGRESSO */}
      <div className="h-1 bg-gray-200">
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-500"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* CONTEÚDO */}
      <div className="px-4 py-8 max-w-2xl mx-auto">
        {/* NÚMERO DA PERGUNTA */}
        <div className="mb-8">
          <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
            Pergunta {currentQuestionIndex + 1}
          </span>
        </div>

        {/* PERGUNTA */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">
            {currentQuestion.question}
          </h2>
        </div>

        {/* OPÇÕES */}
        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const correctIndex = getCorrectAnswerIndex(currentQuestion);
            const isCorrect = index === correctIndex;
            const showCorrect = quizMode === "showing-result" && isCorrect;
            const showWrong = quizMode === "showing-result" && isSelected && !isCorrect;

            let bgClass = "bg-white border-2 border-gray-200";
            let hoverClass = "hover:border-purple-300 hover:bg-purple-50";
            let cursorClass = "cursor-pointer";

            if (quizMode === "showing-result") {
              hoverClass = "";
              cursorClass = "cursor-not-allowed";

              if (showCorrect) {
                bgClass = "bg-green-50 border-2 border-green-500";
              } else if (showWrong) {
                bgClass = "bg-red-50 border-2 border-red-500";
              } else {
                bgClass = "bg-gray-50 border-2 border-gray-200";
              }
            } else if (isSelected) {
              bgClass = "bg-purple-50 border-2 border-purple-600";
              hoverClass = "";
            }

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={quizMode === "showing-result"}
                className={`w-full p-4 rounded-2xl text-left font-medium transition-all duration-300 ${bgClass} ${hoverClass} ${cursorClass} group`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-full font-bold transition-all ${
                        isSelected && quizMode === "selecting"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-200 text-gray-600 group-hover:bg-purple-200"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-gray-900">{option}</span>
                  </div>

                  {/* Ícone de Feedback */}
                  {quizMode === "showing-result" && (
                    <div>
                      {showCorrect && (
                        <div className="flex items-center gap-1">
                          <span className="text-green-600 font-bold">✓</span>
                        </div>
                      )}
                      {showWrong && (
                        <div className="flex items-center gap-1">
                          <span className="text-red-600 font-bold">✗</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* FEEDBACK VISUAL */}
        {quizMode === "showing-result" && (
          <div
            className={`mb-8 p-4 rounded-2xl border-2 flex items-start gap-3 animate-in fade-in duration-300 ${
              isAnswerCorrect
                ? "bg-green-50 border-green-300"
                : "bg-red-50 border-red-300"
            }`}
          >
            <span className="text-2xl flex-shrink-0 mt-1">
              {isAnswerCorrect ? "✅" : "❌"}
            </span>
            <div>
              <p className={`font-bold ${isAnswerCorrect ? "text-green-700" : "text-red-700"}`}>
                {isAnswerCorrect ? "Resposta Correta!" : "Resposta Incorreta"}
              </p>
              <p className={`text-sm mt-1 ${isAnswerCorrect ? "text-green-600" : "text-red-600"}`}>
                {isAnswerCorrect
                  ? `+${xpPerQuestion} XP +${coinsPerQuestion} Moedas`
                  : alreadyCompleted
                  ? "Modo prática - sem recompensas"
                  : "Tente novamente"}
              </p>
            </div>
          </div>
        )}

        {/* BOTÕES */}
        <div className="flex gap-3 mt-8">
          {quizMode === "selecting" && (
            <button
              onClick={handleConfirmAnswer}
              disabled={selectedAnswer === null}
              className={`flex-1 py-4 rounded-2xl font-bold transition-all duration-300 ${
                selectedAnswer !== null
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:scale-105 active:scale-95"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Confirmar
            </button>
          )}

          {quizMode === "showing-result" && (
            <button
              onClick={handleNextQuestion}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              {isLastQuestion ? "Ver Resultado Final" : "Próxima Pergunta"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}