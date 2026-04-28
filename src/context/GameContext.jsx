import { createContext, useContext, useState, useEffect, useCallback } from "react";

const GameContext = createContext();

export function GameProvider({ children }) {
  // Estado principal
  const [xp, setXp] = useState(() => Number(localStorage.getItem("xp")) || 0);
  const [coins, setCoins] = useState(() => Number(localStorage.getItem("coins")) || 0);
  const [level, setLevel] = useState(() => Number(localStorage.getItem("level")) || 1);
  const [xpMax, setXpMax] = useState(() => Number(localStorage.getItem("xpMax")) || 100);
  const [search, setSearch] = useState(() => localStorage.getItem("search") || "");
  
  // Cursos completados
  const [completedCourses, setCompletedCourses] = useState(() => {
    const saved = localStorage.getItem("completedCourses");
    return saved ? JSON.parse(saved) : [];
  });

  // Animações
  const [levelPulse, setLevelPulse] = useState(false);
  const [coinAnim, setCoinAnim] = useState(false);

  // Salvar no localStorage
  useEffect(() => {
    localStorage.setItem("xp", xp);
    localStorage.setItem("coins", coins);
    localStorage.setItem("level", level);
    localStorage.setItem("xpMax", xpMax);
    localStorage.setItem("search", search);
    localStorage.setItem("completedCourses", JSON.stringify(completedCourses));
  }, [xp, coins, level, xpMax, search, completedCourses]);

  // Adicionar XP e gerenciar level
  const addXP = useCallback((amount) => {
    setXp((prev) => {
      let newXp = prev + amount;
      let newLevel = level;
      let newXpMax = xpMax;

      while (newXp >= newXpMax) {
        newXp -= newXpMax;
        newLevel += 1;
        newXpMax = Math.floor(newXpMax * 1.3);

        setLevelPulse(true);
        setTimeout(() => setLevelPulse(false), 3000);
      }

      setLevel(newLevel);
      setXpMax(newXpMax);

      return newXp;
    });
  }, [level, xpMax]);

  // Adicionar moedas
  const addCoins = useCallback((amount) => {
    setCoinAnim(true);
    setTimeout(() => setCoinAnim(false), 1500);
    setCoins((prev) => prev + amount);
  }, []);

  // Marcar curso como completo
  const completeCourse = useCallback((courseId) => {
    setCompletedCourses((prev) => {
      if (!prev.includes(courseId)) {
        return [...prev, courseId];
      }
      return prev;
    });
  }, []);

  // Verificar se curso foi completado
  const isCourseCompleted = useCallback((courseId) => {
    return completedCourses.includes(courseId);
  }, [completedCourses]);

  // Resetar dados (para logout)
  const resetProgress = useCallback(() => {
    setXp(0);
    setLevel(1);
    setXpMax(100);
    setCoins(0);
    setCompletedCourses([]);
    setSearch("");
    localStorage.clear();
  }, []);

  const value = {
    xp,
    level,
    xpMax,
    coins,
    search,
    setSearch,
    completedCourses,
    levelPulse,
    coinAnim,
    addXP,
    addCoins,
    completeCourse,
    isCourseCompleted,
    resetProgress,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame deve ser usado dentro de GameProvider");
  }
  return context;
}