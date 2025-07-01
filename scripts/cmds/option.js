const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "option",
    version: "1.0",
    author: "Merdi Madimba",
    role: 0,
    shortDescription: "📚 Voir les commandes disponibles",
    longDescription: "Affiche toutes les commandes du bot regroupées par catégories avec emoji",
    category: "📖 Menu",
    guide: {
      fr: "{p}option"
    }
  },

  onStart: async function ({ message }) {
    const cmdsPath = path.join(__dirname); // dossier actuel
    const files = fs.readdirSync(cmdsPath).filter(f => f.endsWith(".js"));

    const categories = {};

    for (const file of files) {
      const filePath = path.join(cmdsPath, file);
      const cmd = require(filePath);
      if (!cmd.config) continue;
      const cat = cmd.config.category || "📦 Autres";
      const name = cmd.config.name || "inconnu";

      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(name);
    }

    // Formater l’affichage
    let result = "🧾 𝗟𝗜𝗦𝗧𝗘 𝗗𝗘𝗦 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗘𝗦 𝗗𝗨 𝗕𝗢𝗧\n\n";

    let total = 0;
    for (const cat in categories) {
      result += `📂 *${cat.toUpperCase()}*\n`;
      for (const cmdName of categories[cat]) {
        result += `🔹 ${cmdName}\n`;
        total++;
      }
      result += "\n";
    }

    result += `━━━━━━━━━━━━━━\n`;
    result += `📌 Total des commandes : ${total}\n👑 Créateur : Merdi Madimba`;

    message.reply(result);
  }
};
