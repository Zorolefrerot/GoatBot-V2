
const fs = require("fs");
const dbPath = __dirname + "/rangData.json";

module.exports = {
  config: {
    name: "rang",
    version: "1.1",
    author: "MerdiMadimba",
    description: {
      fr: "Classement des joueurs avec scores et rangs"
    },
    usage: "{prefix}rang add/set/position/top",
    commandCategory: "groupe",
    cooldowns: 2
  },

  onStart: async function ({ message, event, args, prefix }) {
    const ADMIN_ID = "100065927401614"; // ← remplace par ton UID
    const threadID = event.threadID;
    const senderID = event.senderID;

    if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}));
    const data = JSON.parse(fs.readFileSync(dbPath));
    if (!data[threadID]) data[threadID] = {};

    const cmd = args[0];
    const nom = args[1];
    const valeur = parseInt(args[2]);

    if (["add", "set"].includes(cmd) && senderID !== ADMIN_ID)
      return message.reply("⛔ Seul l’administrateur du bot peut modifier les scores.");

    switch (cmd) {
      case "add":
        if (!nom || isNaN(valeur)) return message.reply(`❗ prefixrang add [nom] [score]`);
        data[threadID][nom] = (data[threadID][nom] || 0) + valeur;
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
        return message.reply(`✅{nom} a maintenant data[threadID][nom] pts.`);

      case "set":
        if (!nom || isNaN(valeur)) return message.reply(`❗{prefix}rang set [nom] [score]`);
        data[threadID][nom] = valeur;
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
        return message.reply(`✅ Score de nom mis à jour à{valeur} pts.`);

      case "position":
        if (!nom) return message.reply(`❗ prefixrang position [nom]`);
        const classement = Object.entries(data[threadID]).sort((a, b) => b[1] - a[1]);
        const pos = classement.findIndex(([n]) => n.toLowerCase() === nom.toLowerCase());
        if (pos === -1) return message.reply(`🔍{nom} n’est pas encore enregistré.`);
        return message.reply(
          `📌 Joueur : nom🏅 Rang : #{pos + 1}\n📊 Score : ${classement[pos][1]} pts`
        );

      case "top":
        const sorted = Object.entries(data[threadID]).sort((a, b) => b[1] - a[1]);
        if (sorted.length === 0) return message.reply("📭 Aucun joueur enregistré.");
        `#{i + 1}️⃣  n —{s} pts`).join("\n");
        return message.reply(`🏆 Classement du groupe :\n\nlist`);

      default:
        return message.reply(`📚 Commandes :
-{prefix}rang add [nom] [score] (admin)
- prefixrang set [nom] [score] (admin)
-{prefix}rang position [nom]
- ${prefix}rang top`);
    }
  }
};.
