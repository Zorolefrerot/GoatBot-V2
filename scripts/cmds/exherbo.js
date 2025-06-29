const questions = require("./exherbo-questions"); const waitingUsers = new Map(); const examResults = new Map(); const activeSessions = new Map();

module.exports = { config: { name: "exherbo", version: "1.0", author: "Merdi Madimba", countDown: 5, role: 2, // Seul admin peut initier l'examen shortDescription: "Faire passer un examen complet", longDescription: "Lance un examen structuré à un utilisateur ciblé avec plusieurs rubriques.", category: "📚 Education", guide: { en: "/exherbo add <uid> | /exherbo end" } },

onStart: async function ({ args, message, event }) { const [action, uid] = args;

if (action === "add") {
  if (!uid || isNaN(uid)) return message.reply("❌ Format : /exherbo add <uid>");
  if (waitingUsers.has(uid)) return message.reply("⛔ Cet utilisateur est déjà programmé pour un examen.");

  waitingUsers.set(uid, { currentRubrique: 0, score: 0, responses: [] });
  return message.reply(`✅ Utilisateur ${uid} ajouté à la liste d'examen.`);
}

if (action === "end") {
  if (waitingUsers.size === 0 && examResults.size === 0)
    return message.reply("📭 Aucun examen terminé.");

  let resultMsg = `📊 Résultats finaux de l'examen :\n\n`;
  for (const [uid, data] of examResults.entries()) {
    resultMsg += `👤 UID: ${uid}\n🎯 Score: ${data.score}/100\n\n`;
  }
  waitingUsers.clear();
  examResults.clear();
  return message.reply(resultMsg);
}

return message.reply("❌ Commande invalide. Utilise : /exherbo add <uid> ou /exherbo end");

},

onMessage: async function ({ message, event }) { const uid = event.senderID; const session = waitingUsers.get(uid); if (!session || activeSessions.has(uid)) return;

const rubriques = ["culture", "math", "id", "civique", "personnalise"];
const rubriqueKey = rubriques[session.currentRubrique];
const currentQuestions = questions[rubriqueKey];

// Sélection de 5 questions à la fois
const startIndex = session.responses.length;
const batch = currentQuestions.slice(startIndex, startIndex + 5);

if (batch.length === 0) {
  session.currentRubrique++;
  session.responses = [];

  if (session.currentRubrique >= rubriques.length) {
    examResults.set(uid, { score: session.score });
    waitingUsers.delete(uid);
    return message.reply("✅ Toutes les rubriques ont été passées avec succès. Résultat envoyé à l’administrateur à la fin.");
  }
  return message.reply(`📘 Passage à la rubrique suivante : ${rubriques[session.currentRubrique].toUpperCase()}`);
}

let questionText = `📖 Rubrique : ${rubriqueKey.toUpperCase()}\n\n`;
batch.forEach((q, i) => {
  questionText += `${startIndex + i + 1}. ${q.question}\n${q.options ? q.options.map((opt, j) => String.fromCharCode(65 + j) + ". " + opt).join("\n") : "(Réponse libre)"}\n\n`;
});

message.reply(questionText);
activeSessions.set(uid, true);

setTimeout(() => {
  activeSessions.delete(uid);
  message.reply("⏰ Temps écoulé. Passage à la suite.");
  session.responses.push(...batch.map(q => null));
}, 20000);

} };

