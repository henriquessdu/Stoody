import React, { useState } from "react";
import QuestionCard from "./QuestionCard";

export default function Quiz({
  questions,
  onFinish,
  xpPerQuestion = 20,
  coinsPerQuestion = 10,
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswer = (isCorrect) => {
    // Calcula ganhos
    const xpGanho = isCorrect ? xpPerQuestion : 0;
    const coinsGanho = isCorrect ? coinsPerQuestion : 0;

    const newXp = totalXp + xpGanho;
    const newCoins = totalCoins + coinsGanho;

    // Atualiza estado
    setTotalXp(newXp);
    setTotalCoins(newCoins);

    // Avança ou finaliza
    setTimeout(() => {
      if (isLastQuestion) {
        onFinish(newXp, newCoins);
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    }, 1500);
  };

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* XP */}
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 rounded-full">
              <span className="text-xs font-bold text-purple-600">✨</span>
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {totalXp}
            </span>
          </div>

          {/* COINS */}
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-yellow-100 rounded-full">
              <span className="text-xs font-bold">💰</span>
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {totalCoins}
            </span>
          </div>
        </div>

        {/* PROGRESSO */}
        <div className="text-xs font-semibold text-gray-600">
          {currentQuestionIndex + 1}/{questions.length}
        </div>
      </div>

      {/* PERGUNTA */}
      <div>
        <QuestionCard
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          question={currentQuestion.question}
          options={currentQuestion.options}
          correctAnswer={currentQuestion.correctAnswer}
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  );
}