 const fs = require("fs");
const path = require("path");

// Chemin vers le fichier JSON dans le dossier "data"
const dataDir = path.join(__dirname, "data");
const filePath = path.join(dataDir, "leaderboard.json");

module.exports = {
  config: {
    name: "leaderboard",
    version: "2.0",
    author: "Merdi Madimba",
    shortDescription: "Gère un tableau de scores",
    longDescription: "Ajoute, modifie ou affiche les scores des utilisateurs dans un leaderboard",
    category: "📊 Utilitaire",
    guide: {
      en: "{p}leaderboard\n{p}leaderboard add <nom> <points>\n{p}leaderboard set <nom> <nouveaux_points>"
    }
  },

  onStart: async function ({ message, args, event }) {
    const senderID = event.senderID;
    const adminID = "100065927401614"; // Remplace ici si tu veux restreindre les modifications

    // Création du dossier s’il n'existe pas
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

    // Lecture ou initialisation du fichier JSON
    let data = {};
    if (fs.existsSync(filePath)) {
      data = JSON.parse(fs.readFileSync(filePath));
    }

    const [action, name, point] = args;

    if (!action) {
      // Affichage du leaderboard trié
      if (Object.keys(data).length === 0) return message.reply("📭 Aucun score enregistré pour le moment.");

      const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
      let msg = "🏆 | 𝗧𝗔𝗕𝗟𝗘𝗔𝗨 𝗗𝗘 𝗦𝗖𝗢𝗥𝗘\n\n";
      sorted.forEach(([nom, score], i) => {
        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🎯";
        msg += `${medal} ${nom}: ${score} pts\n`;
      });
      return message.reply(msg);
    }

    if (senderID !== adminID) {
      return message.reply("❌ Tu n'es pas autorisé à modifier le tableau de score.");
    }

    if (action === "add") {
      if (!name || isNaN(point)) return message.reply("⚠️ Utilisation: leaderboard add <nom> <points>");
      data[name] = (data[name] || 0) + parseInt(point);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return message.reply(`✅ ${name} a été ajouté avec ${point} points.`);
    }

    if (action === "set") {
      if (!name || isNaN(point)) return message.reply("⚠️ Utilisation: leaderboard set <nom> <nouveaux_points>");
      data[name] = parseInt(point);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return message.reply(`✏️ Points de ${name} modifiés à ${point}.`);
    }

    return message.reply("❓ Action inconnue.");
  }
};
