
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "quizz",
    aliases: [],
    version: "1.0",
    author: "Madimba Merdi",
    countDown: 5,
    role: 0, // Seuls les admins peuvent lancer la commande
    shortDescription: {
      en: "Quiz game with manga and general culture questions"
    },
    longDescription: {
      en: "Quiz game with categories and duel/general modes"
    },
    category: "game",
    guide: {
      en: "{pn} - Start a quiz game"
    }
  },

  onStart: async function ({ message, event, threadsData, usersData, api }) {
    const threadID = event.threadID;
    const senderID = event.senderID;

    // Vérifier si un quiz est déjà en cours
    const threadData = await threadsData.get(threadID);
    if (threadData.quizActive) {
      return message.reply("❌ Un quiz est déjà en cours dans ce groupe !");
    }

    // Marquer le quiz comme actif
    threadData.quizActive = true;
    await threadsData.set(threadID, threadData);

    // Demander la rubrique
    const categoryMsg = await message.reply({
      body: "🎯 **QUIZ GAME** 🎯\n\n📚 Choisissez une rubrique :\n\n1️⃣ Manga\n2️⃣ Culture Générale\n\n⏰ Répondez avec 1 ou 2"
    });

    global.GoatBot.onReply.set(categoryMsg.messageID, {
      commandName: "quizz",
      messageID: categoryMsg.messageID,
      author: senderID,
      step: "category",
      threadID: threadID
    });

    // Auto-delete après 30 secondes
    setTimeout(() => {
      if (global.GoatBot.onReply.has(categoryMsg.messageID)) {
        api.unsendMessage(categoryMsg.messageID);
        global.GoatBot.onReply.delete(categoryMsg.messageID);
        threadData.quizActive = false;
        threadsData.set(threadID, threadData);
      }
    }, 30000);
  },

  onReply: async function ({ message, Reply, event, api, usersData, threadsData }) {
    const { author, messageID, step, threadID } = Reply;

    // Seul celui qui a lancé la commande peut configurer
    if (step !== "quiz" && author !== event.senderID) {
      return message.reply("❌ Seul celui qui a lancé le quiz peut le configurer !");
    }

    const threadData = await threadsData.get(threadID);

    try {
      if (step === "category") {
        const choice = event.body.trim();
        if (!["1", "2"].includes(choice)) {
          return message.reply("❌ Veuillez répondre avec 1 ou 2 !");
        }

        const category = choice === "1" ? "manga" : "culture_generale";
        
        // Supprimer le message précédent
        api.unsendMessage(messageID);
        global.GoatBot.onReply.delete(messageID);

        // Demander le type de quiz
        const typeMsg = await message.reply({
          body: "🎮 **TYPE DE QUIZ** 🎮\n\n⚔️ Choisissez le mode :\n\n1️⃣ Duel (2 joueurs)\n2️⃣ Quiz Général (tout le monde)\n\n⏰ Répondez avec 1 ou 2"
        });

        global.GoatBot.onReply.set(typeMsg.messageID, {
          commandName: "quizz",
          messageID: typeMsg.messageID,
          author: author,
          step: "type",
          category: category,
          threadID: threadID
        });

        setTimeout(() => {
          if (global.GoatBot.onReply.has(typeMsg.messageID)) {
            api.unsendMessage(typeMsg.messageID);
            global.GoatBot.onReply.delete(typeMsg.messageID);
            threadData.quizActive = false;
            threadsData.set(threadID, threadData);
          }
        }, 30000);

      } else if (step === "type") {
        const choice = event.body.trim();
        if (!["1", "2"].includes(choice)) {
          return message.reply("❌ Veuillez répondre avec 1 ou 2 !");
        }

        const quizType = choice === "1" ? "duel" : "general";
        
        api.unsendMessage(messageID);
        global.GoatBot.onReply.delete(messageID);

        if (quizType === "duel") {
          const duelMsg = await message.reply({
            body: "⚔️ **MODE DUEL** ⚔️\n\n👥 Mentionnez les 2 duellistes :\n\nExemple: @user1 @user2\n\n⏰ Vous avez 30 secondes"
          });

          global.GoatBot.onReply.set(duelMsg.messageID, {
            commandName: "quizz",
            messageID: duelMsg.messageID,
            author: author,
            step: "duel_players",
            category: Reply.category,
            quizType: quizType,
            threadID: threadID
          });

          setTimeout(() => {
            if (global.GoatBot.onReply.has(duelMsg.messageID)) {
              api.unsendMessage(duelMsg.messageID);
              global.GoatBot.onReply.delete(duelMsg.messageID);
              threadData.quizActive = false;
              threadsData.set(threadID, threadData);
            }
          }, 30000);

        } else {
          const questionsMsg = await message.reply({
            body: "📊 **NOMBRE DE QUESTIONS** 📊\n\n🔢 Choisissez le nombre de questions :\n\n1️⃣ 10 questions\n2️⃣ 20 questions\n3️⃣ 30 questions\n4️⃣ 50 questions\n\n⏰ Répondez avec 1, 2, 3 ou 4"
          });

          global.GoatBot.onReply.set(questionsMsg.messageID, {
            commandName: "quizz",
            messageID: questionsMsg.messageID,
            author: author,
            step: "questions_count",
            category: Reply.category,
            quizType: quizType,
            threadID: threadID
          });

          setTimeout(() => {
            if (global.GoatBot.onReply.has(questionsMsg.messageID)) {
              api.unsendMessage(questionsMsg.messageID);
              global.GoatBot.onReply.delete(questionsMsg.messageID);
              threadData.quizActive = false;
              threadsData.set(threadID, threadData);
            }
          }, 30000);
        }

      } else if (step === "duel_players") {
        const mentions = Object.keys(event.mentions);
        if (mentions.length !== 2) {
          return message.reply("❌ Vous devez mentionner exactement 2 joueurs !");
        }

        api.unsendMessage(messageID);
        global.GoatBot.onReply.delete(messageID);

        const questionsMsg = await message.reply({
          body: "📊 **NOMBRE DE QUESTIONS** 📊\n\n🔢 Combien de questions voulez-vous ?\n\n📝 Tapez un nombre (ex: 5, 10, 15...)\n\n⏰ Vous avez 30 secondes"
        });

        global.GoatBot.onReply.set(questionsMsg.messageID, {
          commandName: "quizz",
          messageID: questionsMsg.messageID,
          author: author,
          step: "duel_questions_count",
          category: Reply.category,
          quizType: Reply.quizType,
          duelPlayers: mentions,
          threadID: threadID
        });

        setTimeout(() => {
          if (global.GoatBot.onReply.has(questionsMsg.messageID)) {
            api.unsendMessage(questionsMsg.messageID);
            global.GoatBot.onReply.delete(questionsMsg.messageID);
            threadData.quizActive = false;
            threadsData.set(threadID, threadData);
          }
        }, 30000);

      } else if (step === "questions_count") {
        const choice = event.body.trim();
        if (!["1", "2", "3", "4"].includes(choice)) {
          return message.reply("❌ Veuillez répondre avec 1, 2, 3 ou 4 !");
        }

        const questionCounts = { "1": 10, "2": 20, "3": 30, "4": 50 };
        const questionCount = questionCounts[choice];

        api.unsendMessage(messageID);
        global.GoatBot.onReply.delete(messageID);

        this.startQuiz(message, api, Reply.category, Reply.quizType, questionCount, null, threadData, threadsData, usersData);

      } else if (step === "duel_questions_count") {
        const questionCount = parseInt(event.body.trim());
        if (isNaN(questionCount) || questionCount < 1 || questionCount > 100) {
          return message.reply("❌ Veuillez entrer un nombre valide entre 1 et 100 !");
        }

        api.unsendMessage(messageID);
        global.GoatBot.onReply.delete(messageID);

        this.startQuiz(message, api, Reply.category, Reply.quizType, questionCount, Reply.duelPlayers, threadData, threadsData, usersData);

      } else if (step === "quiz") {
        this.handleAnswer(message, Reply, event, api, threadsData, usersData);
      }

    } catch (error) {
      console.error("Erreur dans onReply quizz:", error);
      threadData.quizActive = false;
      await threadsData.set(threadID, threadData);
      global.GoatBot.onReply.delete(messageID);
    }
  },

  startQuiz: async function (message, api, category, quizType, questionCount, duelPlayers, threadData, threadsData, usersData) {
    try {
      // Charger les questions
      const questionsFile = category === "manga" ? "manga_questions.json" : "culture_generale_questions.json";
      const questionsPath = path.join(__dirname, "..", "..", questionsFile);
      
      if (!fs.existsSync(questionsPath)) {
        threadData.quizActive = false;
        await threadsData.set(message.threadID, threadData);
        return message.reply(`❌ Fichier de questions ${questionsFile} introuvable !`);
      }

      const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
      const allQuestions = questionsData.questions;

      if (!allQuestions || allQuestions.length === 0) {
        threadData.quizActive = false;
        await threadsData.set(message.threadID, threadData);
        return message.reply("❌ Aucune question trouvée dans le fichier !");
      }

      // Mélanger et sélectionner les questions
      const shuffled = allQuestions.sort(() => 0.5 - Math.random());
      const selectedQuestions = shuffled.slice(0, Math.min(questionCount, allQuestions.length));

      // Initialiser le quiz
      const quizData = {
        questions: selectedQuestions,
        currentQuestion: 0,
        scores: {},
        category: category,
        quizType: quizType,
        duelPlayers: duelPlayers,
        threadID: message.threadID
      };

      // Message de début
      let startMsg = `🎯 **QUIZ ${category.toUpperCase().replace('_', ' ')}** 🎯\n\n`;
      if (quizType === "duel") {
        const player1Name = (await usersData.get(duelPlayers[0])).name;
        const player2Name = (await usersData.get(duelPlayers[1])).name;
        startMsg += `⚔️ **DUEL** ⚔️\n👤 ${player1Name} VS ${player2Name}\n\n`;
      } else {
        startMsg += `🌟 **QUIZ GÉNÉRAL** 🌟\n👥 Tout le monde peut participer !\n\n`;
      }
      startMsg += `📊 ${selectedQuestions.length} questions\n💰 10 points par bonne réponse\n⏰ 10 secondes par question\n\n🚀 Le quiz commence dans 3 secondes...`;

      await message.reply(startMsg);

      // Attendre 3 secondes puis commencer
      setTimeout(() => {
        this.askQuestion(message, api, quizData, threadsData, usersData);
      }, 3000);

    } catch (error) {
      console.error("Erreur startQuiz:", error);
      threadData.quizActive = false;
      await threadsData.set(message.threadID, threadData);
      message.reply("❌ Erreur lors du démarrage du quiz !");
    }
  },

  askQuestion: async function (message, api, quizData, threadsData, usersData) {
    if (quizData.currentQuestion >= quizData.questions.length) {
      return this.endQuiz(message, api, quizData, threadsData);
    }

    const question = quizData.questions[quizData.currentQuestion];
    const questionNum = quizData.currentQuestion + 1;
    const totalQuestions = quizData.questions.length;

    const questionMsg = await message.reply({
      body: `❓ **QUESTION ${questionNum}/${totalQuestions}** ❓\n\n${question.question}\n\n⏰ Vous avez 10 secondes pour répondre !`
    });

    global.GoatBot.onReply.set(questionMsg.messageID, {
      commandName: "quizz",
      messageID: questionMsg.messageID,
      step: "quiz",
      quizData: quizData,
      correctAnswer: question.answer,
      answered: false,
      questionStartTime: Date.now()
    });

    // Timer de 10 secondes
    setTimeout(async () => {
      const replyData = global.GoatBot.onReply.get(questionMsg.messageID);
      if (replyData && !replyData.answered) {
        global.GoatBot.onReply.delete(questionMsg.messageID);
        
        await message.reply(`⏰ **TEMPS ÉCOULÉ !** ⏰\n\n✅ La bonne réponse était : **${question.answer}**`);
        
        quizData.currentQuestion++;
        
        setTimeout(() => {
          this.askQuestion(message, api, quizData, threadsData, usersData);
        }, 2000);
      }
    }, 10000);
  },

  handleAnswer: async function (message, Reply, event, api, threadsData, usersData) {
    if (Reply.answered) return;

    const { quizData, correctAnswer } = Reply;
    const userAnswer = event.body.toLowerCase().trim();
    const senderID = event.senderID;

    // Vérifier si c'est un duel et si le joueur peut répondre
    if (quizData.quizType === "duel" && !quizData.duelPlayers.includes(senderID)) {
      return;
    }

    // Marquer comme répondu
    Reply.answered = true;
    global.GoatBot.onReply.delete(Reply.messageID);

    // Vérifier la réponse
    if (userAnswer === correctAnswer.toLowerCase()) {
      // Bonne réponse
      if (!quizData.scores[senderID]) {
        quizData.scores[senderID] = { points: 0, name: (await usersData.get(senderID)).name };
      }
      quizData.scores[senderID].points += 10;

      // Afficher le tableau des scores
      let scoreBoard = `✅ **BONNE RÉPONSE !** ✅\n\n🏆 **TABLEAU DES SCORES** 🏆\n\n`;
      const sortedScores = Object.entries(quizData.scores).sort((a, b) => b[1].points - a[1].points);
      
      sortedScores.forEach(([userID, data], index) => {
        scoreBoard += `${index + 1}. ${data.name}: ${data.points} pts\n`;
      });

      await message.reply(scoreBoard);
    } else {
      await message.reply(`❌ **MAUVAISE RÉPONSE !** ❌\n\n✅ La bonne réponse était : **${correctAnswer}**`);
    }

    quizData.currentQuestion++;

    // Passer à la question suivante après 2 secondes
    setTimeout(() => {
      this.askQuestion(message, api, quizData, threadsData, usersData);
    }, 2000);
  },

  endQuiz: async function (message, api, quizData, threadsData) {
    const threadData = await threadsData.get(quizData.threadID);
    threadData.quizActive = false;
    await threadsData.set(quizData.threadID, threadData);

    if (Object.keys(quizData.scores).length === 0) {
      return message.reply("🏁 **QUIZ TERMINÉ !** 🏁\n\n😔 Aucune bonne réponse... Essayez encore !");
    }

    const sortedScores = Object.entries(quizData.scores).sort((a, b) => b[1].points - a[1].points);
    const winner = sortedScores[0];

    let endMsg = `🏁 **QUIZ TERMINÉ !** 🏁\n\n`;
    endMsg += `🥇 **VAINQUEUR : ${winner[1].name}** 🥇\n`;
    endMsg += `🎯 Score : ${winner[1].points} points\n\n`;
    endMsg += `📊 **CLASSEMENT FINAL** 📊\n\n`;

    sortedScores.forEach(([userID, data], index) => {
      const medals = ["🥇", "🥈", "🥉"];
      const medal = medals[index] || "🏅";
      endMsg += `${medal} ${data.name}: ${data.points} pts\n`;
    });

    endMsg += `\n🎊 Félicitations à tous les participants ! 🎊`;

    await message.reply(endMsg);
  }
};
        
