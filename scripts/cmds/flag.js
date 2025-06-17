// flag.js - Module GoatBot Messenger

module.exports = { config: { name: "flag", version: "1.0", author: "Merdi Madimba", countDown: 10, role: 0, shortDescription: "Quiz des drapeaux", longDescription: "Quiz avec les drapeaux du monde (niveau facile ou difficile)", category: "games", guide: { fr: "{p}flag facile\n{p}flag difficile\nTapez juste {p}flag pour qu'on vous demande le niveau." } },

onStart: async function ({ message, event, args, usersData }) { const { threadID, senderID } = event; const level = args[0]?.toLowerCase();

if (!level) {
  return message.reply("🌍 Quel niveau veux-tu ? Tape `flag facile` ou `flag difficile`");
}

if (level !== "facile" && level !== "difficile") {
  return message.reply("❌ Niveau invalide. Choisis entre `facile` ou `difficile`.");
}

const flagData = level === "facile" ? easyFlags : hardFlags;

const askNumberMsg = await message.reply("📝 Choisis le nombre de questions: 5, 10, 20 ou 30.", (err, info) => {
  global.GoatBot.onReply.set(info.messageID, {
    commandName: "flag",
    type: "chooseQuestionNumber",
    flagData,
    level,
    author: senderID,
    participants: {},
  });
});

},

onReply: async function ({ message, event, Reply }) { const { type, flagData, level, author, participants } = Reply; const { senderID, body, messageID, threadID } = event;

if (senderID !== author) return;

if (type === "chooseQuestionNumber") {
  const num = parseInt(body);
  if (![5, 10, 20, 30].includes(num)) {
    return message.reply("❌ Choix invalide. Choisis 5, 10, 20 ou 30 questions.");
  }

  const selectedFlags = shuffleArray(flagData).slice(0, num);

  global.quizFlagState = {
    active: true,
    currentIndex: 0,
    questions: selectedFlags,
    participants,
    threadID,
    author,
    totalQuestions: num
  };

  sendFlagQuestion(message);
}

} };

function sendFlagQuestion(message) { const quiz = global.quizFlagState; if (quiz.currentIndex >= quiz.totalQuestions) { return endQuiz(message); }

const current = quiz.questions[quiz.currentIndex]; message.reply(🧠 Question ${quiz.currentIndex + 1} : Quel est ce drapeau ? ${current.emoji});

global.GoatBot.onReply.set(message.messageID, { commandName: "flag", type: "answerQuestion", correct: current.answer.toLowerCase(), author: quiz.author, answered: false, questionIndex: quiz.currentIndex, messageID: message.messageID });

setTimeout(() => { const entry = global.GoatBot.onReply.get(message.messageID); if (entry && !entry.answered) { message.reply("❌ Stop. Personne n'a take, Nxt Q"); global.GoatBot.onReply.delete(message.messageID); quiz.currentIndex++; sendFlagQuestion(message); } }, 10000); }

function endQuiz(message) { const participants = global.quizFlagState.participants; if (Object.keys(participants).length === 0) return message.reply("Personne n'a répondu correctement 😭");

let leaderboard = Object.entries(participants) .sort((a, b) => b[1] - a[1]) .map(([uid, score], i) => 🥇 @${uid}: ${score} pts) .join("\n");

const winner = Object.entries(participants).sort((a, b) => b[1] - a[1])[0]; message.reply(🏁 Résultats du Quiz :\n\n${leaderboard}\n\n🎉 Gagnant: @${winner[0]} (${winner[1]} pts)); global.quizFlagState = { active: false }; }

