# 🧪 Guia de Teste - Stoody Platform

## ✅ Checklist de Teste Manual

### 1️⃣ **Login Page**
- [ ] Página carrega corretamente
- [ ] Botão "Entrar" valida email (deve ter @)
- [ ] Botão "Entrar" valida senha (min 6 caracteres)
- [ ] Mostrar/esconder senha funciona
- [ ] Erro visual aparece para dados inválidos
- [ ] Clique em "Começar Agora" vai para Home sem validação

### 2️⃣ **Home Page - Lista de Cursos**
- [ ] Sidebar aparece à esquerda
- [ ] Navbar aparece com stats (XP, Level, Coins)
- [ ] 3 cursos aparecem em grid
- [ ] Search funciona (digita "english" mostra apenas ese curso)
- [ ] Cursos mostram title, description, xp, coins
- [ ] Botão "Start Course" navega para `/course/:id`

### 3️⃣ **CoursePlayer - Estado Inicial**
- [ ] Vídeo do YouTube carrega (responsive 16:9)
- [ ] "Começar Prova" funciona → muda de estado
- [ ] Info card mostra número de perguntas
- [ ] Info card mostra total XP e coins

### 4️⃣ **Quiz - Durante**
- [ ] Pergunta 1 de 5 aparece
- [ ] 4 opções para clicar
- [ ] Barra de progresso avança
- [ ] Ao clicar opção:
  - [ ] Fica verde se correta
  - [ ] Fica vermelha se errada
  - [ ] Correta mostra ✓, errada mostra ✗
  - [ ] Mensagem de feedback aparece
  - [ ] Após 1.5s, vai para próxima pergunta

### 5️⃣ **Quiz - Final**
- [ ] CompletionCard aparece após última pergunta
- [ ] Mostra XP ganho (corretas × pontos)
- [ ] Mostra Coins ganho
- [ ] Stats: número de questões, taxa acerto, streak
- [ ] Emojis animados aparecem

### 6️⃣ **XP e Level System**
- [ ] Navbar atualiza em tempo real
- [ ] Ao ganhar XP, barra avança
- [ ] Ao atingir 100 XP, level sobe
- [ ] Level sobe com animação de pulse
- [ ] xpMax aumenta (1.3x)
- [ ] Coins atualizam com animação

### 7️⃣ **Persistência (LocalStorage)**
- [ ] Recarregar página mantém XP
- [ ] Recarregar página mantém Level
- [ ] Recarregar página mantém Coins
- [ ] Ir para outro curso e voltar mantém stats
- [ ] Fechar e abrir navegador mantém tudo

### 8️⃣ **Cursos Completados**
- [ ] Primeira vez: quiz é oferecido
- [ ] Segunda vez: mostra "Já Completado"
- [ ] Mensagem verde aparece
- [ ] Apenas vídeo é mostrado
- [ ] Não oferece fazer quiz novamente

### 9️⃣ **Logout**
- [ ] Clique logout no Sidebar
- [ ] Vai para Login
- [ ] Dados são zerados
- [ ] LocalStorage é limpo

### 🔟 **Responsividade**
- [ ] Mobile (375px): Layout ajusta
- [ ] Tablet (768px): Sidebar oculta/toggle
- [ ] Desktop (1024px): Layout completo
- [ ] Cards mantêm proporção
- [ ] Texto legível em todos tamanhos

---

## 🎯 Cenários de Teste

### Cenário A: Primeiro Acesso
```
1. Abrir http://localhost:3000
2. Ver Login
3. Clicar "Começar Agora"
4. Ir para Home
5. Ver 3 cursos
6. XP = 0, Level = 1, Coins = 0
```

### Cenário B: Completar um Curso
```
1. Home → clica em "Japanese for Anime"
2. CoursePlayer → vê vídeo
3. Clica "Começar Prova"
4. Responde 5 perguntas (qualquer resposta)
5. Vê CompletionCard
6. Volta para Home (clica "Finalizar e Voltar")
7. XP aumentou, Level pode ter subido
8. Coins aumentaram
```

### Cenário C: Refazer um Curso
```
1. Home → clica em "Japanese for Anime" novamente
2. Vê mensagem "Já Completado"
3. Apenas vídeo é mostrado
4. Sem opção de fazer quiz
```

### Cenário D: Subir de Nível
```
1. Home
2. Fazer 2-3 cursos (acumula XP)
3. Quando XP ≥ 100, level sobe com animação
4. Navbar anima e atualiza
```

### Cenário E: Search
```
1. Home
2. Digita "english" na barra de busca
3. Apenas "English with Pokémon" aparece
4. Limpa busca → todos aparecem novamente
```

---

## 📊 Dados Esperados (Após 3 Cursos)

### Status Global
```
XP: 370 (150 + 120 + 100)
Level: 4
XpMax: 285.61 (100 * 1.3 * 1.3 * 1.3)
Coins: 120 (50 + 40 + 30)
```

### LocalStorage
```json
{
  "xp": "84.39",
  "level": "4",
  "xpMax": "285.61",
  "coins": "120",
  "completedCourses": "[\"japanese-anime\",\"english-pokemon\",\"spanish-basics\"]"
}
```

---

## 🐛 Bugs Conhecidos

❌ **PowerShell no Windows**: Use CMD ou WSL para rodar `npm start`

---

## 📝 Notas de Teste

### Dados de Teste
```
Email: teste@email.com (qualquer com @)
Senha: 123456 (min 6 caracteres)
```

### Atalhos para Debug
```javascript
// No console do navegador:

// Ver XP atual
localStorage.getItem('xp')

// Ver cursos completados
JSON.parse(localStorage.getItem('completedCourses'))

// Limpar tudo
localStorage.clear(); location.reload()

// Simular level-up
JSON.parse(localStorage.getItem('xp')) // se >= 100
```

---

## ✅ Validação Final

- [ ] Sem erros no console
- [ ] Sem warnings de React
- [ ] Navbar atualiza em tempo real
- [ ] Quiz funciona completo
- [ ] LocalStorage persiste dados
- [ ] Cursos marcados como completos
- [ ] Responsivo em mobile/tablet/desktop
- [ ] Animações suaves
- [ ] Fluxo de navegação funciona

---

## 🚀 Para Produção

Antes de deploy:

```bash
# 1. Executar testes
npm test

# 2. Build
npm run build

# 3. Verificar build
serve -s build

# 4. Otimizar imagens
# - Converter logo para WebP
# - Comprimir fundo.png

# 5. Adicionar manifest.json
# - Já existe em public/
```

---

Tudo pronto! 🎉
