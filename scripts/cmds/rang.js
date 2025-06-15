
const fs = require("fs");
const path = __dirname + "/rangData.json";

module.exports = {
  config: {
    name: "rang",
    version: "1.0",
    author: "Merdi Madimba",
    description: {
      fr: "Classement de scores (admin modifie, tous consultent)",
      en: "Scoreboard (admin edit, all consult)"
    },
    usage: "{prefix}rang add/set/top/position",
    commandCategory: "group",
    cooldowns: 2
  },

  onStart: async function ({ message, event, args, prefix }) {
    const ADMIN_ID = "1000XXXXXXXXXX"; // ← Mets ton UID Facebook ici
    const threadID = event.threadID;
    const senderID = event.senderID;

    if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));
    const data = JSON.parse(fs.readFileSync(path));
    if (!data[threadID]) data[threadID] = {};

    const cmd = args[0];
    const name = args[1];
    const value = parseInt(args[2]);

    if (["add", "set"].includes(cmd) && senderID !== ADMIN_ID)
      return message.reply("⛔ Seul l’administrateur du bot peut modifier les scores.");

    switch (cmd) {
      case "add":if (!name || isNaN(value)) return message.reply(`❗ Utilisation : prefixrang add [nom] [score]`);
        data[threadID][name] = (data[threadID][name] || 0) + value;
        break;

      case "set":
        if (!name || isNaN(value)) return message.reply(`❗ Utilisation :{prefix}rang set [nom] [score]`);
        data[threadID][name] = value;
        break;

      case "position":
        if (!name) return message.reply(`❗ Utilisation : prefixrang position [nom]`);
        const classement = Object.entries(data[threadID]).sort((a, b) => b[1] - a[1]);
        const pos = classement.findIndex(([n]) => n.toLowerCase() === name.toLowerCase());
        if (pos === -1) return message.reply(`🔍{name} n’est pas encore enregistré.`);
        return message.reply(`📌 Position de name :🏅 Rang : #{pos + 1}\n📊 Score : classement[pos][1] pts`);

      case "top":
        const sorted = Object.entries(data[threadID]).sort((a, b) => b[1] - a[1]);
        if (sorted.length === 0) return message.reply("📭 Aucun joueur encore enregistré.");
        const list = sorted.map(([n, s], i) =>
          `#{i + 1}️⃣  n —{s} pts`).join("\n");
        return message.reply("🏆 Classement du groupe :\n\n" + list);

      default:
        return message.reply(`📚 Commandes disponibles :- prefixrang add [nom] [score] (admin)
-{prefix}rang set [nom] [score] (admin)
- prefixrang position [nom]
-{prefix}rang top`);
    }

    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    message.reply("✅ Score mis à jour.");
  }
};
 
