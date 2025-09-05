
const fs = require('fs');

module.exports = {
  config: {
    name: "quizz",
    version: "1.0",
    author: "Merdi Madimba",
    countDown: 5,
    role: 0, // Seul l'admin peut lancer la commande
    shortDescription: "Quiz interactif avec différentes rubriques",
    longDescription: "Commande quiz avec choix de rubrique, mode duel ou général, et questions chronométrées",
    category: "game",
    guide: "{pn} - Lance un quiz interactif"
  },

  onStart: async function ({ message, event, threadsData }) {
    const threadData = await threadsData.get(event.threadID);
    
    // Vérifier si un quiz est déjà en cours
    if (global.GoatBot.quizData && global.GoatBot.quizData[event.threadID]) {
      return message.reply("❌ Un quiz est déjà en cours dans ce groupe !");
    }

    // Initialiser les données du quiz
    if (!global.GoatBot.quizData) {
      global.GoatBot.quizData = {};
    }

    global.GoatBot.quizData[event.threadID] = {
      step: "category",
      admin: event.senderID,
      scores: {},
      currentQuestion: 0,
      questions: []
    };

    const categoryMessage = `🎯 **QUIZ INTERACTIF** 🎯
    
Choisissez votre rubrique :

🎌 **manga** - Questions sur les mangas
🧠 **culture générale** - Questions de culture générale

Répondez avec le nom de la rubrique que vous souhaitez !`;

    message.reply(categoryMessage, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: "quizz",
        messageID: info.messageID,
        author: event.senderID,
        step: "category"
      });
    });
  },

  onReply: async function ({ message, Reply, event, api }) {
    const { author, step } = Reply;
    const threadID = event.threadID;
    const quizData = global.GoatBot.quizData[threadID];

    if (!quizData || author !== event.senderID) {
      return;
    }

    if (step === "category") {
      const category = event.body.toLowerCase().trim();
      
      if (!["manga", "culture générale"].includes(category)) {
        return message.reply("❌ Rubrique invalide ! Choisissez entre **manga** ou **culture générale**");
      }

      quizData.category = category;
      quizData.step = "mode";

      const modeMessage = `📝 Rubrique sélectionnée : **${category}**

Choisissez le mode de jeu :

⚔️ **duel** - Affrontement entre 2 joueurs spécifiques
🌍 **général** - Quiz ouvert à tous les membres

Répondez avec **duel** ou **général** !`;

      message.reply(modeMessage, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "quizz",
          messageID: info.messageID,
          author: event.senderID,
          step: "mode"
        });
      });

    } else if (step === "mode") {
      const mode = event.body.toLowerCase().trim();
      
      if (!["duel", "général"].includes(mode)) {
        return message.reply("❌ Mode invalide ! Choisissez entre **duel** ou **général**");
      }

      quizData.mode = mode;

      if (mode === "duel") {
        quizData.step = "duelists";
        const duelMessage = `⚔️ **MODE DUEL SÉLECTIONNÉ**

Veuillez entrer les UIDs des deux duellistes séparés par un espace.
Format : UID1 UID2

Exemple : 123456789 987654321`;

        message.reply(duelMessage, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "quizz",
            messageID: info.messageID,
            author: event.senderID,
            step: "duelists"
          });
        });
      } else {
        quizData.step = "questions";
        const questionsMessage = `🌍 **MODE GÉNÉRAL SÉLECTIONNÉ**

Choisissez le nombre de questions :

**10** - Quiz rapide
**20** - Quiz moyen  
**30** - Quiz long
**50** - Quiz expert

Répondez avec le nombre souhaité !`;

        message.reply(questionsMessage, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "quizz",
            messageID: info.messageID,
            author: event.senderID,
            step: "questions"
          });
        });
      }

    } else if (step === "duelists") {
      const uids = event.body.trim().split(" ");
      
      if (uids.length !== 2 || !uids.every(uid => /^\d+$/.test(uid))) {
        return message.reply("❌ Format invalide ! Entrez exactement 2 UIDs séparés par un espace.");
      }

      quizData.duelists = uids;
      quizData.step = "questions";

      const questionsMessage = `⚔️ **DUELLISTES SÉLECTIONNÉS**

Choisissez le nombre de questions pour le duel :

Entrez un nombre entre 5 et 20 questions.`;

      message.reply(questionsMessage, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "quizz",
          messageID: info.messageID,
          author: event.senderID,
          step: "questions"
        });
      });

    } else if (step === "questions") {
      let numQuestions;
      
      if (quizData.mode === "général") {
        numQuestions = parseInt(event.body.trim());
        if (![10, 20, 30, 50].includes(numQuestions)) {
          return message.reply("❌ Nombre invalide ! Choisissez 10, 20, 30 ou 50 questions.");
        }
      } else {
        numQuestions = parseInt(event.body.trim());
        if (numQuestions < 5 || numQuestions > 20) {
          return message.reply("❌ Pour un duel, choisissez entre 5 et 20 questions.");
        }
      }

      // Charger les questions
      await this.loadQuestions(quizData, numQuestions);
      
      if (quizData.questions.length === 0) {
        delete global.GoatBot.quizData[threadID];
        return message.reply("❌ Erreur lors du chargement des questions.");
      }

      // Commencer le quiz
      this.startQuiz(threadID, message, api);
    }
  },

  async loadQuestions(quizData, numQuestions) {
    try {
      const fileName = quizData.category === "manga" ? "manga_questions.json" : "culture_generale_questions.json";
      
      if (!fs.existsSync(fileName)) {
        console.error(`Fichier ${fileName} non trouvé`);
        return;
      }

      const data = JSON.parse(fs.readFileSync(fileName, 'utf8'));
      const allQuestions = data.questions;
      
      // Mélanger et sélectionner le nombre de questions demandé
      const shuffled = allQuestions.sort(() => 0.5 - Math.random());
      quizData.questions = shuffled.slice(0, Math.min(numQuestions, allQuestions.length));
      quizData.totalQuestions = quizData.questions.length;
      
    } catch (error) {
      console.error("Erreur lors du chargement des questions:", error);
    }
  },

  startQuiz(threadID, message, api) {
    const quizData = global.GoatBot.quizData[threadID];
    
    if (!quizData || quizData.questions.length === 0) {
      return;
    }

    const startMessage = `🎉 **QUIZ COMMENCÉ !** 🎉

📋 **Rubrique :** ${quizData.category}
🎮 **Mode :** ${quizData.mode}
❓ **Questions :** ${quizData.totalQuestions}
${quizData.duelists ? `⚔️ **Duellistes :** ${quizData.duelists.join(" vs ")}` : ""}

⏰ **10 secondes par question**
🏆 **10 points par bonne réponse**

Le quiz commence dans 3 secondes...`;

    message.reply(startMessage);

    setTimeout(() => {
      this.askQuestion(threadID, message, api);
    }, 3000);
  },

  askQuestion(threadID, message, api) {
    const quizData = global.GoatBot.quizData[threadID];
    
    if (!quizData || quizData.currentQuestion >= quizData.questions.length) {
      return this.endQuiz(threadID, message, api);
    }

    const question = quizData.questions[quizData.currentQuestion];
    quizData.waitingForAnswer = true;
    quizData.answered = false;

    const questionMessage = `❓ **Question ${quizData.currentQuestion + 1}/${quizData.totalQuestions}**

${question.question}

⏰ Vous avez 10 secondes pour répondre !`;

    message.reply(questionMessage, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: "quizz",
        messageID: info.messageID,
        step: "answer",
        questionIndex: quizData.currentQuestion
      });

      // Timer de 10 secondes
      setTimeout(() => {
        if (quizData.waitingForAnswer && !quizData.answered) {
          quizData.waitingForAnswer = false;
          api.unsendMessage(info.messageID);
          global.GoatBot.onReply.delete(info.messageID);
          
          const timeoutMessage = `⏰ **TEMPS ÉCOULÉ !**

La bonne réponse était : **${question.answer}**

Question suivante dans 2 secondes...`;
          
          message.reply(timeoutMessage);
          
          quizData.currentQuestion++;
          setTimeout(() => {
            this.askQuestion(threadID, message, api);
          }, 2000);
        }
      }, 10000);
    });
  },

  async handleAnswer(event, message, api, usersData) {
    const threadID = event.threadID;
    const quizData = global.GoatBot.quizData[threadID];
    
    if (!quizData || !quizData.waitingForAnswer || quizData.answered) {
      return;
    }

    // Vérifier si c'est un duel et si l'utilisateur peut répondre
    if (quizData.mode === "duel" && !quizData.duelists.includes(event.senderID)) {
      return;
    }

    const question = quizData.questions[quizData.currentQuestion];
    const userAnswer = event.body.toLowerCase().trim();
    const correctAnswer = question.answer.toLowerCase().trim();

    if (userAnswer === correctAnswer) {
      quizData.answered = true;
      quizData.waitingForAnswer = false;

      // Ajouter les points
      if (!quizData.scores[event.senderID]) {
        quizData.scores[event.senderID] = { name: "", points: 0 };
      }
      
      const userData = await usersData.get(event.senderID);
      quizData.scores[event.senderID].name = userData.name;
      quizData.scores[event.senderID].points += 10;

      // Afficher le tableau des scores
      const scoreBoard = this.generateScoreBoard(quizData);
      
      const correctMessage = `✅ **BONNE RÉPONSE !** 

🎉 **${userData.name}** a trouvé la bonne réponse : **${question.answer}**

${scoreBoard}

Question suivante dans 2 secondes...`;

      message.reply(correctMessage);

      quizData.currentQuestion++;
      setTimeout(() => {
        this.askQuestion(threadID, message, api);
      }, 2000);
    }
  },

  generateScoreBoard(quizData) {
    if (Object.keys(quizData.scores).length === 0) {
      return "📊 **TABLEAU DES SCORES**\n\nAucun point pour le moment...";
    }

    const sortedScores = Object.values(quizData.scores)
      .sort((a, b) => b.points - a.points);

    let scoreBoard = "📊 **TABLEAU DES SCORES**\n\n";
    
    sortedScores.forEach((player, index) => {
      const position = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`;
      scoreBoard += `${position} **${player.name}** - ${player.points} pts\n`;
    });

    return scoreBoard;
  },

  endQuiz(threadID, message, api) {
    const quizData = global.GoatBot.quizData[threadID];
    
    if (!quizData) return;

    const scoreBoard = this.generateScoreBoard(quizData);
    const winner = Object.values(quizData.scores)
      .sort((a, b) => b.points - a.points)[0];

    let endMessage = `🎊 **QUIZ TERMINÉ !** 🎊

${scoreBoard}

`;

    if (winner) {
      endMessage += `🏆 **VAINQUEUR : ${winner.name}** avec ${winner.points} points !

🎉 Félicitations ! 🎉`;
    } else {
      endMessage += `😅 Aucun point marqué cette fois...
Meilleure chance la prochaine fois !`;
    }

    message.reply(endMessage);

    // Nettoyer les données
    delete global.GoatBot.quizData[threadID];
  },

  // Handler pour les réponses pendant le quiz
  onReply: async function ({ message, Reply, event, api, usersData }) {
    if (Reply.step === "answer") {
      await this.handleAnswer(event, message, api, usersData);
    } else {
      // Gérer les autres étapes (déjà implémenté ci-dessus)
      return;
    }
  }
};
            
