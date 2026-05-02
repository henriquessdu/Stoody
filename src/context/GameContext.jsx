import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

const GameContext = createContext();

export function GameProvider({ children }) {
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [level, setLevel] = useState(1);
  const [xpMax, setXpMax] = useState(100);
  const [search, setSearch] = useState("");
  const [completedCourses, setCompletedCourses] = useState([]);

  const [levelPulse, setLevelPulse] = useState(false);
  const [coinAnim, setCoinAnim] = useState(false);

  async function loadProfile(user) {
    if (!user) return;

    setUserId(user.id);
    setUserEmail(user.email);
    setIsAuthenticated(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Erro ao carregar perfil:", error.message);
      return;
    }

    if (data) {
      setUserName(data.name || "");
      setXp(data.xp || 0);
      setCoins(data.coins || 0);
      setLevel(data.level || 1);
      setXpMax(data.xp_max || 100);
    }
  }

  useEffect(() => {
    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Erro ao verificar sessão:", error.message);
      } else if (data.session?.user) {
        await loadProfile(data.session.user);
      }

      setIsAuthLoading(false);
    }

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthLoading(false);

      if (session?.user) {
        loadProfile(session.user);
      } else {
        setIsAuthenticated(false);
        setUserId("");
        setUserName("");
        setUserEmail("");
        setXp(0);
        setCoins(0);
        setLevel(1);
        setXpMax(100);
        setCompletedCourses([]);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const saveProfile = useCallback(async (newData) => {
    if (!userId) return;

    const { error } = await supabase
      .from("profiles")
      .update(newData)
      .eq("id", userId);

    if (error) {
      console.error("Erro ao salvar perfil:", error.message);
    }
  }, [userId]);

  const signup = useCallback(async (name, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      await loadProfile(data.user);
    }

    return { success: true };
  }, []);

  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: "Email ou senha incorretos" };
    }

    await loadProfile(data.user);

    return { success: true };
  }, []);

  const resetProgress = useCallback(async () => {
    await supabase.auth.signOut();

    setIsAuthenticated(false);
    setUserId("");
    setUserName("");
    setUserEmail("");
    setXp(0);
    setLevel(1);
    setXpMax(100);
    setCoins(0);
    setCompletedCourses([]);
    setSearch("");
  }, []);

  const addXP = useCallback(async (amount) => {
    let newXp = xp + amount;
    let newLevel = level;
    let newXpMax = xpMax;

    while (newXp >= newXpMax) {
      newXp -= newXpMax;
      newLevel += 1;
      newXpMax = Math.floor(newXpMax * 1.3);

      setLevelPulse(true);
      setTimeout(() => setLevelPulse(false), 3000);
    }

    setXp(newXp);
    setLevel(newLevel);
    setXpMax(newXpMax);

    await saveProfile({
      xp: newXp,
      level: newLevel,
      xp_max: newXpMax,
    });
  }, [xp, level, xpMax, saveProfile]);

  const addCoins = useCallback(async (amount) => {
    const newCoins = coins + amount;

    setCoinAnim(true);
    setTimeout(() => setCoinAnim(false), 1500);

    setCoins(newCoins);

    await saveProfile({
      coins: newCoins,
    });
  }, [coins, saveProfile]);

  const completeCourse = useCallback((courseId) => {
    setCompletedCourses((prev) => {
      if (!prev.includes(courseId)) {
        return [...prev, courseId];
      }
      return prev;
    });
  }, []);

  const isCourseCompleted = useCallback((courseId) => {
    return completedCourses.includes(courseId);
  }, [completedCourses]);

  const value = {
    isAuthLoading,
    isAuthenticated,
    userId,
    userName,
    userEmail,
    xp,
    level,
    xpMax,
    coins,
    search,
    setSearch,
    completedCourses,
    levelPulse,
    coinAnim,
    signup,
    login,
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
