import React from 'react';

export default function VideoSection({ videoUrl, title }) {
  return (
    <div className="w-full px-4 py-6">
      {/* Título e descrição */}
      <div className="mb-6">
        <span className="inline-block px-3 py-1 text-xs font-semibold text-purple-600 bg-purple-100 rounded-full mb-3">
          CURRENTLY STUDYING
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Learn essential Japanese expressions used in anime conversations.
        </p>
      </div>

      {/* Container do vídeo - 16:9 responsivo */}
      <div className="relative w-full bg-gradient-to-br from-purple-400 via-pink-300 to-purple-500 rounded-3xl overflow-hidden shadow-lg mb-6">
        <div className="aspect-video w-full flex items-center justify-center">
          {videoUrl ? (
            <iframe
              className="w-full h-full"
              src={videoUrl}
              title="Course Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-800">
              <div className="text-center">
                <svg
                  className="w-16 h-16 mx-auto text-white opacity-50 mb-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                <p className="text-white text-sm opacity-75">Episódio: One Piece</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Informação do episódio */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl mb-6">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-purple-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Dialogue Analysis</p>
          <p className="text-xs text-gray-600">Luffy's declaration of freedom</p>
        </div>
      </div>
    </div>
  );
}
