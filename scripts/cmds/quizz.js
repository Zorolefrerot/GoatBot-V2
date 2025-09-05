
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "quizz",
    version: "1.0",
    author: "Merdi Madimba",
    countDown: 5,
    role: 1, // Seuls les admins peuvent lancer
    shortDescription: {
      vi: "Jeu de quiz",
      en: "Quiz game"
    },
    longDescription: {
      vi: "Jeu de quiz avec différentes catégories",
      en: "Quiz game with different categories"
    },
    category: "game",
    guide: {
      vi: "{pn}",
      en: "{pn}"
    }
  },

  langs: {
    vi: {
      // Textes en vietnamien si nécessaire
    },
    en: {
      chooseCategory: "🎮 **QUIZ GAME** 🎮\n\n📚 Choisissez une catégorie :\n\n🌸 **manga** - Questions sur les mangas/animes\n🧠 **culture** - Culture générale\n\n💬 Répondez avec le nom de la catégorie",
      chooseMode: "🎯 **MODE DE JEU** 🎯\n\n⚔️ **duel** - Combat entre 2 joueurs\n🌟 **general** - Quiz ouvert à tous\n\n💬 Répondez avec le mode choisi",
      enterUIDs: "👥 **DUEL MODE** 👥\n\n🎯 Entrez les UID des deux duellistes\nFormat: uid1 uid2\n\n📝 Exemple: 123456789 987654321",
      chooseQuestions: "🔢 **NOMBRE DE QUESTIONS** 🔢\n\n📊 Choisissez le nombre de questions :\n\n🎯 **10** questions\n🎯 **20** questions\n🎯 **30** questions\n🎯 **50** questions\n\n💬 Répondez avec le nombre",
      gameInProgress: "⚠️ **QUIZ DÉJÀ EN COURS** ⚠️\n\n🎮 Un quiz est déjà actif dans ce groupe!\n⏰ Veuillez attendre qu'il se termine.",
      invalidCategory: "❌ **CATÉGORIE INVALIDE** ❌\n\n📚 Catégories disponibles :\n• manga\n• culture",
      invalidMode: "❌ **MODE INVALIDE** ❌\n\n🎯 Modes disponibles :\n• duel\n• general",
      invalidUIDs: "❌ **UID INVALIDES** ❌\n\n📝 Format correct : uid1 uid2\n💡 Exemple : 123456789 987654321",
      invalidQuestions: "❌ **NOMBRE INVALIDE** ❌\n\n🔢 Nombres autorisés : 10, 20, 30, 50",
      timeUp: "⏰ **TEMPS ÉCOULÉ** ⏰\n\n❌ Personne n'a répondu à temps!\n✅ **Réponse correcte :** {answer}",
      correctAnswer: "🎉 **BONNE RÉPONSE !** 🎉\n\n👤 **{name}** a trouvé la bonne réponse !\n💎 **+10 points**",
      finalScores: "🏆 **RÉSULTATS FINAUX** 🏆\n\n{scores}\n\n🥇 **VAINQUEUR : {winner}**\n💎 **Score final : {score} points**",
      noScores: "😅 **AUCUN POINT** 😅\n\nPersonne n'a réussi à répondre correctement!\n🤔 Il faut réviser un peu plus..."
    }
  },

  onStart: async function ({ message, event, getLang, usersData }) {
    const threadID = event.threadID;
    
    // Vérifier si un quiz est déjà en cours
    if (global.quizSessions && global.quizSessions[threadID]) {
      return message.reply(getLang("gameInProgress"));
    }

    // Initialiser le stockage des sessions si nécessaire
    if (!global.quizSessions) {
      global.quizSessions = {};
    }

    // Créer une nouvelle session
    global.quizSessions[threadID] = {
      step: 'category',
      host: event.senderID,
      category: null,
      mode: null,
      players: null,
      questionCount: null,
      currentQuestion: 0,
      scores: {},
      questions: [],
      currentTimeout: null
    };

    message.reply(getLang("chooseCategory"), (err, info) => {
      if (err) return;
      
      global.GoatBot.onReply.set(info.messageID, {
        commandName: 'quizz',
        messageID: info.messageID,
        author: event.senderID,
        step: 'category'
      });
    });
  },

  onReply: async function ({ message, event, Reply, getLang, usersData }) {
    const threadID = event.threadID;
    const userID = event.senderID;
    const session = global.quizSessions[threadID];
    const userReply = event.body.toLowerCase().trim();

    if (!session) return;

    // Si ce n'est pas l'hôte qui répond aux étapes de configuration
    if (['category', 'mode', 'uids', 'questions'].includes(session.step) && userID !== session.host) {
      return;
    }

    switch (session.step) {
      case 'category':
        if (!['manga', 'culture'].includes(userReply)) {
          return message.reply(getLang("invalidCategory"));
        }
        
        session.category = userReply;
        session.step = 'mode';
        
        message.reply(getLang("chooseMode"), (err, info) => {
          if (err) return;
          
          global.GoatBot.onReply.set(info.messageID, {
            commandName: 'quizz',
            messageID: info.messageID,
            author: event.senderID,
            step: 'mode'
          });
        });
        break;

      case 'mode':
        if (!['duel', 'general'].includes(userReply)) {
          return message.reply(getLang("invalidMode"));
        }
        
        session.mode = userReply;
        
        if (userReply === 'duel') {
          session.step = 'uids';
          message.reply(getLang("enterUIDs"), (err, info) => {
            if (err) return;
            
            global.GoatBot.onReply.set(info.messageID, {
              commandName: 'quizz',
              messageID: info.messageID,
              author: event.senderID,
              step: 'uids'
            });
          });
        } else {
          session.step = 'questions';
          message.reply(getLang("chooseQuestions"), (err, info) => {
            if (err) return;
            
            global.GoatBot.onReply.set(info.messageID, {
              commandName: 'quizz',
              messageID: info.messageID,
              author: event.senderID,
              step: 'questions'
            });
          });
        }
        break;

      case 'uids':
        const uids = event.body.trim().split(' ');
        if (uids.length !== 2) {
          return message.reply(getLang("invalidUIDs"));
        }
        
        session.players = uids;
        session.step = 'questions';
        
        message.reply(getLang("chooseQuestions"), (err, info) => {
          if (err) return;
          
          global.GoatBot.onReply.set(info.messageID, {
            commandName: 'quizz',
            messageID: info.messageID,
            author: event.senderID,
            step: 'questions'
          });
        });
        break;

      case 'questions':
        const count = parseInt(userReply);
        if (![10, 20, 30, 50].includes(count)) {
          return message.reply(getLang("invalidQuestions"));
        }
        
        session.questionCount = count;
        await this.loadQuestions(session);
        await this.startQuiz(session, message, getLang, usersData);
        break;

      case 'quiz':
        await this.handleAnswer(session, userID, event.body.trim(), message, getLang, usersData);
        break;
    }
  },

  loadQuestions: async function (session) {
    const fileName = session.category === 'manga' ? 'questions_manga.json' : 'questions_culture.json';
    const filePath = path.join(__dirname, fileName);
    
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const allQuestions = JSON.parse(data);
      
      // Mélanger et prendre le nombre de questions demandé
      const shuffled = allQuestions.sort(() => 0.5 - Math.random());
      session.questions = shuffled.slice(0, session.questionCount);
    } catch (error) {
      console.error('Erreur lors du chargement des questions:', error);
      session.questions = [];
    }
  },

  startQuiz: async function (session, message, getLang, usersData) {
    session.step = 'quiz';
    session.currentQuestion = 0;
    await this.askQuestion(session, message, getLang, usersData);
  },

  askQuestion: async function (session, message, getLang, usersData) {
    if (session.currentQuestion >= session.questions.length) {
      await this.endQuiz(session, message, getLang, usersData);
      return;
    }

    const question = session.questions[session.currentQuestion];
    const questionNumber = session.currentQuestion + 1;
    const totalQuestions = session.questions.length;

    const questionText = `🎯 **QUESTION ${questionNumber}/${totalQuestions}** 🎯\n\n❓ **${question.question}**\n\n⏰ **Temps : 10 secondes**\n💡 Répondez directement dans le chat !`;

    message.reply(questionText, (err, info) => {
      if (err) return;
      
      global.GoatBot.onReply.set(info.messageID, {
        commandName: 'quizz',
        messageID: info.messageID,
        author: session.host,
        step: 'quiz'
      });

      // Timer de 10 secondes
      session.currentTimeout = setTimeout(async () => {
        await this.timeUp(session, message, getLang);
      }, 10000);
    });
  },

  handleAnswer: async function (session, userID, answer, message, getLang, usersData) {
    // Vérifier si c'est un mode duel et si l'utilisateur est autorisé
    if (session.mode === 'duel' && !session.players.includes(userID)) {
      return;
    }

    const correctAnswer = session.questions[session.currentQuestion].answer.toLowerCase();
    const userAnswer = answer.toLowerCase();

    if (userAnswer === correctAnswer) {
      // Annuler le timeout
      if (session.currentTimeout) {
        clearTimeout(session.currentTimeout);
        session.currentTimeout = null;
      }

      // Ajouter des points
      if (!session.scores[userID]) {
        session.scores[userID] = { name: '', points: 0 };
      }
      session.scores[userID].points += 10;
      
      // Récupérer le nom de l'utilisateur
      try {
        const userData = await usersData.get(userID);
        session.scores[userID].name = userData.name;
      } catch (error) {
        session.scores[userID].name = 'Utilisateur';
      }

      // Afficher le tableau des scores
      const scoreTable = await this.generateScoreTable(session, usersData);
      const correctMsg = getLang("correctAnswer").replace("{name}", session.scores[userID].name);
      
      message.reply(`${correctMsg}\n\n${scoreTable}`, async () => {
        // Attendre 2 secondes puis passer à la question suivante
        setTimeout(async () => {
          session.currentQuestion++;
          await this.askQuestion(session, message, getLang, usersData);
        }, 2000);
      });
    }
  },

  timeUp: async function (session, message, getLang) {
    const correctAnswer = session.questions[session.currentQuestion].answer;
    const timeUpMsg = getLang("timeUp").replace("{answer}", correctAnswer);
    
    message.reply(timeUpMsg, async () => {
      // Attendre 2 secondes puis passer à la question suivante
      setTimeout(async () => {
        session.currentQuestion++;
        await this.askQuestion(session, message, getLang, require('global').usersData);
      }, 2000);
    });
  },

  generateScoreTable: async function (session, usersData) {
    const scores = Object.entries(session.scores)
      .sort(([,a], [,b]) => b.points - a.points);

    if (scores.length === 0) return "";

    let table = "🏆 **TABLEAU DES SCORES** 🏆\n\n";
    
    for (let i = 0; i < scores.length; i++) {
      const [userID, data] = scores[i];
      const rank = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🏅";
      table += `${rank} **${data.name}** - ${data.points} points\n`;
    }

    return table;
  },

  endQuiz: async function (session, message, getLang, usersData) {
    const scores = Object.entries(session.scores)
      .sort(([,a], [,b]) => b.points - a.points);

    if (scores.length === 0) {
      message.reply(getLang("noScores"));
    } else {
      const winner = scores[0][1];
      const scoreTable = await this.generateScoreTable(session, usersData);
      const finalMsg = getLang("finalScores")
        .replace("{scores}", scoreTable)
        .replace("{winner}", winner.name)
        .replace("{score}", winner.points);
      
      message.reply(finalMsg);
    }

    // Nettoyer la session
    delete global.quizSessions[message.threadID || session.threadID];
  }
};
