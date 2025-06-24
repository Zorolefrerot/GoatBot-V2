const fs = require("fs-extra");
const path = require("path");

const FILE_PATH = path.join(__dirname, "../../storage/horloge_reminders.json");

module.exports = {
  config: {
    name: "listealarme",
    aliases: ["reminders"],
    version: "1.0",
    author: "Merdi Madimba",
    role: 2, // ⛔️ Seul l'administrateur du bot peut l'utiliser
    description: "Affiche tous les rappels programmés",
    category: "utilitaire",
    guide: {
      fr: "!listealarme : liste tous les rappels"
    }
  },

  onStart: async function ({ message }) {
    if (!fs.existsSync(FILE_PATH)) {
      return message.reply("❌ Aucun rappel n’a encore été enregistré.");
    }

    const data = JSON.parse(fs.readFileSync(FILE_PATH));

    if (data.length === 0) {
      return message.reply("📭 Aucun rappel programmé pour l’instant.");
    }

    let replyText = "📋 **Liste des rappels enregistrés :**\n\n";
    data.forEach((item, index) => {
      const targetTime = new Date(item.time).toISOString().slice(11, 16);
      const date = new Date(item.time).toISOString().slice(0, 10);
      replyText += `🔹 **${index + 1}.**\n👤 ${item.userName} (${item.userID})\n📅 ${date} à ${targetTime} (GMT)\n📝 ${item.reminder}\n\n`;
    });

    return message.reply(replyText);
  }
};
