
const fs = require('fs');
const path = require('path');

// Variables globales pour gérer l'état du quiz
const activeQuizzes = new Map();

module.exports = {
  config: {
    name: "quizz",
    version: "1.0",
    author: "MERDI MADIMBA",
    countDown: 5,
    role: 0, // Seul admin peut lancer
    shortDescription: "Système de quiz interactif",
    longDescription: "Quiz avec duels et questions générales",
    category: "game",
    guide: "{pn} pour lancer un quiz"
  },

  onStart: async function ({ message, event, api }) {
    const threadID = event.threadID;
    
    // Vérifier si un quiz est déjà actif dans ce groupe
    if (activeQuizzes.has(threadID)) {
      return message.reply("❌ Un quiz est déjà en cours dans ce groupe !");
    }

    // Initialiser le quiz
    const quizData = {
      threadID: threadID,
      adminID: event.senderID,
      state: 'category',
      currentQuestion: 0,
      scores: new Map(),
      questions: [],
      timer: null,
      isDuel: false,
      duelists: []
    };

    activeQuizzes.set(threadID, quizData);

    const categoryMessage = `🎯 **QUIZ INTERACTIF** 🎯

Choisissez votre rubrique :
📚 **manga** - Questions sur les mangas
🧠 **culture générale** - Questions de culture générale

Répondez avec le nom de la rubrique que vous voulez !`;

    const info = await message.reply(categoryMessage);
    
    // Gérer le timeout de sélection
    setTimeout(() => {
      if (activeQuizzes.has(threadID) && activeQuizzes.get(threadID).state === 'category') {
        activeQuizzes.delete(threadID);
        api.sendMessage("⏰ Temps écoulé pour choisir la rubrique. Quiz annulé.", threadID);
      }
    }, 30000);
  },

  onReply: async function ({ message, Reply, event, api }) {
    const threadID = event.threadID;
    const quizData = activeQuizzes.get(threadID);
    
    if (!quizData) return;

    const userInput = event.body.toLowerCase().trim();

    switch (quizData.state) {
      case 'category':
        await this.handleCategorySelection(userInput, quizData, message, event, api);
        break;
      case 'mode':
        await this.handleModeSelection(userInput, quizData, message, event, api);
        break;
      case 'duelists':
        await this.handleDuelistSelection(userInput, quizData, message, event, api);
        break;
      case 'questionCount':
        await this.handleQuestionCount(userInput, quizData, message, event, api);
        break;
      case 'answering':
        await this.handleAnswer(userInput, quizData, message, event, api);
        break;
    }
  },

  async handleCategorySelection(userInput, quizData, message, event, api) {
    if (event.senderID !== quizData.adminID) return;

    if (!['manga', 'culture générale'].includes(userInput)) {
      return message.reply("❌ Veuillez choisir entre 'manga' ou 'culture générale'");
    }

    quizData.category = userInput;
    quizData.state = 'mode';

    const modeMessage = `✅ Rubrique **${userInput}** sélectionnée !

Choisissez le mode de jeu :
⚔️ **duel** - Quiz entre deux joueurs spécifiques
🌍 **général** - Quiz ouvert à tous

Répondez avec 'duel' ou 'général' !`;

    message.reply(modeMessage);
  },

  async handleModeSelection(userInput, quizData, message, event, api) {
    if (event.senderID !== quizData.adminID) return;

    if (!['duel', 'général'].includes(userInput)) {
      return message.reply("❌ Veuillez choisir entre 'duel' ou 'général'");
    }

    if (userInput === 'duel') {
      quizData.isDuel = true;
      quizData.state = 'duelists';
      message.reply("⚔️ Mode duel sélectionné !\n\nVeuillez mentionner les deux participants du duel (ex: @user1 @user2)");
    } else {
      quizData.isDuel = false;
      quizData.state = 'questionCount';
      message.reply("🌍 Mode général sélectionné !\n\nChoisissez le nombre de questions : 10, 20, 30 ou 50");
    }
  },

  async handleDuelistSelection(userInput, quizData, message, event, api) {
    if (event.senderID !== quizData.adminID) return;

    const mentions = Object.keys(event.mentions || {});
    if (mentions.length !== 2) {
      return message.reply("❌ Vous devez mentionner exactement 2 participants pour le duel !");
    }

    quizData.duelists = mentions;
    quizData.state = 'questionCount';
    
    const duelist1 = event.mentions[mentions[0]];
    const duelist2 = event.mentions[mentions[1]];
    
    message.reply(`⚔️ Duelistes sélectionnés :\n• ${duelist1}\n• ${duelist2}\n\nChoisissez le nombre de questions : 10, 20, 30 ou 50`);
  },

  async handleQuestionCount(userInput, quizData, message, event, api) {
    if (event.senderID !== quizData.adminID) return;

    const count = parseInt(userInput);
    if (![10, 20, 30, 50].includes(count)) {
      return message.reply("❌ Veuillez choisir 10, 20, 30 ou 50 questions");
    }

    quizData.questionCount = count;
    await this.loadQuestions(quizData);
    await this.startQuiz(quizData, message, api);
  },

  async loadQuestions(quizData) {
    const fileName = quizData.category === 'manga' ? 'manga_questions.json' : 'culture_generale_questions.json';
    
    try {
      const data = fs.readFileSync(fileName, 'utf8');
      const questionsData = JSON.parse(data);
      
      // Mélanger et sélectionner le bon nombre de questions
      const shuffled = questionsData.questions.sort(() => 0.5 - Math.random());
      quizData.questions = shuffled.slice(0, quizData.questionCount);
    } catch (error) {
      console.error('Erreur lors du chargement des questions:', error);
      quizData.questions = [];
    }
  },

  async startQuiz(quizData, message, api) {
    quizData.state = 'answering';
    quizData.currentQuestion = 0;

    const startMessage = `🎉 **QUIZ LANCÉ !** 🎉

📚 Rubrique: ${quizData.category}
${quizData.isDuel ? '⚔️ Mode: Duel' : '🌍 Mode: Général'}
📊 Questions: ${quizData.questionCount}
⏱️ Temps par question: 10 secondes

${quizData.isDuel ? '👥 Participants: Seuls les duelistes peuvent répondre' : '👥 Participants: Tout le monde peut répondre'}

Le quiz commence dans 3 secondes...`;

    await message.reply(startMessage);
    
    setTimeout(() => {
      this.askNextQuestion(quizData, api);
    }, 3000);
  },

  async askNextQuestion(quizData, api) {
    if (quizData.currentQuestion >= quizData.questions.length) {
      return this.endQuiz(quizData, api);
    }

    const question = quizData.questions[quizData.currentQuestion];
    quizData.waitingForAnswer = true;
    quizData.correctAnswer = question.answer;

    const questionMessage = `❓ **Question ${quizData.currentQuestion + 1}/${quizData.questionCount}**

${question.question}

⏱️ Vous avez 10 secondes pour répondre !`;

    api.sendMessage(questionMessage, quizData.threadID);

    // Timer de 10 secondes
    quizData.timer = setTimeout(() => {
      if (quizData.waitingForAnswer) {
        quizData.waitingForAnswer = false;
        api.sendMessage(`⏰ **Temps écoulé !**\n\n✅ La bonne réponse était: **${question.answer}**`, quizData.threadID);
        
        setTimeout(() => {
          quizData.currentQuestion++;
          this.askNextQuestion(quizData, api);
        }, 2000);
      }
    }, 10000);
  },

  async handleAnswer(userInput, quizData, message, event, api) {
    if (!quizData.waitingForAnswer) return;

    // Vérifier si c'est un duel et si la personne peut répondre
    if (quizData.isDuel && !quizData.duelists.includes(event.senderID)) {
      return;
    }

    // Vérifier la réponse
    if (userInput === quizData.correctAnswer) {
      quizData.waitingForAnswer = false;
      clearTimeout(quizData.timer);

      // Ajouter points
      const currentScore = quizData.scores.get(event.senderID) || 0;
      quizData.scores.set(event.senderID, currentScore + 10);

      // Créer le tableau des scores
      const scoreBoard = await this.createScoreBoard(quizData, event, api);
      
      const correctMessage = `🎉 **Bonne réponse !** 🎉

${event.senderName} gagne 10 points !

📊 **TABLEAU DES SCORES:**
${scoreBoard}`;

      api.sendMessage(correctMessage, quizData.threadID);

      setTimeout(() => {
        quizData.currentQuestion++;
        this.askNextQuestion(quizData, api);
      }, 3000);
    }
  },

  async createScoreBoard(quizData, event, api) {
    let scoreText = "";
    const sortedScores = [...quizData.scores.entries()].sort((a, b) => b[1] - a[1]);
    
    for (let i = 0; i < sortedScores.length; i++) {
      const [userID, score] = sortedScores[i];
      let userName = "Utilisateur";
      
      try {
        const userInfo = await api.getUserInfo(userID);
        userName = userInfo[userID].name;
      } catch (error) {
        console.error('Erreur récupération nom:', error);
      }
      
      const position = i + 1;
      const medal = position === 1 ? "🥇" : position === 2 ? "🥈" : position === 3 ? "🥉" : "🏅";
      
      scoreText += `${medal} ${userName}: ${score} pts\n`;
    }
    
    return scoreText || "Aucun point pour le moment";
  },

  async endQuiz(quizData, api) {
    const sortedScores = [...quizData.scores.entries()].sort((a, b) => b[1] - a[1]);
    
    let finalMessage = `🏆 **QUIZ TERMINÉ !** 🏆\n\n📊 **CLASSEMENT FINAL:**\n`;
    
    if (sortedScores.length === 0) {
      finalMessage += "Aucun point n'a été marqué ! 😅";
    } else {
      for (let i = 0; i < sortedScores.length; i++) {
        const [userID, score] = sortedScores[i];
        let userName = "Utilisateur";
        
        try {
          const userInfo = await api.getUserInfo(userID);
          userName = userInfo[userID].name;
        } catch (error) {
          console.error('Erreur récupération nom:', error);
        }
        
        const position = i + 1;
        const medal = position === 1 ? "🥇" : position === 2 ? "🥈" : position === 3 ? "🥉" : "🏅";
        
        finalMessage += `${medal} ${position}. ${userName}: ${score} pts\n`;
      }
      
      if (sortedScores.length > 0) {
        try {
          const winnerInfo = await api.getUserInfo(sortedScores[0][0]);
          const winnerName = winnerInfo[sortedScores[0][0]].name;
          finalMessage += `\n🎉 **Félicitations ${winnerName} !** 🎉\nVous êtes le vainqueur avec ${sortedScores[0][1]} points !`;
        } catch (error) {
          finalMessage += `\n🎉 **Félicitations au vainqueur !** 🎉`;
        }
      }
    }
    
    finalMessage += `\n\n📚 Rubrique: ${quizData.category}\n🎯 Questions: ${quizData.questionCount}\n${quizData.isDuel ? '⚔️ Mode: Duel' : '🌍 Mode: Général'}`;
    
    api.sendMessage(finalMessage, quizData.threadID);
    
    // Nettoyer
    activeQuizzes.delete(quizData.threadID);
  }
};
    
