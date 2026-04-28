# 🎬 Exemplos Práticos - Stoody Platform

## 📖 Como Usar o GameContext

### Usar em um Componente

```jsx
import { useGame } from '../context/GameContext';

function MeuComponente() {
  const { xp, level, coins, addXP, addCoins } = useGame();

  return (
    <div>
      <p>XP: {xp}</p>
      <p>Level: {level}</p>
      <p>Coins: {coins}</p>
      
      <button onClick={() => addXP(50)}>
        Ganhar 50 XP
      </button>
      
      <button onClick={() => addCoins(10)}>
        Ganhar 10 Moedas
      </button>
    </div>
  );
}

export default MeuComponente;
```

---

## 🎯 Adicionar Novo Curso

### Passo 1: Editar CoursePlayer.jsx

Adicionar na `const coursesData`:

```javascript
'portugues-basico': {
  title: 'Portuguese Basics',
  description: 'Aprenda português do zero!',
  videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID',
  totalXp: 110,
  totalCoins: 35,
  questions: [
    {
      question: 'How do you say "Hello" in Portuguese?',
      options: ['Olá', 'Adeus', 'Obrigado', 'Por favor'],
      correctAnswer: 'Olá',
    },
    {
      question: 'What does "Tudo bem?" mean?',
      options: ['How are you?', 'What is your name?', 'Where are you from?', 'What time is it?'],
      correctAnswer: 'How are you?',
    },
    {
      question: 'How do you say "Thank you"?',
      options: ['Obrigado (m) / Obrigada (f)', 'De nada', 'Perdão', 'Desculpa'],
      correctAnswer: 'Obrigado (m) / Obrigada (f)',
    },
    {
      question: 'What is the Portuguese word for "water"?',
      options: ['Água', 'Leite', 'Suco', 'Vinho'],
      correctAnswer: 'Água',
    },
    {
      question: 'How do you introduce yourself?',
      options: ['Meu nome é...', 'Eu sou...', 'Chamo-me...', 'Todos estão corretos'],
      correctAnswer: 'Todos estão corretos',
    },
  ],
},
```

### Passo 2: Editar Home.jsx

Adicionar na lista `courses`:

```javascript
{
  id: 'portugues-basico',
  title: 'Portuguese Basics',
  xp: 110,
  coins: 35,
  description: 'Aprenda português do zero com expressões úteis!'
}
```

### Pronto! ✅

O curso agora aparece em Home e é navegável.

---

## 🎨 Customizar Cores

### Editar tailwind.config.js

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',    // Mudou de purple
        secondary: '#EC4899',  // Pink
      }
    }
  }
}
```

Depois, usar em componentes:

```jsx
<button className="bg-primary text-white">
  Clique aqui
</button>
```

---

## 📊 Aumentar Recompensas

### No CoursePlayer.jsx

Alterar os valores:

```javascript
// Antes:
totalXp: 100,
totalCoins: 50,

// Depois:
totalXp: 200,      // Dobrou!
totalCoins: 100,
```

O sistema vai distribuir automaticamente entre as 5 perguntas.

---

## 🔔 Adicionar Evento ao Ganhar XP

### Criar um hook customizado

Criar `src/hooks/useXPNotification.js`:

```javascript
import { useEffect } from 'react';
import { useGame } from '../context/GameContext';

export function useXPNotification() {
  const { xp, levelPulse } = useGame();

  useEffect(() => {
    if (levelPulse) {
      console.log('🎉 Level UP!');
      // Chamar API, tostar notificação, etc
    }
  }, [levelPulse]);
}
```

Usar em um componente:

```jsx
import { useXPNotification } from '../hooks/useXPNotification';

function App() {
  useXPNotification(); // Ativa automáticamente
  
  return <div>...</div>;
}
```

---

## 💾 Salvar/Carregar do Backend

### Criar um serviço

`src/services/gameService.js`:

```javascript
export const gameService = {
  // Salvar progresso
  async saveProgress(gameData) {
    const response = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gameData)
    });
    return response.json();
  },

  // Carregar progresso
  async loadProgress(userId) {
    const response = await fetch(`/api/progress/${userId}`);
    return response.json();
  }
};
```

Usar no GameContext:

```javascript
useEffect(() => {
  gameService.saveProgress({
    xp,
    level,
    coins,
    completedCourses
  });
}, [xp, level, coins, completedCourses]);
```

---

## 🌍 Traduzir Interface

### Criar arquivo de idioma

`src/i18n/pt.json`:

```json
{
  "home.title": "Cursos Recomendados",
  "home.searchPlaceholder": "Buscar cursos...",
  "course.startQuiz": "Começar Prova",
  "course.completed": "Já Completado",
  "quiz.correct": "Correto!",
  "quiz.incorrect": "Incorreto"
}
```

Criar hook:

```javascript
import { useContext } from 'react';
import translations from '../i18n/pt.json';

