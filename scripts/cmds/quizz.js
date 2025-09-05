const fs = require("fs");
const path = require("path");

// Charger les fichiers JSON
const mangaQuestions = JSON.parse(fs.readFileSync(path.join(__dirname, "manga_questions.json")));
const cultureQuestions = JSON.parse(fs.readFileSync(path.join(__dirname, "culture_generale_questions.json")));

let activeQuizz = {}; // empêche plusieurs quizz dans un groupe

module.exports = {
  config: {
    name: "quizz",
    version: "1.0",
    author: "Merdi Madimba",
    role: 0, // admin only
    shortDescription: "Lancer un quizz (manga ou culture générale)",
    category: "games",
  },

  onStart: async function({ message, event, args, api }) {
    const threadID = event.threadID;

    if (activeQuizz[threadID]) {
      return message.reply("⚠️ Un quiz est déjà en cours dans ce groupe !");
    }

    activeQuizz[threadID] = {
      scores: {},
      duel: false,
      duelPlayers: [],
      category: "",
      questions: [],
      currentIndex: 0,
      inProgress: true,
    };

    return message.reply(
      "🎮 *QUIZZ TIME* 🎮\n\n" +
      "📚 Choisissez une rubrique :\n" +
      "1️⃣ Manga\n" +
      "2️⃣ Culture Générale\n\n" +
      "👉 Répondez par le chiffre correspondant.",
      (err, info) => {
        activeQuizz[threadID].step = "chooseCategory";
        activeQuizz[threadID].messageID = info.messageID;
      }
    );
  },

  onReply: async function({ event, api, Reply, message }) {
    const { threadID, senderID, body } = event;
    const quizz = activeQuizz[threadID];
    if (!quizz) return;

    const answer = body.trim().toLowerCase();

    // Étape 1 : Choix de la catégorie
    if (quizz.step === "chooseCategory") {
      if (answer === "1") {
        quizz.category = "manga";
        quizz.questions = [...mangaQuestions];
      } else if (answer === "2") {
        quizz.category = "culture";
        quizz.questions = [...cultureQuestions];
      } else {
        return message.reply("❌ Choisissez seulement 1 ou 2.");
      }

      quizz.step = "chooseMode";
      return message.reply(
        "⚔️ Choisissez le mode de jeu :\n" +
        "1️⃣ Duel\n" +
        "2️⃣ Quizz Général",
      );
    }

    // Étape 2 : Choix du mode
    if (quizz.step === "chooseMode") {
      if (answer === "1") {
        quizz.duel = true;
        quizz.step = "enterDuellists";
        return message.reply("👥 Entrez les UID des deux duellistes séparés par une virgule.");
      } else if (answer === "2") {
        quizz.duel = false;
        quizz.step = "chooseNumber";
        return message.reply("❓ Combien de questions voulez-vous ? (10 / 20 / 30 / 50)");
      } else {
        return message.reply("❌ Choisissez 1 ou 2.");
      }
    }

    // Étape 3 : UID des duellistes
    if (quizz.step === "enterDuellists") {
      const uids = answer.split(",").map(uid => uid.trim());
      if (uids.length !== 2) {
        return message.reply("❌ Vous devez entrer exactement 2 UID séparés par une virgule.");
      }
      quizz.duelPlayers = uids;
      quizz.step = "chooseNumber";
      return message.reply("❓ Combien de questions voulez-vous ? (10 / 20 / 30 / 50)");
    }

    // Étape 4 : Nombre de questions
    if (quizz.step === "chooseNumber") {
      if (!["10", "20", "30", "50"].includes(answer)) {
        return message.reply("❌ Entrez uniquement 10, 20, 30 ou 50.");
      }
      const numQ = parseInt(answer);
      quizz.questions = quizz.questions.sort(() => 0.5 - Math.random()).slice(0, numQ);

      quizz.step = "playing";
      quizz.currentIndex = 0;
      return askQuestion(api, threadID);
    }

    // Étape 5 : Réponses aux questions
    if (quizz.step === "playing") {
      const currentQ = quizz.questions[quizz.currentIndex];
      const correct = currentQ.answer;

      // Duel → filtrer réponses des deux UID
      if (quizz.duel && !quizz.duelPlayers.includes(senderID)) {
        return;
      }

      if (answer === correct) {
        const name = event.senderID;
        quizz.scores[name] = (quizz.scores[name] || 0) + 10;

        await message.reply(`✅ Bonne réponse ! (+10 pts)\n📊 Score actuel :\n${formatScores(quizz.scores)}`);
        nextQuestion(api, threadID, message);
      }
    }
  }
};

async function askQuestion(api, threadID) {
  const quizz = activeQuizz[threadID];
  if (!quizz) return;

  if (quizz.currentIndex >= quizz.questions.length) {
    // Fin du jeu
    const winner = Object.keys(quizz.scores).reduce((a, b) => quizz.scores[a] > quizz.scores[b] ? a : b, null);
    const score = winner ? quizz.scores[winner] : 0;

    api.sendMessage(
      `🏁 *FIN DU QUIZZ* 🏁\n\n🎉 Le gagnant est: ${winner || "Personne"} avec ${score} points !`,
      threadID
    );
    delete activeQuizz[threadID];
    return;
  }

  const currentQ = quizz.questions[quizz.currentIndex];
  api.sendMessage(
    `❓ Question ${quizz.currentIndex + 1}/${quizz.questions.length} :\n${currentQ.question}\n\n⏱ Vous avez 10 secondes !`,
    threadID,
    (err, info) => {
      quizz.questionMessageID = info.messageID;

      setTimeout(() => {
        // Vérifier si pas répondu
        if (quizz.step === "playing" && quizz.currentIndex < quizz.questions.length) {
          api.sendMessage(
            `⏳ Temps écoulé ! La bonne réponse était : *${currentQ.answer}*`,
            threadID
          );
          nextQuestion(api, threadID);
        }
      }, 10000);
    }
  );
}

function nextQuestion(api, threadID, message) {
  const quizz = activeQuizz[threadID];
  if (!quizz) return;
  quizz.currentIndex++;
  askQuestion(api, threadID);
}

function formatScores(scores) {
  return Object.entries(scores)
    .map(([user, score]) => `👤 ${user} : ${score} pts`)
    .join("\n");
}
