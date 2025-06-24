const characters = require("./data/manga_characters.json");

module.exports = { config: { name: "mangaquizzid", aliases: ["mqid"], version: "1.0", author: "Merdi Madimba", description: "Quiz Manga en images - devinez le personnage pour gagner des points !", category: "🎮 Jeux", role: 0, },

onStart: async function ({ api, event, usersData }) { const { threadID, messageID } = event; const score = {}; const usedIndexes = new Set(); let currentQuestion = 0;

async function sendNextQuestion() {
  if (currentQuestion >= 20) {
    // Fin du quizz
    const leaderboard = Object.entries(score).sort((a, b) => b[1] - a[1]);
    let finalScore = "🏆 Quiz terminé ! Classement final :\n\n";
    leaderboard.forEach(([uid, pts], i) => {
      finalScore += `${i + 1}. ${uid}: ${pts} pts\n`;
    });
    finalScore += `\n👑 Gagnant : ${leaderboard[0]?.[0] || "Aucun"}`;
    return api.sendMessage(finalScore, threadID);
  }

  let index;
  do {
    index = Math.floor(Math.random() * characters.length);
  } while (usedIndexes.has(index));
  usedIndexes.add(index);

  const character = characters[index];
  const imgStream = await global.utils.getStreamFromURL(character.image);
  api.sendMessage({
    body: `🖼️ Qui est ce personnage ? (Répondez avec @Nom)\nImage ${currentQuestion + 1}/20`,
    attachment: imgStream
  }, threadID, (err, info) => {
    if (err) return console.error(err);
    waitForAnswer(character.name.toLowerCase(), info.messageID);
  });

  currentQuestion++;
}

function waitForAnswer(correctName, msgID) {
  let answered = false;
  const listener = async ({ senderID, body, threadID: tID }) => {
    if (tID !== threadID || !body || !body.startsWith("@")) return;

    const guess = body.slice(1).trim().toLowerCase();
    if (guess === correctName && !answered) {
      answered = true;
      const name = await usersData.getName(senderID);
      score[name] = (score[name] || 0) + 10;
      api.sendMessage(`✅ Bonne réponse ${name} ! (+10 pts)\n\n📊 Score actuel :\n${Object.entries(score).map(([n, p]) => `${n}: ${p} pts`).join("\n")}`, threadID);
      global.GoatBot.removeListener("message", listener);
      setTimeout(sendNextQuestion, 1000);
    }
  };

  global.GoatBot.on("message", listener);
  setTimeout(() => {
    if (!answered) {
      api.sendMessage("⏰ Temps écoulé ! La bonne réponse était : " + correctName, threadID);
      global.GoatBot.removeListener("message", listener);
      setTimeout(sendNextQuestion, 2000);
    }
  }, 10000);
}

// Lancer la première image directement
sendNextQuestion();

} };

