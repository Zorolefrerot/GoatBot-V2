const fs = require("fs");
const path = __dirname + "/leaderboard.json";

module.exports = {
  config: {
    name: "leaderboard",
    version: "1.0",
    author: "Merdi",
    role: 0, // Tous peuvent voir, mais contrôle d'action par ID
    shortDescription: "Affiche ou modifie le tableau de score",
    longDescription: "Permet d'afficher le score des joueurs ou de le modifier (admin uniquement)",
    category: "📊 Utilitaire",
    guide: {
      en: "{p}leaderboard\n{p}leaderboard add <nom> <points>\n{p}leaderboard set <nom> <nouveaux_points>"
    }
  },

  onStart: async function ({ message, args, event }) {
    const adminID = "100065927401614"; // Remplace avec ton ID

    // Charger ou initialiser le fichier JSON
    let data = {};
    if (fs.existsSync(path)) data = JSON.parse(fs.readFileSync(path));
    
    const [action, name, point] = args;

    if (!action) {
      // Affichage du leaderboard
      if (Object.keys(data).length === 0) return message.reply("📭 Aucun score enregistré pour le moment.");

      let sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
      let msg = "🏆 | 𝗧𝗔𝗕𝗟𝗘𝗔𝗨 𝗗𝗘 𝗦𝗖𝗢𝗥𝗘\n\n";
      sorted.forEach(([nom, score], i) => {
        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🎯";
        msg += `${medal} ${nom}: ${score} pts\n`;
      });
      return message.reply(msg);
    }

    if (event.senderID !== adminID) {
      return message.reply("❌ Tu n'es pas autorisé à modifier le tableau de score.");
    }

    if (action === "add") {
      if (!name || isNaN(point)) return message.reply("⚠️ Utilise: leaderboard add <nom> <points>");
      data[name] = (data[name] || 0) + parseInt(point);
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return message.reply(`✅ ${name} a été ajouté avec ${point} points.`);
    }

    if (action === "set") {
      if (!name || isNaN(point)) return message.reply("⚠️ Utilise: leaderboard set <nom> <nouveaux_points>");
      data[name] = parseInt(point);
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return message.reply(`✏️ Points de ${name} modifiés à ${point}.`);
    }

    return message.reply("❓ Commande inconnue.");
  }
};
