const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../data/leaderboard.json");

module.exports = {
  config: {
    name: "leaderboard",
    version: "1.2",
    author: "Merdi Madimba",
    role: 0,
    shortDescription: "Affiche ou modifie les scores des joueurs",
    longDescription: "Utilisé pour afficher le classement ou modifier les points (admin uniquement)",
    category: "📊 Utilitaire",
    guide: {
      en: "{p}leaderboard\n{p}leaderboard add <nom> <points>\n{p}leaderboard set <nom> <nouveaux_points>"
    }
  },

  onStart: async function ({ message, args, event }) {
    const adminID = "100065927401614"; // 🔒 Remplace ceci par TON VRAI ID Facebook

    // Charger ou initialiser le fichier
    let data = {};
    if (fs.existsSync(filePath)) {
      try {
        data = JSON.parse(fs.readFileSync(filePath));
      } catch (e) {
        return message.reply("❌ Erreur en lisant les scores enregistrés.");
      }
    }

    const [action, ...rest] = args;

    // ➤ Affichage du classement
    if (!action) {
      if (Object.keys(data).length === 0) return message.reply("📭 Aucun score enregistré.");
      const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
      let msg = "🏆 | 𝗧𝗔𝗕𝗟𝗘𝗔𝗨 𝗗𝗘 𝗦𝗖𝗢𝗥𝗘\n\n";
      sorted.forEach(([name, points], i) => {
        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🎯";
        msg += `${medal} ${name}: ${points} pts\n`;
      });
      return message.reply(msg);
    }

    // ➤ Vérification admin
    if (event.senderID !== adminID) {
      return message.reply("❌ Tu n'es pas autorisé à modifier les scores.");
    }

    // ➤ Traitement add/set
    const name = rest.slice(0, -1).join(" ");
    const point = parseInt(rest[rest.length - 1]);

    if (!name || isNaN(point)) {
      return message.reply("⚠️ Utilisation : leaderboard add/set <nom> <points>");
    }

    if (action === "add") {
      data[name] = (data[name] || 0) + point;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return message.reply(`✅ ${name} a reçu +${point} points.`);
    }

    if (action === "set") {
      data[name] = point;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return message.reply(`✏️ Les points de ${name} ont été mis à jour à ${point}.`);
    }

    return message.reply("❓ Action inconnue. Utilise : leaderboard, leaderboard add <nom> <points> ou leaderboard set <nom> <points>");
  }
};
