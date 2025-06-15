
const fs = require("fs");
const path = __dirname + "/scoreData.json";

module.exports = {
  config: {
    name: "score",
    version: "1.0",
    author: "Merdi Madimba",
    description: {
      fr: "Gérer les scores d’un groupe Messenger"
    },
    usage: "{prefix}score add/set/position/top",
    commandCategory: "groupe",
    cooldowns: 2
  },

  onStart: async function ({ message, event, args, prefix }) {
    const ADMIN_ID = "100065927401614"; // Remplace ceci par ton UID Facebook
    const threadID = event.threadID;
    const senderID = event.senderID;

    if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));
    const data = JSON.parse(fs.readFileSync(path));
    if (!data[threadID]) data[threadID] = {};

    const cmd = args[0];
    const nom = args[1];
    const valeur = parseInt(args[2]);

    if (["add", "set"].includes(cmd) && senderID !== ADMIN_ID)
      return message.reply("❌ Seul l’administrateur du bot peut modifier les scores.");

    switch (cmd) {
      case "add":
        if (!nom || isNaN(valeur)) return message.reply(`❗ ${prefix}score add [nom] [points]`);
        data[threadID][nom] = (data[threadID][nom] || 0) + valeur;
        fs.writeFileSync(path, JSON.stringify(data, null, 2));
        return message.reply(`✅ Ajouté{valeur} pts à nom (total :{data[threadID][nom]} pts)`);

      case "set":
        if (!nom || isNaN(valeur)) return message.reply(`❗ prefixscore set [nom] [points]`);
        data[threadID][nom] = valeur;
        fs.writeFileSync(path, JSON.stringify(data, null, 2));
        return message.reply(`✅ Score de{nom} mis à jour : valeur pts`);

      case "position":
        if (!nom) return message.reply(`❗{prefix}score position [nom]`);
        const classement = Object.entries(data[threadID]).sort((a, b) => b[1] - a[1]);
        const pos = classement.findIndex(([n]) => n.toLowerCase() === nom.toLowerCase());
        if (pos === -1) return message.reply(`🔍 Aucun joueur nommé "nom"`);
        return message.reply(`📌 Joueur :{nom}\n🏅 Rang : #pos + 1📊 Score :{classement[pos][1]} pts`);

      case "top":
        const sorted = Object.entries(data[threadID]).sort((a, b) => b[1] - a[1]);
        if (!sorted.length) return message.reply("📭 Aucun score enregistré.");
        const tableau = sorted.map(([n, s], i) => `#i + 1️⃣{n} — s pts`).join("");
        return message.reply(`🏆 Classement du groupe :{tableau}`);
        default:
        return message.reply(`📘 Commandes disponibles :
- prefixscore add [nom] [points] (admin)
-{prefix}score set [nom] [points] (admin)
- prefixscore position [nom]
-{prefix}score top`);
    }
  }
};