export function useTranslation() {
  return (key) => {
    const keys = key.split('.');
    let value = translations;
    for (let k of keys) {
      value = value[k];
    }
    return value;
  };
}
```

Usar:

```jsx
const t = useTranslation();

<h1>{t('home.title')}</h1>
```

---

## 🏆 Sistema de Achievements

### Criar em GameContext

```javascript
const [achievements, setAchievements] = useState([]);

const checkAchievements = useCallback((newLevel, totalXp) => {
  const newAchievements = [];

  if (newLevel === 2) {
    newAchievements.push({ id: 'level2', name: 'Iniciante' });
  }
  if (newLevel === 5) {
    newAchievements.push({ id: 'level5', name: 'Intermediário' });
  }
  if (completedCourses.length === 3) {
    newAchievements.push({ id: 'all3', name: 'Curioso' });
  }

  setAchievements(prev => [...prev, ...newAchievements]);
}, [completedCourses]);
```

---

## 🔐 Proteger Rotas

### Criar PrivateRoute

`src/components/PrivateRoute.jsx`:

```jsx
import { Navigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

export function PrivateRoute({ children }) {
  const { level } = useGame();
  
  // Só deixa acessar se > 0 XP (indicando que fez login)
  if (!localStorage.getItem('xp')) {
    return <Navigate to="/" />;
  }

  return children;
}
```

Usar em App.js:

```jsx
<Route 
  path="/course/:courseId" 
  element={
    <PrivateRoute>
      <CoursePlayer />
    </PrivateRoute>
  } 
/>
```

---

## 📈 Gráfico de Progresso

### Instalar Chart.js

```bash
npm install react-chartjs-2 chart.js
```

### Criar componente

`src/components/ProgressChart.jsx`:

```jsx
import { Line } from 'react-chartjs-2';
import { useGame } from '../context/GameContext';

export function ProgressChart() {
  const { xp, level, coins } = useGame();

  const data = {
    labels: ['Semana 1', 'Semana 2', 'Semana 3'],
    datasets: [
      {
        label: 'XP',
        data: [0, 100, xp],
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
      }
    ]
  };

  return <Line data={data} />;
}
```

---

## 🎓 Exportar Certificado

### Criar funcionalidade

`src/utils/certificateGenerator.js`:

```javascript
export function generateCertificate(userName, completedCourses) {
  const html = `
    <div style="border: 10px solid gold; padding: 40px; text-align: center;">
      <h1>Certificado de Conclusão</h1>
      <p>${userName} completou ${completedCourses.length} cursos!</p>
      <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
    </div>
  `;

  const printWindow = window.open('', '', 'height=400,width=600');
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
}
```

---

## 🔄 Sincronizar Entre Abas

### Usar events

```javascript
useEffect(() => {
  // Quando dados mudam em outra aba
  const handleStorageChange = (e) => {
    if (e.key === 'xp') {
      setXp(Number(e.newValue));
    }
  };

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);
```

---

## 📱 Notificações Push

### Instalar

```bash
npm install react-toastify
```

### Usar

```jsx
import { toast } from 'react-toastify';
import { useGame } from '../context/GameContext';

function App() {
  const { levelPulse } = useGame();

  useEffect(() => {
    if (levelPulse) {
      toast.success('🎉 Parabéns! Você subiu de nível!');
    }
  }, [levelPulse]);

  return (
    <>
      <App />
      <ToastContainer />
    </>
  );
}
```

---

## 🎮 Gamificar Mais Ainda

### Adicionar Streak (sequência)

Em GameContext.jsx:

```javascript
const [streakDays, setStreakDays] = useState(0);
const [lastAccessDate, setLastAccessDate] = useState(null);

useEffect(() => {
  const today = new Date().toDateString();
  if (lastAccessDate !== today) {
    if (lastAccessDate === new Date(Date.now() - 86400000).toDateString()) {
      setStreakDays(prev => prev + 1);
    } else {
      setStreakDays(1);
    }
    setLastAccessDate(today);
  }
}, []);
```

---

Esses foram alguns exemplos práticos! 🚀

Para mais, consulte a documentação oficial do React e das bibliotecas usadas.
