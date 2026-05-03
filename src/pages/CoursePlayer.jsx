import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useSidebar } from '../context/SidebarContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import VideoSection from '../components/VideoSection';
import Quiz from '../components/Quiz';
import CompletionCard from '../components/CompletionCard';
import { supabase } from '../lib/supabase';

function getCorrectAnswerIndex(question) {
  if (!question) return -1;

  const correctValue =
    question.correct !== undefined ? question.correct : question.correctAnswer;

  if (typeof correctValue === 'number') {
    return correctValue;
  }

  if (typeof correctValue === 'string') {
    return question.options.indexOf(correctValue);
  }

  return -1;
}

function buildFallbackReviewAnswers(questions) {
  return questions.map((question) => {
    const correctAnswerIndex = getCorrectAnswerIndex(question);

    return {
      question: question.question,
      options: question.options,
      selectedAnswerIndex: null,
      selectedAnswer: null,
      correctAnswerIndex,
      correctAnswer: question.options[correctAnswerIndex] || null,
      isCorrect: false,
    };
  });
}

export default function CoursePlayer() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { userId, addXP, addCoins, isCourseCompleted, completeCourse } = useGame();
  const { isCollapsed } = useSidebar();

  const marginClass = isCollapsed ? "md:ml-20" : "md:ml-64";

  // Dados dos cursos
  const coursesData = {
    'japanese-anime': {
      title: 'Japanese for Anime Fans',
      description: 'Learn essential Japanese expressions used in anime conversations.',
      videoUrl: 'https://www.youtube.com/embed/YuoCJJuEcg4',
      totalXp: 100,
      totalCoins: 50,
      questions: [
        {
          question: 'What does "Kaidoku" mean in the context of treasure maps?',
          options: ['Deciphering', 'Sailing', 'Treasure hunt', 'Map reading'],
          correctAnswer: 'Deciphering',
        },
        {
          question: 'When Zoro says "Ore wa...", what is he about to define?',
          options: ['His sword', 'Himself', 'His strength', 'His dream'],
          correctAnswer: 'Himself',
        },
        {
          question: 'Translate: "Kaizoku ou ni ore wa naru!"',
          options: [
            'I will become the Pirate King!',
            'Eat meat with me!',
            'I am a strong warrior',
            'The treasure is mine',
          ],
          correctAnswer: 'I will become the Pirate King!',
        },
        {
          question: 'Which phrase is used to express determination in anime?',
          options: ['Sugoi', 'Ganbare', 'Yamete', 'Daijoubu'],
          correctAnswer: 'Ganbare',
        },
        {
          question: 'What does "arigatou gozaimasu" mean?',
          options: ['Hello', 'Goodbye', 'Thank you very much', 'Sorry'],
          correctAnswer: 'Thank you very much',
        },
      ],
    },
    'english-pokemon': {
      title: 'Learn English with Pokémon',
      description: 'Practice English vocabulary and grammar with Pokémon characters.',
      videoUrl: 'https://www.youtube.com/embed/4uO5zv084SA',
      totalXp: 80,
      totalCoins: 40,
      questions: [
        {
          question: 'What is the English word for the process of a Pokémon changing form?',
          options: ['Transform', 'Evolve', 'Morph', 'Change'],
          correctAnswer: 'Evolve',
        },
        {
          question: 'Which Pokémon is known as the "Electric Mouse"?',
          options: ['Charizard', 'Blastoise', 'Pikachu', 'Venusaur'],
          correctAnswer: 'Pikachu',
        },
        {
          question: 'Complete the phrase: "Gotta ____ them all!"',
          options: ['Catch', 'Find', 'Get', 'Hunt'],
          correctAnswer: 'Catch',
        },
        {
          question: 'What type of Pokémon is Dragonite?',
          options: ['Water/Ice', 'Dragon/Flying', 'Fire/Dragon', 'Electric'],
          correctAnswer: 'Dragon/Flying',
        },
        {
          question: 'Which region is the first Pokémon game set in?',
          options: ['Johto', 'Hoenn', 'Kanto', 'Sinnoh'],
          correctAnswer: 'Kanto',
        },
      ],
    },
    'spanish-basics': {
      title: 'Spanish Basics',
      description: 'Master the fundamental Spanish phrases and pronunciation.',
      videoUrl: 'https://www.youtube.com/embed/cYI8G02ELSo',
      totalXp: 60,
      totalCoins: 30,
      questions: [
        {
          question: 'How do you say "Hello" in Spanish?',
          options: ['Adiós', 'Hola', 'Gracias', 'Por favor'],
          correctAnswer: 'Hola',
        },
        {
          question: 'What does "Buenos días" mean?',
          options: ['Good night', 'Good morning', 'Good afternoon', 'Goodbye'],
          correctAnswer: 'Good morning',
        },
        {
          question: 'How do you say "Thank you" in Spanish?',
          options: ['Disculpe', 'Gracias', 'De nada', 'Perdón'],
          correctAnswer: 'Gracias',
        },
        {
          question: 'What is "Water" in Spanish?',
          options: ['Agua', 'Jugo', 'Leche', 'Vino'],
          correctAnswer: 'Agua',
        },
        {
          question: 'Complete: "Me llamo ____" means "My name is ____"',
          options: ['Eres', 'Soy', 'Es', 'Any name'],
          correctAnswer: 'Any name',
        },
      ],
    },
  };

  const course = coursesData[courseId];

  // Estados da página
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(() => isCourseCompleted(courseId));
  const [loading, setLoading] = useState(true);
  const [latestAttempt, setLatestAttempt] = useState(null);
  const [reviewMode, setReviewMode] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    async function loadLatestAttempt() {
      if (!userId || !courseId) return;

      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Erro ao carregar tentativa do quiz:', error.message);
        return;
      }

      if (data) {
        setLatestAttempt(data);
        setQuizCompleted(true);
        completeCourse(courseId);
      }
    }

    loadLatestAttempt();
  }, [userId, courseId, completeCourse]);

  if (!course) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Curso não encontrado</h1>
          <button
            onClick={() => navigate('/home')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Voltar para Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4 mx-auto" />
          <p className="text-gray-600 font-semibold">Carregando lição...</p>
        </div>
      </div>
    );
  }

  // Calcular XP e coins por pergunta
  const xpPerQuestion = Math.ceil(course.totalXp / course.questions.length);
  const coinsPerQuestion = Math.ceil(course.totalCoins / course.questions.length);

  // Handler para iniciar o quiz
  const handleStartQuiz = () => {
    setStarted(true);
  };

  // Handler para finalizar o quiz
  const handleFinishQuiz = async ({
    totalXp,
    totalCoins,
    correctAnswers,
    totalQuestions,
    accuracy,
    answers,
  }) => {
    setXpEarned(totalXp);
    setCoinsEarned(totalCoins);
    setFinished(true);

    // Adicionar recompensas ao contexto
    addXP(totalXp);
    addCoins(totalCoins);

    // Marcar como completado
    completeCourse(courseId);

    const attempt = {
      course_id: courseId,
      course_title: course.title,
      answers: answers || buildFallbackReviewAnswers(course.questions),
      correct_answers: correctAnswers,
      total_questions: totalQuestions,
      accuracy,
      xp_earned: totalXp,
      coins_earned: totalCoins,
      completed_at: new Date().toISOString(),
    };

    setLatestAttempt(attempt);

    if (userId) {
      const { error } = await supabase.from('quiz_attempts').insert({
        user_id: userId,
        ...attempt,
      });

      if (error) {
        console.error('Erro ao salvar tentativa do quiz:', error.message);
      }
    }
  };

  // Handler para completar a lição
  const handleCompleteLesson = () => {
    setQuizCompleted(true);
    navigate('/home');
  };

  if (reviewMode && latestAttempt) {
    return (
      <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
        <Sidebar />
        <div className={`flex-1 ${marginClass} transition-all duration-300 flex flex-col pb-20 md:pb-0`}>
          <Navbar />
          <QuizReview
            courseTitle={course.title}
            attempt={latestAttempt}
            onBack={() => setReviewMode(false)}
          />
        </div>
      </div>
    );
  }

  // Estado 1: Quiz já foi completado - mostrar vídeo + mensagem
  if (quizCompleted && !started) {
    return (
      <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
        <Sidebar />
        <div className={`flex-1 ${marginClass} transition-all duration-300 flex flex-col pb-20 md:pb-0`}>
          <Navbar />
          <div className="w-full bg-white flex flex-col">
            <VideoSection videoUrl={course.videoUrl} title={course.title} />

            {/* Mensagem de conclusão */}
            <div className="px-4 py-6 max-w-4xl mx-auto w-full">
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl border-2 border-green-200">
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">✅</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-green-900 mb-2">Lição Concluída!</h3>
                    <p className="text-sm text-green-800 mb-3">
                      Você já completou esta lição com sucesso!
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-purple-600">{course.totalXp}</p>
                        <p className="text-xs text-gray-600">XP Ganho</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-yellow-600">{course.totalCoins}</p>
                        <p className="text-xs text-gray-600">Moedas</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botão */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setReviewMode(true)}
                  disabled={!latestAttempt}
                  className={`flex-1 py-3 font-bold rounded-2xl transition-all active:scale-95 ${
                    latestAttempt
                      ? 'bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Revisar respostas
                </button>

                <button
                  onClick={() => navigate('/home')}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:shadow-lg transition-all active:scale-95"
                >
                  Voltar para Cursos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Estado 2: Quiz em progresso
  if (started && !finished) {
    return (
      <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
        <Sidebar />
        <div className={`flex-1 ${marginClass} transition-all duration-300 flex flex-col pb-20 md:pb-0`}>
          <Navbar />
          <div className="w-full bg-white">
            <Quiz
              courseId={courseId}
              questions={course.questions}
              onFinish={handleFinishQuiz}
              xpPerQuestion={xpPerQuestion}
              coinsPerQuestion={coinsPerQuestion}
            />
          </div>
        </div>
      </div>
    );
  }

  // Estado 3: Quiz finalizado - mostrar completion card
  if (finished) {
    return (
      <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
        <Sidebar />
        <div className={`flex-1 ${marginClass} transition-all duration-300 flex flex-col pb-20 md:pb-0`}>
          <Navbar />
          <div className="w-full bg-white">
            <CompletionCard
              xpEarned={xpEarned}
              coinsEarned={coinsEarned}
              onComplete={handleCompleteLesson}
              onReview={() => setReviewMode(true)}
            />
          </div>
        </div>
      </div>
    );
  }

  // Estado inicial: Antes de começar
  return (
    <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
      <Sidebar />
      <div className={`flex-1 ${marginClass} transition-all duration-300 flex flex-col pb-20 md:pb-0`}>
        <Navbar />
        <div className="w-full bg-white">
          <VideoSection videoUrl={course.videoUrl} title={course.title} />

          {/* Botão para começar */}
          <div className="px-4 py-8 max-w-4xl mx-auto w-full">
            <button
              onClick={handleStartQuiz}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 mb-6"
            >
              <span>🎯</span>
              <span>Começar Prova</span>
            </button>

            {/* Info card */}
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
              <p className="text-sm text-gray-700 mb-3">
                <span className="font-bold">📝 {course.questions.length} perguntas</span>
                {' • '}
                <span className="font-bold">⏱️ ~5 minutos</span>
              </p>
              <p className="text-xs text-gray-600 mb-3">
                Responda corretamente para ganhar <strong>{course.totalXp} XP</strong> e <strong>{course.totalCoins} moedas</strong>.
              </p>
              <div className="flex gap-2">
                <div className="flex-1 text-center bg-white p-2 rounded-lg">
                  <p className="text-xs font-semibold text-purple-600">Total XP</p>
                  <p className="text-lg font-bold text-gray-900">+{course.totalXp}</p>
                </div>
                <div className="flex-1 text-center bg-white p-2 rounded-lg">
                  <p className="text-xs font-semibold text-yellow-600">Moedas</p>
                  <p className="text-lg font-bold text-gray-900">+{course.totalCoins}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizReview({ courseTitle, attempt, onBack }) {
  const answers = attempt.answers || [];
  const totalQuestions = attempt.total_questions || answers.length;
  const correctAnswers =
    attempt.correct_answers ??
    answers.filter((answer) => answer.isCorrect).length;
  const accuracy =
    attempt.accuracy ??
    (totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0);

  return (
    <main className="w-full bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 px-5 py-3 rounded-xl bg-white text-gray-700 font-bold border border-gray-200 hover:bg-gray-100 transition"
        >
          Voltar
        </button>

        <section className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-8 text-white shadow-xl mb-8">
          <p className="text-purple-100 font-semibold mb-2">Revisão do quiz</p>
          <h1 className="text-3xl md:text-4xl font-bold">{courseTitle}</h1>

          <div className="grid sm:grid-cols-3 gap-3 mt-6">
            <div className="bg-white/20 rounded-2xl p-4">
              <p className="text-sm text-purple-100">Acertos</p>
              <p className="text-3xl font-bold">
                {correctAnswers}/{totalQuestions}
              </p>
            </div>
            <div className="bg-white/20 rounded-2xl p-4">
              <p className="text-sm text-purple-100">Taxa</p>
              <p className="text-3xl font-bold">{accuracy}%</p>
            </div>
            <div className="bg-white/20 rounded-2xl p-4">
              <p className="text-sm text-purple-100">Recompensas</p>
              <p className="text-2xl font-bold">
                +{attempt.xp_earned || 0} XP
              </p>
            </div>
          </div>
        </section>

        <div className="space-y-5">
          {answers.map((answer, answerIndex) => (
            <article
              key={`${answer.question}-${answerIndex}`}
              className={`bg-white rounded-2xl shadow-md border-2 p-5 ${
                answer.isCorrect ? 'border-green-200' : 'border-red-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm font-bold text-purple-600 mb-2">
                    Pergunta {answerIndex + 1}
                  </p>
                  <h2 className="text-xl font-bold text-gray-900">
                    {answer.question}
                  </h2>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    answer.isCorrect
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {answer.isCorrect ? 'Correta' : 'Incorreta'}
                </span>
              </div>

              <div className="space-y-3">
                {(answer.options || []).map((option, optionIndex) => {
                  const isSelected = answer.selectedAnswerIndex === optionIndex;
                  const isCorrect = answer.correctAnswerIndex === optionIndex;

                  let optionClass = 'border-gray-200 bg-gray-50 text-gray-700';

                  if (isCorrect) {
                    optionClass = 'border-green-500 bg-green-50 text-green-800';
                  } else if (isSelected) {
                    optionClass = 'border-red-500 bg-red-50 text-red-800';
                  }

                  return (
                    <div
                      key={`${option}-${optionIndex}`}
                      className={`border-2 rounded-xl p-4 font-medium ${optionClass}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span>{option}</span>
                        <span className="text-sm font-bold">
                          {isCorrect ? 'Gabarito' : isSelected ? 'Sua resposta' : ''}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
