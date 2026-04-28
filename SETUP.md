# 🎓 Stoody - E-Learning Gamificado

Um sistema completo de plataforma de e-learning gamificada construído com **React + Tailwind CSS**, oferecendo uma experiência interativa de aprendizado de idiomas com sistema de pontuação, níveis e moedas.

---

## ✨ Funcionalidades

### 🎮 Sistema de Gamificação
- **XP (Experience Points)**: Ganhe pontos ao completar quizzes
- **Níveis**: Suba de nível a cada 100 XP (aumenta 1.3x a cada level)
- **Moedas**: Ganhe moedas completando lições
- **Badges**: Insígnias desbloqueadas ao completar cursos
- **Progresso Visual**: Barra de XP e contador de stats em tempo real

### 📚 Cursos Interativos
- **3 Cursos Completos**:
  - 🇯🇵 Japanese for Anime (150 XP, 50 Coins)
  - 🇬🇧 English with Pokémon (120 XP, 40 Coins)
  - 🇪🇸 Spanish Basics (100 XP, 30 Coins)

### 🎬 Fluxo de Aprendizado
1. **Vídeo**: Assista ao conteúdo da aula
2. **Quiz**: 5 perguntas de múltipla escolha
3. **Recompensas**: Ganhe XP e Moedas instantaneamente
4. **Conclusão**: Receba feedback visual e badges

### 💾 Persistência
- Todos os dados salvos automaticamente no **localStorage**
- Progresso sincronizado entre abas/janelas
- Cursos marcados como "Completados" e não podem ser refeitos

### 🔐 Sistema de Autenticação Simples
- Login com validação de email
- Acesso rápido sem cadastro ("Começar Agora")
- Logout com reset de dados (opcional)

---

## 🏗️ Arquitetura

### Estrutura de Pastas
```
src/
├── context/
│   └── GameContext.jsx        # Estado global (Context API)
├── pages/
│   ├── Home.jsx              # Lista de cursos
│   ├── CoursePlayer.jsx       # Video + Quiz + Completion
│   └── Login.jsx             # Tela de login
├── components/
│   ├── Navbar.jsx            # Barra superior com stats
│   ├── Sidebar.jsx           # Menu lateral
│   ├── CourseCard.jsx        # Card do curso
│   ├── VideoSection.jsx      # Player de vídeo
│   ├── Quiz.jsx              # Container do quiz
│   ├── QuestionCard.jsx      # Card de pergunta
│   └── CompletionCard.jsx    # Tela de conclusão
├── App.js                    # Router principal
└── index.js                  # Entry point
```

### Context API (GameContext)

**Estado Global**:
```javascript
{
  xp: number,
  level: number,
  xpMax: number,
  coins: number,
  search: string,
  completedCourses: string[],
  levelPulse: boolean,      // animação
  coinAnim: boolean         // animação
}
```

**Funções**:
```javascript
addXP(amount)              // Adiciona XP e sobe nível
addCoins(amount)           // Adiciona moedas
completeCourse(courseId)   // Marca como completo
isCourseCompleted(courseId) // Verifica se completo
resetProgress()            // Reseta tudo (logout)
```

---

## 🚀 Como Usar

### Instalação

```bash
cd stoody
npm install
```

### Desenvolvimento

```bash
npm start
```

Abre em `http://localhost:3000`

### Build para Produção

```bash
npm run build
```

---

## 📝 Rotas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | Login.jsx | Tela inicial de login |
| `/home` | Home.jsx | Lista de cursos disponíveis |
| `/course/:courseId` | CoursePlayer.jsx | Aula com vídeo + quiz |

---

## 🎮 Cursos Disponíveis

### Japanese for Anime
- **ID**: `japanese-anime`
- **XP Total**: 150
- **Coins Total**: 50
- **Perguntas**: 5
- **Tópicos**: Kanji, frases anime, expressões

### English with Pokémon
- **ID**: `english-pokemon`
- **XP Total**: 120
- **Coins Total**: 40
- **Perguntas**: 5
- **Tópicos**: Vocabulário, evolução, batalhas

