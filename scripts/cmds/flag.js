// 📁 flag.js — Commande Quiz Drapeaux pour GoatBot Messenger

const fs = require("fs");

let quizInProgress = false; let currentQuiz = null;

const flags = { facile: [ { emoji: "🇫🇷", answer: "france" }, { emoji: "🇧🇪", answer: "belgique" }, { emoji: "🇨🇦", answer: "canada" }, { emoji: "🇺🇸", answer: "usa" }, { emoji: "🇨🇩", answer: "rdc" }, { emoji: "🇬🇧", answer: "royaume-uni" }, { emoji: "🇮🇹", answer: "italie" }, { emoji: "🇩🇪", answer: "allemagne" }, { emoji: "🇪🇸", answer: "espagne" }, { emoji: "🇯🇵", answer: "japon" }, { emoji: "🇨🇳", answer: "chine" }, { emoji: "🇰🇷", answer: "corée du sud" }, { emoji: "🇲🇽", answer: "mexique" }, { emoji: "🇧🇷", answer: "brésil" }, { emoji: "🇦🇷", answer: "argentine" }, { emoji: "🇵🇹", answer: "portugal" }, { emoji: "🇳🇬", answer: "nigeria" }, { emoji: "🇿🇦", answer: "afrique du sud" }, { emoji: "🇮🇳", answer: "inde" }, { emoji: "🇹🇷", answer: "turquie" }, { emoji: "🇷🇺", answer: "russie" }, { emoji: "🇦🇺", answer: "australie" }, { emoji: "🇸🇳", answer: "sénégal" }, { emoji: "🇲🇦", answer: "maroc" }, { emoji: "🇪🇬", answer: "egypte" }, { emoji: "🇵🇰", answer: "pakistan" }, { emoji: "🇮🇩", answer: "indonésie" }, { emoji: "🇻🇳", answer: "vietnam" }, { emoji: "🇵🇭", answer: "philippines" }, { emoji: "🇸🇪", answer: "suède" }, { emoji: "🇳🇴", answer: "norvège" }, { emoji: "🇫🇮", answer: "finlande" }, { emoji: "🇩🇰", answer: "danemark" }, { emoji: "🇵🇱", answer: "pologne" }, { emoji: "🇨🇭", answer: "suisse" }, { emoji: "🇦🇹", answer: "autriche" }, { emoji: "🇳🇱", answer: "pays-bas" }, { emoji: "🇬🇷", answer: "grèce" }, { emoji: "🇮🇪", answer: "irlande" }, { emoji: "🇧🇬", answer: "bulgarie" }, { emoji: "🇭🇺", answer: "hongrie" }, { emoji: "🇨🇿", answer: "tchéquie" }, { emoji: "🇸🇰", answer: "slovaquie" }, { emoji: "🇷🇴", answer: "roumanie" }, { emoji: "🇭🇷", answer: "croatie" }, { emoji: "🇷🇸", answer: "serbie" }, { emoji: "🇧🇦", answer: "bosnie" }, { emoji: "🇸🇮", answer: "slovénie" }, { emoji: "🇺🇦", answer: "ukraine" } ], difficile: [ { emoji: "🇧🇹", answer: "bhoutan" }, { emoji: "🇲🇭", answer: "îles marshall" }, { emoji: "🇱🇸", answer: "lesotho" }, { emoji: "🇰🇲", answer: "comores" }, { emoji: "🇸🇿", answer: "eswatini" }, { emoji: "🇬🇶", answer: "guinée équatoriale" }, { emoji: "🇨🇫", answer: "république centrafricaine" }, { emoji: "🇪🇷", answer: "érythrée" }, { emoji: "🇹🇱", answer: "timor oriental" }, { emoji: "🇸🇹", answer: "sao tomé-et-principe" }, { emoji: "🇲🇶", answer: "martinique" }, { emoji: "🇬🇫", answer: "guyane française" }, { emoji: "🇻🇨", answer: "saint-vincent-et-les-grenadines" }, { emoji: "🇰🇳", answer: "saint-christophe-et-niévès" }, { emoji: "🇲🇸", answer: "montserrat" }, { emoji: "🇱🇨", answer: "sainte-lucie" }, { emoji: "🇦🇬", answer: "antigua-et-barbuda" }, { emoji: "🇩🇲", answer: "dominique" }, { emoji: "🇧🇧", answer: "barbade" }, { emoji: "🇬🇩", answer: "grenade" }, { emoji: "🇧🇿", answer: "belize" }, { emoji: "🇹🇻", answer: "tuvalu" }, { emoji: "🇳🇷", answer: "nauru" }, { emoji: "🇼🇸", answer: "samoa" }, { emoji: "🇰🇮", answer: "kiribati" }, { emoji: "🇵🇼", answer: "palaos" }, { emoji: "🇫🇲", answer: "micronésie" }, { emoji: "🇸🇧", answer: "îles salomon" }, { emoji: "🇻🇺", answer: "vanuatu" }, { emoji: "🇹🇴", answer: "tonga" }, { emoji: "🇲🇵", answer: "îles mariannes du nord" }, { emoji: "🇲🇫", answer: "saint-martin" }, { emoji: "🇧🇱", answer: "saint-barthélemy" }, { emoji: "🇵🇲", answer: "saint-pierre-et-miquelon" }, { emoji: "🇬🇵", answer: "guadeloupe" }, { emoji: "🇷🇪", answer: "la réunion" }, { emoji: "🇾🇹", answer: "mayotte" }, { emoji: "🇲🇬", answer: "madagascar" }, { emoji: "🇲🇿", answer: "mozambique" }, { emoji: "🇲🇼", answer: "malawi" }, { emoji: "🇹🇿", answer: "tanzanie" }, { emoji: "🇷🇼", answer: "rwanda" }, { emoji: "🇧🇮", answer: "burundi" }, { emoji: "🇸🇴", answer: "somalie" }, { emoji: "🇸🇱", answer: "sierra leone" }, { emoji: "🇱🇷", answer: "libéria" }, { emoji: "🇨🇻", answer: "cap-vert" }, { emoji: "🇬🇲", answer: "gambie" }, { emoji: "🇸🇨", answer: "seychelles" } ] };

