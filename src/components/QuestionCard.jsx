import React, { useState } from 'react';

export default function QuestionCard({
  questionNumber,
  totalQuestions,
  question,
  options,
  correctAnswer,
  onAnswer,
}) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelectOption = (option) => {
    if (answered) return; // Bloqueia múltiplas respostas

    setSelectedAnswer(option);
    const correct = option === correctAnswer;
    setIsCorrect(correct);
    setAnswered(true);

    // Chama callback depois de um pequeno delay para mostrar feedback
    setTimeout(() => {
      onAnswer(correct);
    }, 1500);
  };

  return (
    <div className="w-full px-4 py-6">
      {/* Progresso */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-gray-700">
            Pergunta {questionNumber} de {totalQuestions}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <div
                key={i}
                className={`h-2 w-6 rounded-full transition-all ${
                  i < questionNumber
                    ? 'bg-purple-600'
                    : i === questionNumber - 1
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div
            className="bg-gradient-to-r from-purple-600 to-pink-500 h-1 rounded-full transition-all duration-500"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Pergunta */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 leading-relaxed">
          {question}
        </h2>
      </div>

      {/* Opções */}
      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isAnswerCorrect = option === correctAnswer;

          let buttonClass = 'border-2 border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50';

          if (answered) {
            if (isAnswerCorrect) {
              buttonClass = 'border-2 border-green-500 bg-green-50';
            } else if (isSelected && !isCorrect) {
              buttonClass = 'border-2 border-red-500 bg-red-50';
            }
          } else if (isSelected) {
            buttonClass = 'border-2 border-purple-600 bg-purple-50';
          }

          return (
            <button
              key={index}
              onClick={() => handleSelectOption(option)}
              disabled={answered}
              className={`w-full p-4 rounded-2xl text-left font-medium transition-all duration-300 ${buttonClass} ${
                answered ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900">{option}</span>
                {answered && (
                  <div>
                    {isAnswerCorrect && (
                      <svg
                        className="w-5 h-5 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {isSelected && !isCorrect && (
                      <svg
                        className="w-5 h-5 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback visual */}
      {answered && (
        <div
          className={`mt-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in duration-300 ${
            isCorrect
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {isCorrect ? (
            <>
              <svg
                className="w-5 h-5 text-green-600 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold text-green-900">Correto!</p>
                <p className="text-xs text-green-700">+20 XP +10 Coins</p>
              </div>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 text-red-600 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold text-red-900">Incorreto</p>
                <p className="text-xs text-red-700">Tente melhorar no próximo!</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
