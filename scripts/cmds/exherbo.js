const { getStreamFromURL } = global.utils;

const ADMIN_ID = "100065927401614"; // Ton ID Facebook
const usersInExam = {};
const examResults = {};

const examData = require("./exherbo-questions.js");

function formatQuestions(questions) {
  return questions.map((q, i) =>
    `${i + 1}. ${q.question}\n${q.options.map((opt, idx) =>
      `${String.fromCharCode(65 + idx)}. ${opt}`).join("\n")}`
  ).join("\n\n");
}

function getPercentage(score, total) {
  return ((score / total) * 100).toFixed(2);
}

module.exports = {
  config: {
    name: "exherbo",
    version: "1.0",
    author: "Merdi Madimba",
    category: "🎓 Examens",
    shortDescription: "Examen à rubriques par UID",
    guide: {
      fr: "/exherbo add [uid] : Ajouter un utilisateur à l’examen\n"
        + "/exherbo end : Voir les résultats finaux"
    }
  },

  onStart: async function ({ args, message, event }) {
    const { senderID, threadID } = event;
    const isAdmin = senderID === ADMIN_ID;

    if (!args[0]) return message.reply("❌ Utilisation : /exherbo add <UID> ou /exherbo end");

    if (args[0] === "add") {
      if (!isAdmin) return message.reply("❌ Seul l'administrateur peut lancer l'examen.");

      const uid = args[1];
      if (!uid) return message.reply("❌ Fournis l'UID de l'utilisateur à ajouter.");

      if (usersInExam[uid]) return message.reply("⏳ Cet utilisateur est déjà en cours d’examen.");
      
      // Sélection aléatoire de 5 questions par rubrique
      const sections = ["culture", "math", "id", "civique", "personnel"];
      const questions = {};
      for (const section of sections) {
        const allQuestions = examData[section];
        const selected = allQuestions.sort(() => 0.5 - Math.random()).slice(0, section === "id" ? 5 : 5);
        questions[section] = selected;
      }

      usersInExam[uid] = {
        currentSection: 0,
        responses: {},
        questions,
        score: 0,
        currentThread: threadID
      };

      await sendNextSection(uid, message);
    }

    if (args[0] === "end") {
      if (!isAdmin) return message.reply("❌ Seul l'admin peut voir les résultats.");
      if (Object.keys(examResults).length === 0) return message.reply("❌ Aucun résultat encore enregistré.");

      let resultMsg = "📊 Résultats finaux de l'examen :\n\n";
      for (const uid in examResults) {
        const { totalScore, totalQuestions } = examResults[uid];
        const pourcentage = getPercentage(totalScore, totalQuestions);
        resultMsg += `👤 UID: ${uid} | Score: ${totalScore}/${totalQuestions} | 🎯 ${pourcentage}%\n`;
      }
      return message.reply(resultMsg);
    }
  },

  onReply: async function ({ message, Reply, event }) {
    const uid = event.senderID;
    const content = event.body?.trim();
    if (!usersInExam[uid]) return;

    const user = usersInExam[uid];
    const sectionKeys = ["culture", "math", "id", "civique", "personnel"];
    const currentSection = sectionKeys[user.currentSection];
    const currentQuestions = user.questions[currentSection];

    // Parse des réponses : ex. "1. A", "2. B"
    const lines = content.split("\n").filter(line => /^\d+\.\s?[A-D]/i.test(line));
    let sectionScore = 0;
    const total = currentQuestions.length;

    lines.forEach(line => {
      const [qNumStr, answer] = line.split(".");
      const qIndex = parseInt(qNumStr.trim()) - 1;
      if (!currentQuestions[qIndex]) return;

      const correctAnswer = currentQuestions[qIndex].answer.toUpperCase().trim();
      const given = answer.trim().toUpperCase();
      if (given === correctAnswer) sectionScore++;
    });

    user.score += sectionScore;
    user.currentSection++;

    if (user.currentSection >= sectionKeys.length) {
      // Fin de l'examen
      const totalQuestions = sectionKeys.map(k => user.questions[k].length).reduce((a, b) => a + b, 0);
      examResults[uid] = {
        totalScore: user.score,
        totalQuestions
      };
      delete usersInExam[uid];
      return message.reply("✅ Examen terminé pour toi. Résultat envoyé plus tard avec /exherbo end.");
    } else {
      await sendNextSection(uid, message);
    }
  }
};

async function sendNextSection(uid, message) {
  const user = usersInExam[uid];
  const sectionKeys = ["culture", "math", "id", "civique", "personnel"];
  const currentKey = sectionKeys[user.currentSection];
  const sectionQuestions = user.questions[currentKey];

  let sectionName = {
    culture: "🌍 Culture Générale",
    math: "🧮 Mathématiques",
    id: "🖼️ Identification",
    civique: "⚖️ Civique & Moral",
    personnel: "🗂️ Questions Personnelles"
  }[currentKey];

  if (currentKey === "id") {
    for (let i = 0; i < sectionQuestions.length; i++) {
      const q = sectionQuestions[i];
      const stream = await getStreamFromURL(q.image);
      await message.reply({ body: `🖼️ ${i + 1}. Qui est ce personnage ?`, attachment: stream });
    }
    return message.reply("📝 Réponds comme ceci :\n1. Goku\n2. Naruto...");
  }

  const formatted = formatQuestions(sectionQuestions);
  await message.reply(`📚 Rubrique : ${sectionName}\n\n${formatted}\n\n📝 Réponds ainsi :\n1. A\n2. B\n...`);
                        }
