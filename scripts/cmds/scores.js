
const fs = require("fs");
const path = __dirname + "/scoreData.json";

module.exports = {
  config: {
    name: "scores",
    version: "1.0",
    author: "Merdi Madimba",
    description: {
      fr: "Tableau de score des membres (admin gère)"
    },
    usage: "{prefix}score add/set/list",
    commandCategory: "groupe",
    cooldowns: 2
  },

  onStart: async function ({ message, event, args, prefix }) {
    const ADMIN_ID = "100065927401614"; // Remplace par ton UID Facebook
    const threadID = event.threadID;
    const senderID = event.senderID;

    if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));
    const data = JSON.parse(fs.readFileSync(path));
    if (!data[threadID]) data[threadID] = {};

    const cmd = args[0];
    const nom = args[1];
    const points = parseInt(args[2]);

    if (["add", "set"].includes(cmd) && senderID !== ADMIN_ID)
      return message.reply("🚫 Seul l'administrateur peut modifier les scores.");

    switch (cmd) {
      case "add":
if (!nom || isNaN(points)) return message.reply(`❗ prefixscore add [nom] [points]`);
        data[threadID][nom] = (data[threadID][nom] || 0) + points;
        fs.writeFileSync(path, JSON.stringify(data, null, 2));
        return message.reply(`✅{points} pts ajoutés à nom ! Total:{data[threadID][nom]} pts`);

      case "set":
        if (!nom || isNaN(points)) return message.reply(`❗ prefixscore set [nom] [points]`);
        data[threadID][nom] = points;
        fs.writeFileSync(path, JSON.stringify(data, null, 2));
        return message.reply(`🔧 Score de{nom} modifié à points pts`);

      case "list":
        const classement = Object.entries(data[threadID]).sort((a, b) => b[1] - a[1]);
        if (!classement.length) return message.reply("📭 Aucun score enregistré.");
        const affichage = classement.map(
          ([n, s], i) => `#{i + 1}️⃣ n —{s} pts`
        ).join("\n");
        return message.reply(`🏆 Tableau de score du groupe :\n\naffichage`);
      
      default:
        return message.reply(`📘 Commandes :
-{prefix}score add [nom] [pts] (admin)
- prefixscore set [nom] [pts] (admin)
-{prefix}score list (visible par tous)`);
    }
  }
};
