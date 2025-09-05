const fs = require("fs");

const cultureQuestions = JSON.parse(
  fs.readFileSync(__dirname + "/culture_generale_questions.json", "utf8")
);
const mangaQuestions = JSON.parse(
  fs.readFileSync(__dirname + "/manga_questions.json", "utf8")
);

module.exports = {
  config: {
    name: "quizz",
    aliases: ["quiz"],
    version: "1.2",
    author: "Merdi Madimba",
    role: 0, // 1 = admin seulement
  },

  onStart: async function ({ api, event, args }) {
    // Vérifier que c'est l'admin
    if (event.senderID !== "<100065927401614>") return api.sendMessage("❌ Seul l'administrateur peut lancer le quizz", event.threadID);

    let threadID = event.threadID;
    let step = 0;
    let chosenCategory = "";
    let duelMode = false;
    let players = [];
    let nbQuestions = 10;
    let scores = {};

    api.sendMessage(
      "📚 Choisissez la rubrique :\n\n1. Culture générale\n2. Manga\n\n➡️ Répondez avec @ suivi du numéro de votre choix (ex: @1)",
      threadID
    );

    const handleMessage = async (msg) => {
      const senderID = msg.senderID;
      const body = msg.body.toLowerCase();

      // Étape 0 : Choix de la catégorie
      if (step === 0) {
        if (!body.startsWith("@")) return;
        if (body === "@1") chosenCategory = "culture";
        else if (body === "@2") chosenCategory = "manga";
        else return;

        step = 1;
        api.sendMessage(
          "⚔️ Choisissez le mode :\n\n1. Duel\n2. Quizz général\n\n➡️ Répondez avec @ suivi du numéro",
          threadID
        );
      }
      // Étape 1 : Choix duel ou général
      else if (step === 1) {
        if (!body.startsWith("@")) return;
        if (body === "@1") {
          duelMode = true;
          step = 2;
          api.sendMessage("👥 Entrez le UID des deux duellistes séparés par une virgule :", threadID);
        } else if (body === "@2") {
          duelMode = false;
          step = 3;
          api.sendMessage("🔢 Combien de questions ? (10, 20, 30, 50)", threadID);
        }
      }
      // Étape 2 : Duel UID
      else if (step === 2) {
        players = body.split(",").map((id) => id.trim());
        step = 3;
        api.sendMessage("🔢 Combien de questions ? (10, 20, 30, 50)", threadID);
      }
      // Étape 3 : Nombre de questions
      else if (step === 3) {
        let n = parseInt(body);
        if (![10, 20, 30, 50].includes(n)) return api.sendMessage("❌ Choix invalide, entrez 10, 20, 30 ou 50", threadID);
        nbQuestions = n;
        step = 4;
        startQuiz();
      }
    };

    const startQuiz = async () => {
      let questionsArray = chosenCategory === "culture" ? [...cultureQuestions] : [...mangaQuestions];
      questionsArray = questionsArray.sort(() => 0.5 - Math.random()).slice(0, nbQuestions);

      for (let q of questionsArray) {
        api.sendMessage(`❓ ${q.question}`, threadID);
        let answered = false;

        const collector = async (msg) => {
          if (answered) return;
          const answer = msg.body.toLowerCase();
          if (duelMode && !players.includes(msg.senderID)) return;

          if (answer === q.answer) {
            answered = true;
            const name = msg.senderName;
            if (!scores[name]) scores[name] = 0;
            scores[name] += 10;
            api.sendMessage(`✅ Bonne réponse !\n\n🏆 Scores :\n${Object.entries(scores).map(([n, s]) => `${n}: ${s} pts`).join("\n")}`, threadID);
          }
        };

        api.listen(handleMessage); // pour les choix en @1/@2
        api.listen(collector);

        // Attendre 10 secondes
        await new Promise((resolve) => setTimeout(resolve, 10000));
        if (!answered) api.sendMessage(`⏱ Temps écoulé ! La bonne réponse était : ${q.answer}`, threadID);
      }

      // Fin du quizz
      let winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
      api.sendMessage(`🏁 Quizz terminé !\nVainqueur : ${winner ? `${winner[0]} avec ${winner[1]} pts` : "Personne"}`, threadID);
    };

    api.listen(handleMessage);
  },
};