module.exports = { config: { name: "flag", version: "1.0", author: "Merdi Madimba", role: 0, shortDescription: "Quiz sur les drapeaux", longDescription: "Un quiz interactif où tu dois deviner le pays à partir du drapeau !", category: "🎮 Jeux", guide: "{p}flag" },

onStart: async function ({ message, event, usersData, args, api }) { if (quizInProgress) return message.reply("⏳ Un quiz est déjà en cours ! Attends qu’il se termine.");

quizInProgress = true;
const senderID = event.senderID;
const threadID = event.threadID;

const ask = (text) => new Promise((resolve) => {
  api.sendMessage(text, threadID, (err, info) => {
    const listener = ({ body, senderID: id }) => {
      if (id === senderID) {
        api.removeListener("message", listener);
        resolve(body.toLowerCase());
      }
    };
    api.listen(listener);
  });
});

const level = await ask("Quel niveau veux-tu ? ✨\n- facile\n- difficile");
if (!flags[level]) return message.reply("❌ Niveau invalide. Commande annulée.");

const nbStr = await ask("Combien de questions ? \n- 5\n- 10\n- 20\n- 30");
const total = parseInt(nbStr);
if (![5, 10, 20, 30].includes(total)) return message.reply("❌ Nombre invalide. Commande annulée.");

const quizSet = [...flags[level]].sort(() => Math.random() - 0.5).slice(0, total);
const scores = {};

for (let i = 0; i < quizSet.length; i++) {
  const q = quizSet[i];
  api.sendMessage(`🌍 Question ${i + 1}/${total} : Quel pays correspond à ce drapeau ? ${q.emoji}`, threadID);

  const response = await new Promise((resolve) => {
    let taken = false;
    const timeout = setTimeout(() => {
      if (!taken) {
        resolve(null);
        api.sendMessage("❌ Stop. Personne n’a take. Nxt Q", threadID);
      }
    }, 10000);

    const listener = ({ body, senderID: id, threadID: tID, messageID }) => {
      if (tID !== threadID || taken) return;
      if (body.toLowerCase() === q.answer) {
        taken = true;
        clearTimeout(timeout);
        api.removeListener("message", listener);
        api.setMessageReaction("✅", messageID, () => {}, true);
        resolve(id);
      }
    };
    api.listen(listener);
  });

  if (response) {
    scores[response] = (scores[response] || 0) + 1;
  }
}

// Classement final
const final = Object.entries(scores).sort((a, b) => b[1] - a[1]);
let board = "🏁 Résultat du Quiz Drapeau :\n\n";
for (let [id, pts] of final) {
  const name = (await usersData.getName(id)) || id;
  board += `@${name} → ${pts} point(s)\n`;
}
if (final.length > 0) {
  const winner = (await usersData.getName(final[0][0])) || final[0][0];
  board += `\n🏆 Gagnant : @${winner}`;
} else {
  board += "Aucun gagnant 😢";
}

message.reply({ body: board, mentions: final.map(([id]) => ({ id, tag: "@" + (usersData.getName(id) || id) })) });
quizInProgress = false;

} };