function shuffleArray(array) { return [...array].sort(() => Math.random() - 0.5); }

 const easyFlags = [ { emoji: "🇫🇷", answer: "france" }, { emoji: "🇺🇸", answer: "usa" }, { emoji: "🇨🇦", answer: "canada" }, { emoji: "🇬🇧", answer: "royaume-uni" }, { emoji: "🇧🇪", answer: "belgique" }, { emoji: "🇨🇭", answer: "suisse" }, { emoji: "🇪🇸", answer: "espagne" }, { emoji: "🇮🇹", answer: "italie" }, { emoji: "🇩🇪", answer: "allemagne" }, { emoji: "🇯🇵", answer: "japon" }, { emoji: "🇨🇳", answer: "chine" }, { emoji: "🇧🇷", answer: "bresil" }, { emoji: "🇦🇷", answer: "argentine" }, { emoji: "🇲🇽", answer: "mexique" }, { emoji: "🇷🇺", answer: "russie" }, { emoji: "🇮🇳", answer: "inde" }, { emoji: "🇸🇪", answer: "suede" }, { emoji: "🇳🇴", answer: "norvege" }, { emoji: "🇩🇰", answer: "danemark" }, { emoji: "🇵🇹", answer: "portugal" }, { emoji: "🇬🇷", answer: "grece" }, { emoji: "🇦🇺", answer: "australie" }, { emoji: "🇳🇿", answer: "nouvelle-zelande" }, { emoji: "🇰🇷", answer: "coree du sud" }, { emoji: "🇿🇦", answer: "afrique du sud" }, { emoji: "🇰🇪", answer: "kenya" }, { emoji: "🇪🇬", answer: "egypte" }, { emoji: "🇳🇬", answer: "nigeria" }, { emoji: "🇲🇦", answer: "maroc" }, { emoji: "🇹🇳", answer: "tunisie" }, { emoji: "🇸🇳", answer: "senegal" }, { emoji: "🇨🇮", answer: "cote d'ivoire" }, { emoji: "🇨🇲", answer: "cameroun" }, { emoji: "🇷🇴", answer: "roumanie" }, { emoji: "🇭🇺", answer: "hongrie" }, { emoji: "🇧🇬", answer: "bulgarie" }, { emoji: "🇹🇷", answer: "turquie" }, { emoji: "🇵🇱", answer: "pologne" }, { emoji: "🇺🇦", answer: "ukraine" }, { emoji: "🇮🇱", answer: "israel" }, { emoji: "🇸🇦", answer: "arabie saoudite" }, { emoji: "🇮🇷", answer: "iran" }, { emoji: "🇮🇶", answer: "irak" }, { emoji: "🇵🇰", answer: "pakistan" }, { emoji: "🇦🇫", answer: "afghanistan" }, { emoji: "🇹🇭", answer: "thailande" }, { emoji: "🇻🇳", answer: "vietnam" }, { emoji: "🇸🇬", answer: "singapour" }, { emoji: "🇵🇭", answer: "philippines" } ];

 const hardFlags = [ { emoji: "🇱🇦", answer: "laos" }, { emoji: "🇧🇹", answer: "bhoutan" }, { emoji: "🇲🇻", answer: "maldives" }, { emoji: "🇹🇱", answer: "timor oriental" }, { emoji: "🇪🇷", answer: "erythree" }, { emoji: "🇱🇸", answer: "lesotho" }, { emoji: "🇲🇿", answer: "mozambique" }, { emoji: "🇧🇮", answer: "burundi" }, { emoji: "🇲🇼", answer: "malawi" }, { emoji: "🇨🇫", answer: "centrafrique" }, { emoji: "🇬🇶", answer: "guinee equatoriale" }, { emoji: "🇰🇲", answer: "comores" }, { emoji: "🇸🇹", answer: "sao tome" }, { emoji: "🇹🇬", answer: "togo" }, { emoji: "🇧🇯", answer: "benin" }, { emoji: "🇬🇲", answer: "gambie" }, { emoji: "🇱🇷", answer: "liberia" }, { emoji: "🇸🇱", answer: "sierra leone" }, { emoji: "🇬🇼", answer: "guinee bissau" }, { emoji: "🇲🇺", answer: "maurice" }, { emoji: "🇸🇨", answer: "seychelles" }, { emoji: "🇻🇺", answer: "vanuatu" }, { emoji: "🇰🇮", answer: "kiribati" }, { emoji: "🇸🇧", answer: "iles salomon" }, { emoji: "🇹🇻", answer: "tuvalu" }, { emoji: "🇳🇷", answer: "nauru" }, { emoji: "🇲🇭", answer: "iles marshall" }, { emoji: "🇵🇼", answer: "palaos" }, { emoji: "🇫🇲", answer: "micronesie" }, { emoji: "🇸🇲", answer: "saint-marin" }, { emoji: "🇱🇮", answer: "liechtenstein" }, { emoji: "🇦🇩", answer: "andorre" }, { emoji: "🇲🇨", answer: "monaco" }, { emoji: "🇻🇦", answer: "vatican" }, { emoji: "🇱🇺", answer: "luxembourg" }, { emoji: "🇲🇹", answer: "malte" }, { emoji: "🇦🇲", answer: "armenie" }, { emoji: "🇬🇪", answer: "georgie" }, { emoji: "🇲🇰", answer: "macedoine" }, { emoji: "🇦🇿", answer: "azerbaidjan" }, { emoji: "🇰🇿", answer: "kazakhstan" }, { emoji: "🇹🇲", answer: "turkmenistan" }, { emoji: "🇺🇿", answer: "ouzbekistan" }, { emoji: "🇰🇬", answer: "kirghizistan" }, { emoji: "🇲🇳", answer: "mongolie" }, { emoji: "🇳🇵", answer: "nepal" }, { emoji: "🇧🇩", answer: "bangladesh" }, { emoji: "🇲🇲", answer: "birmanie" } ];

    
