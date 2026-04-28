import React from 'react';

export default function CompletionCard({
  xpEarned,
  coinsEarned,
  onComplete,
}) {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
      {/* Animated celebration background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-5 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>
          🎉
        </div>
        <div className="absolute top-20 right-10 text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>
          🎊
        </div>
        <div className="absolute bottom-32 left-10 text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>
          ⭐
        </div>
        <div className="absolute bottom-40 right-5 text-4xl animate-bounce" style={{ animationDelay: '0.6s' }}>
          🎉
        </div>
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mb-4 shadow-lg animate-bounce">
            <span className="text-3xl">🏆</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Parabéns!</h1>
          <p className="text-gray-600">Você completou a lição com sucesso</p>
        </div>

        {/* Cards de Recompensas */}
        <div className="space-y-4 mb-8">
          {/* XP Card */}
          <div className="p-6 bg-white rounded-3xl shadow-lg border-2 border-purple-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-600">XP GANHO</span>
              <span className="text-3xl">✨</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                +{xpEarned}
              </span>
              <span className="text-gray-600 font-semibold">pontos</span>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Coins Card */}
          <div className="p-6 bg-white rounded-3xl shadow-lg border-2 border-yellow-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-600">MOEDAS GANHAS</span>
              <span className="text-3xl">💰</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                +{coinsEarned}
              </span>
              <span className="text-gray-600 font-semibold">moedas</span>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* Badge Unlock */}
        <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl mb-8 border border-purple-200 animate-pulse">
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl">🎖️</span>
            <div>
              <p className="text-xs font-semibold text-purple-900">INSÍGNIA DESBLOQUEADA</p>
              <p className="text-sm font-bold text-purple-700">Aluno Dedicado Badge</p>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="p-3 bg-white rounded-2xl text-center shadow-md">
            <p className="text-2xl font-bold text-gray-900">5</p>
            <p className="text-xs text-gray-600 font-semibold">Questões</p>
          </div>
          <div className="p-3 bg-white rounded-2xl text-center shadow-md">
            <p className="text-2xl font-bold text-green-600">100%</p>
            <p className="text-xs text-gray-600 font-semibold">Taxa</p>
          </div>
          <div className="p-3 bg-white rounded-2xl text-center shadow-md">
            <p className="text-2xl font-bold text-purple-600">+1</p>
            <p className="text-xs text-gray-600 font-semibold">Streak</p>
          </div>
        </div>

        {/* Botão Finalizar */}
        <button
          onClick={onComplete}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 mb-4"
        >
          Finalizar e Voltar
        </button>

        {/* Próxima lição */}
        <button 
          className="w-full py-3 border-2 border-purple-600 text-purple-600 font-bold rounded-2xl hover:bg-purple-50 transition-all"
        >
          Próxima Lição →
        </button>
      </div>
    </div>
  );
}
