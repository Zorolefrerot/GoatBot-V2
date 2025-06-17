const fs = require("fs-extra");

module.exports = { config: { name: "flag", version: "1.1", author: "Merdi Madimba", countDown: 5, role: 0, shortDescription: "Quiz drapeaux", longDescription: "Lance un quiz de reconnaissance des drapeaux avec classement final", category: "game", guide: "{pn} [facile|difficile]" },

onStart: async function ({ message, event, args, usersData, commandName, api }) { const levelInput = args[0]?.toLowerCase(); const levels = ["facile", "difficile"];

if (!levelInput || !levels.includes(levelInput)) {
  return message.reply("🧠 Tu dois spécifier un niveau de difficulté. Exemple :\n› flag facile\n› flag difficile\n\nOu tape simplement `flag` pour recommencer.");
}

const level = levelInput;

const questionCounts = [5, 10, 20, 30];

const listener = async ({ event: eventCount, message: msgCount }) => {
  const count = parseInt(msgCount.body);
  if (!questionCounts.includes(count)) {
    return message.reply("❌ Nombre invalide. Choisis entre : 5 | 10 | 20 | 30");
  }

  global.GoatBot.onReply.delete(event.threadID);
  await startQuiz(level, count, event.threadID, message, api);
};

message.reply(`📊 Combien de questions veux-tu pour le niveau ${level.toUpperCase()} ?\nChoisis parmi : 5 | 10 | 20 | 30`, (err, info) => {
  global.GoatBot.onReply.set(info.messageID, {
    commandName,
    messageID: info.messageID,
    author: event.senderID,
    type: "getCount",
    callback: listener
  });
});

} };

const easyFlags = [ { emoji: "🇫🇷", answer: "France" }, { emoji: "🇧🇪", answer: "Belgique" }, { emoji: "🇨🇩", answer: "RDC" }, { emoji: "🇯🇵", answer: "Japon" }, { emoji: "🇺🇸", answer: "États-Unis" }, { emoji: "🇮🇹", answer: "Italie" }, { emoji: "🇨🇳", answer: "Chine" }, { emoji: "🇷🇺", answer: "Russie" }, { emoji: "🇨🇦", answer: "Canada" }, { emoji: "🇧🇷", answer: "Brésil" }, { emoji: "🇬🇧", answer: "Royaume-Uni" }, { emoji: "🇩🇪", answer: "Allemagne" }, { emoji: "🇪🇸", answer: "Espagne" }, { emoji: "🇲🇽", answer: "Mexique" }, { emoji: "🇦🇷", answer: "Argentine" }, { emoji: "🇳🇬", answer: "Nigéria" }, { emoji: "🇰🇪", answer: "Kenya" }, { emoji: "🇿🇦", answer: "Afrique du Sud" }, { emoji: "🇪🇬", answer: "Égypte" }, { emoji: "🇲🇦", answer: "Maroc" }, { emoji: "🇸🇳", answer: "Sénégal" }, { emoji: "🇹🇳", answer: "Tunisie" }, { emoji: "🇬🇭", answer: "Ghana" }, { emoji: "🇪🇹", answer: "Éthiopie" }, { emoji: "🇸🇩", answer: "Soudan" }, { emoji: "🇲🇱", answer: "Mali" }, { emoji: "🇳🇪", answer: "Niger" }, { emoji: "🇨🇲", answer: "Cameroun" }, { emoji: "🇹🇬", answer: "Togo" }, { emoji: "🇧🇯", answer: "Bénin" }, { emoji: "🇺🇬", answer: "Ouganda" }, { emoji: "🇨🇮", answer: "Côte d'Ivoire" }, { emoji: "🇷🇼", answer: "Rwanda" }, { emoji: "🇧🇫", answer: "Burkina Faso" }, { emoji: "🇧🇮", answer: "Burundi" }, { emoji: "🇸🇴", answer: "Somalie" }, { emoji: "🇹🇿", answer: "Tanzanie" }, { emoji: "🇲🇿", answer: "Mozambique" }, { emoji: "🇦🇴", answer: "Angola" }, { emoji: "🇲🇬", answer: "Madagascar" }, { emoji: "🇿🇲", answer: "Zambie" }, { emoji: "🇲🇼", answer: "Malawi" }, { emoji: "🇱🇷", answer: "Libéria" }, { emoji: "🇱🇸", answer: "Lesotho" }, { emoji: "🇱🇾", answer: "Libye" }, { emoji: "🇩🇯", answer: "Djibouti" }, { emoji: "🇬🇶", answer: "Guinée équatoriale" }, { emoji: "🇨🇬", answer: "Congo" }, { emoji: "🇬🇦", answer: "Gabon" }, { emoji: "🇸🇱", answer: "Sierra Leone" } ];

