const { readFileSync } = require("fs"); const path = require("path"); const questions = require("./exherbo-questions");

const state = { activeUsers: {}, results: {}, };

function getRandomQuestions(arr, n) { const shuffled = arr.sort(() => 0.5 - Math.random()); return shuffled.slice(0, n); }

function parseAnswers(text) { const lines = text.split("\n"); const answers = {}; for (const line of lines) { const match = line.trim().match(/^(\d+).\s*([A-Z])$/i); if (match) { answers[parseInt(match[1])] = match[2].toUpperCase(); } } return answers; }

function formatQuestion(q, i) { return ${i + 1}. ${q.question}\n${q.options.map((opt, idx) => String.fromCharCode(65 + idx) + ". " + opt).join("\n")}; }

function formatQuestions(questions, startIdx) { return questions.map((q, i) => formatQuestion(q, startIdx + i)).join("\n\n"); }

function calculateScore(answers, questions) { let correct = 0; for (let i = 0; i < questions.length; i++) { const q = questions[i]; if (answers[i + 1] && answers[i + 1].toUpperCase() === q.answer.toUpperCase()) correct++; } return correct; }

module.exports = { config: { name: "exherbo", version: "2.0", author: "Merdi Madimba", role: 2, category: "🧪 Examen", guide: { en: "/exherbo add <uid>, /exherbo end" } },

onStart({ args, message, event }) { const [action, uid] = args;

if (action === "add") {
  if (!uid) return message.reply("❌ Utilisation: /exherbo add <uid>");

  const user = {
    id: uid,
    currentRubric: 0,
    currentIndex: 0,
    answers: {},
    randomizedQuestions: {
      general: getRandomQuestions(questions.general, 50),
      math: getRandomQuestions(questions.math, 50),
      id: getRandomQuestions(questions.id, 30),
      civic: getRandomQuestions(questions.civic, 50),
      personal: questions.personal
    },
  };

  state.activeUsers[uid] = user;
  message.reply(`✅ Examen lancé pour l'utilisateur ${uid}`);

  setTimeout(() => sendNextBatch(message, uid), 1000);
} else if (action === "end") {
  if (Object.keys(state.results).length === 0) return message.reply("❌ Aucun résultat à afficher.");

  let msg = "📊 Résultats finaux de l'examen :\n\n";
  for (const [uid, data] of Object.entries(state.results)) {
    const totalQuestions = 230;
    const score = data.totalCorrect;
    const pourcentage = ((score / totalQuestions) * 100).toFixed(2);
    msg += `👤 UID: ${uid}\n✅ Score: ${score}/230\n📈 Pourcentage: ${pourcentage}%\n\n`;
  }
  message.reply(msg);
  state.activeUsers = {};
  state.results = {};
}

},

onMessage({ event, message }) { const uid = event.senderID; const user = state.activeUsers[uid]; if (!user) return;

const currentRubric = Object.keys(user.randomizedQuestions)[user.currentRubric];
const questionSet = user.randomizedQuestions[currentRubric];
const currentBatch = questionSet.slice(user.currentIndex, user.currentIndex + 5);

const answers = parseAnswers(event.body);
let correct = 0;
for (let i = 0; i < currentBatch.length; i++) {
  const real = currentBatch[i].answer.toUpperCase();
  const given = answers[i + 1];
  if (given && given.toUpperCase() === real) correct++;
}

if (!state.results[uid]) state.results[uid] = { totalCorrect: 0 };
state.results[uid].totalCorrect += correct;

user.currentIndex += 5;

if (user.currentIndex >= questionSet.length) {
  user.currentRubric++;
  user.currentIndex = 0;
  if (user.currentRubric >= Object.keys(user.randomizedQuestions).length) {
    delete state.activeUsers[uid];
    return message.reply(`📘 Examen terminé pour l'utilisateur ${uid}. En attente des résultats finaux.`);
  }
}

sendNextBatch(message, uid);

} };

function sendNextBatch(message, uid) { const user = state.activeUsers[uid]; if (!user) return;

const currentRubric = Object.keys(user.randomizedQuestions)[user.currentRubric]; const rubricLabel = { general: "🌍 Culture générale", math: "➗ Mathématiques", id: "🖼️ Identification", civic: "🧭 Civique & moral", personal: "📝 Questions personnelles" }[currentRubric];

const questionSet = user.randomizedQuestions[currentRubric]; const batch = questionSet.slice(user.currentIndex, user.currentIndex + 5);

const formatted = formatQuestions(batch, 1); message.send(📚 Rubrique: ${rubricLabel}\nRéponds avec le bon format (ex: 1. A) dans les 20 secondes.\n\n${formatted});

setTimeout(() => { if (state.activeUsers[uid]) { message.reply(⌛ Temps écoulé pour cette section.); user.currentIndex += 5; if (user.currentIndex >= questionSet.length) { user.currentRubric++; user.currentIndex = 0; } sendNextBatch(message, uid); } }, 20000); }

                  