### Spanish Basics
- **ID**: `spanish-basics`
- **XP Total**: 100
- **Coins Total**: 30
- **Perguntas**: 5
- **Tópicos**: Saudações, números, frases básicas

---

## 🧮 Sistema de Nível

```
Level 1 → 100 XP (para level 2)
Level 2 → 130 XP (para level 3)
Level 3 → 169 XP (para level 4)
...
Fórmula: xpMax *= 1.3
```

**Exemplo**:
- Completa curso de 150 XP
- Sobe para level 2 (ganhou 50 XP, precisa 50 XP mais)
- Completa outro curso de 100 XP
- Sobe para level 3!

---

## 💾 Dados no LocalStorage

```javascript
{
  xp: "50",
  level: "2",
  xpMax: "130",
  coins: "90",
  search: "",
  completedCourses: '["japanese-anime"]'
}
```

---

## 🎨 Design & UI

### Cores
- **Primária**: Purple (#7c3aed)
- **Secundária**: Pink (#ec4899)
- **Fundo**: Gray-50
- **Texto**: Gray-900

### Componentes
- Botões com gradiente roxo→rosa
- Bordas arredondadas (rounded-2xl)
- Sombras suaves
- Animações de bounce/pulse
- Cards responsivos

### Responsividade
- Mobile First
- Breakpoints: sm, md, lg
- Sidebar dinâmica em desktop
- Navegação mobile-friendly

---

## 🔧 Customização

### Adicionar Novo Curso

Editar `CoursePlayer.jsx`:

```javascript
const coursesData = {
  'novo-curso': {
    title: 'Novo Curso',
    description: 'Descrição do curso',
    videoUrl: 'https://youtube.com/embed/...',
    totalXp: 100,
    totalCoins: 50,
    questions: [
      {
        question: 'Pergunta 1?',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 'A'
      },
      // ... mais 4 perguntas
    ]
  }
}
```

Depois adicionar à Home.jsx:

```javascript
const courses = [
  {
    id: 'novo-curso',
    title: 'Novo Curso',
    xp: 100,
    coins: 50,
    description: 'Descrição...'
  }
]
```

### Mudar Cores

Editar `tailwind.config.js` e trocar os values de `purple` e `pink`.

### Mudar Recompensas

Editar os valores `totalXp` e `totalCoins` em cada curso.

---

## 📊 Fluxo Completo de Uso

```
1. Usuário abre app → Login.jsx
2. Clica "Começar Agora" → Home.jsx
3. Escolhe um curso → CoursePlayer.jsx (estado inicial)
4. Assiste vídeo → Clica "Começar Prova"
5. Responde 5 perguntas → Quiz.jsx
6. Vê resultado → CompletionCard.jsx
7. Ganha XP + Coins → Volta para Home
8. Curso marcado como completo
9. Próxima tentativa mostra "Já Completado"
```

---

## ⚡ Performance

- ✅ Context API para estado global (sem Redux)
- ✅ useCallback para otimizar re-renders
- ✅ Lazy loading de componentes
- ✅ CSS-in-JS com Tailwind (sem bundle extra)
- ✅ LocalStorage assíncrono

---

## 🐛 Debugging

### Limpar Dados
Abra console e rode:
```javascript
localStorage.clear()
location.reload()
```

### Verificar Estado
```javascript
console.log(JSON.parse(localStorage.getItem('xp')))
console.log(JSON.parse(localStorage.getItem('completedCourses')))
```

---

## 📱 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile (iOS/Android)

---

## 🚀 Próximos Passos

Possíveis melhorias:
- [ ] Integração com backend/API
- [ ] Cadastro real com autenticação
- [ ] Mais cursos e lições
- [ ] Sistema de amigos/leaderboard
- [ ] Loja com resgates de moedas
- [ ] Notificações de streak
- [ ] Temas dark/light
- [ ] Modo offline

---

## 📄 Licença

Projeto educacional - Use livremente!

---

## 💬 Suporte

Qualquer dúvida, revise:
- `GameContext.jsx` - Estado global
- `CoursePlayer.jsx` - Lógica de cursos
- `App.js` - Rotas
