# ⚡ Quick Start - Stoody

## 🚀 Em 3 Passos

### 1️⃣ Instalar
```bash
cd stoody
npm install
```

### 2️⃣ Rodar
```bash
npm start
```

### 3️⃣ Testar
```
Abrir http://localhost:3000
→ Clique "Começar Agora"
→ Escolha um curso
→ Faça o quiz
→ Ganhe XP e Moedas! 🎉
```

---

## 🎮 Fluxo Rápido

```
Login → Home (3 cursos) → CoursePlayer (video)
  ↓
"Começar Prova" → Quiz (5 perguntas)
  ↓
CompletionCard (recompensas) → Home (stats atualizados)
```

---

## 📱 Testar em Dispositivos

```bash
# Conseguir IP do seu PC
ipconfig

# Rodar em outro dispositivo
http://SEU_IP:3000
```

---

## 🎯 Adicionar Novo Curso

1. Editar `src/pages/CoursePlayer.jsx`
2. Adicionar em `coursesData`
3. Editar `src/pages/Home.jsx`
4. Adicionar em `courses` array

Pronto! ✅

---

## 💾 Dados Salvos?

Abrir console e digitar:
```javascript
JSON.parse(localStorage.getItem('completedCourses'))
```

---

## 📚 Documentação

```
SETUP.md    ← Guia completo
TESTING.md  ← Testes
EXEMPLOS.md ← Código customizado
```

---

## ❓ Problema?

1. Verificar console (F12)
2. Limpar cache: `localStorage.clear()`
3. Recarregar: `Ctrl+Shift+R`
4. Consultar TESTING.md

---

**Pronto! Divirta-se com o Stoody! 🚀📚**