const hardFlags = [ { emoji: "🇹🇱", answer: "Timor oriental" }, { emoji: "🇲🇭", answer: "Îles Marshall" }, { emoji: "🇰🇮", answer: "Kiribati" }, { emoji: "🇵🇼", answer: "Palaos" }, { emoji: "🇧🇿", answer: "Belize" }, { emoji: "🇬🇾", answer: "Guyana" }, { emoji: "🇸🇷", answer: "Suriname" }, { emoji: "🇦🇬", answer: "Antigua-et-Barbuda" }, { emoji: "🇧🇧", answer: "Barbade" }, { emoji: "🇻🇨", answer: "Saint-Vincent-et-les-Grenadines" }, { emoji: "🇩🇲", answer: "Dominique" }, { emoji: "🇬🇩", answer: "Grenade" }, { emoji: "🇰🇳", answer: "Saint-Christophe-et-Niévès" }, { emoji: "🇱🇨", answer: "Sainte-Lucie" }, { emoji: "🇲🇻", answer: "Maldives" }, { emoji: "🇧🇹", answer: "Bhoutan" }, { emoji: "🇲🇳", answer: "Mongolie" }, { emoji: "🇳🇷", answer: "Nauru" }, { emoji: "🇸🇧", answer: "Îles Salomon" }, { emoji: "🇻🇺", answer: "Vanuatu" }, { emoji: "🇼🇸", answer: "Samoa" }, { emoji: "🇹🇴", answer: "Tonga" }, { emoji: "🇫🇯", answer: "Fidji" }, { emoji: "🇹🇻", answer: "Tuvalu" }, { emoji: "🇸🇨", answer: "Seychelles" }, { emoji: "🇰🇲", answer: "Comores" }, { emoji: "🇲🇺", answer: "Maurice" }, { emoji: "🇧🇮", answer: "Burundi" }, { emoji: "🇪🇷", answer: "Érythrée" }, { emoji: "🇸🇴", answer: "Somalie" }, { emoji: "🇬🇼", answer: "Guinée-Bissau" }, { emoji: "🇹🇬", answer: "Togo" }, { emoji: "🇸🇹", answer: "Sao Tomé-et-Principe" }, { emoji: "🇲🇶", answer: "Martinique" }, { emoji: "🇵🇫", answer: "Polynésie française" }, { emoji: "🇬🇫", answer: "Guyane française" }, { emoji: "🇨🇽", answer: "Île Christmas" }, { emoji: "🇦🇸", answer: "Samoa américaines" }, { emoji: "🇧🇲", answer: "Bermudes" }, { emoji: "🇬🇬", answer: "Guernesey" }, { emoji: "🇯🇪", answer: "Jersey" }, { emoji: "🇲🇴", answer: "Macao" }, { emoji: "🇬🇮", answer: "Gibraltar" }, { emoji: "🇬🇱", answer: "Groenland" }, { emoji: "🇦🇮", answer: "Anguilla" }, { emoji: "🇨🇼", answer: "Curaçao" }, { emoji: "🇧🇶", answer: "Pays-Bas caribéens" }, { emoji: "🇰🇾", answer: "Îles Caïmans" }, { emoji: "🇲🇵", answer: "Îles Mariannes du Nord" } ];

    
