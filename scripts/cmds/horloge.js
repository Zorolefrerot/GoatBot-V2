const fs = require("fs-extra");
const path = require("path");

const FILE_PATH = path.join(__dirname, "../../storage/horloge_reminders.json");

module.exports = {
  config: {
    name: "horloge",
    aliases: [],
    version: "1.0",
    author: "Merdi Madimba",
    role: 0,
    description: "Créer un rappel programmé pour une heure spécifique",
    category: "utilitaire",
    guide: {
      fr: "Utilisation : !horloge 20H00 [message de rappel]",
    }
  },

  onStart: async function ({ args, message, event, usersData, threadsData, role }) {
    const timeRegex = /^(\d{1,2})h(\d{2})$/i;
    const input = args.join(" ");
    const match = input.match(/^(\d{1,2}h\d{2})\s*(.+)$/i);

    if (!match) return message.reply("❌ Format invalide.\nExemple correct : `!horloge 18H00 [aller au rendez-vous]`");

    const [_, hourText, reminder] = match;
    const [hour, minute] = hourText.toLowerCase().split("h").map(Number);

    if (hour > 23 || minute > 59)
      return message.reply("❌ L’heure est invalide.");

    const now = new Date();
    const targetTime = new Date();
    targetTime.setUTCHours(hour);
    targetTime.setUTCMinutes(minute);
    targetTime.setUTCSeconds(0);
    targetTime.setUTCMilliseconds(0);

    const isTomorrow = targetTime <= now;
    if (isTomorrow) targetTime.setUTCDate(now.getUTCDate() + 1);

    // Chargement et écriture
    let data = [];
    if (fs.existsSync(FILE_PATH)) {
      data = JSON.parse(fs.readFileSync(FILE_PATH));
    }

    data.push({
      threadID: event.threadID,
      userID: event.senderID,
      userName: await usersData.getName(event.senderID),
      time: targetTime.toISOString(),
      createdAt: now.toISOString(),
      reminder
    });

    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
    return message.reply(`⏰ Rappel programmé pour **${hour.toString().padStart(2, '0')}H${minute.toString().padStart(2, '0')}** (GMT).\n📌 Message : "${reminder}"`);
  },

  onLoad: async function () {
    if (!fs.existsSync(FILE_PATH)) {
      fs.ensureFileSync(FILE_PATH);
      fs.writeFileSync(FILE_PATH, "[]");
    }

    setInterval(() => {
      let data = JSON.parse(fs.readFileSync(FILE_PATH));
      const now = new Date();

      const toSend = data.filter(item => {
        const target = new Date(item.time);
        return target.getUTCHours() === now.getUTCHours() &&
               target.getUTCMinutes() === now.getUTCMinutes() &&
               target.getUTCDate() === now.getUTCDate() &&
               target.getUTCMonth() === now.getUTCMonth() &&
               target.getUTCFullYear() === now.getUTCFullYear();
      });

      data = data.filter(item => {
        const target = new Date(item.time);
        return target > now;
      });

      fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));

      for (const reminder of toSend) {
        const timeCreated = new Date(reminder.createdAt).toISOString().slice(11, 16);
        const timeNow = now.toISOString().slice(11, 16);
        global.GoatBot.api.sendMessage(
          `🔔 **Rappel !**\n👤 Utilisateur : ${reminder.userName} (${reminder.userID})\n🕰️ Rappel mis à : ${timeCreated} (GMT)\n⏱️ Heure actuelle : ${timeNow} (GMT)\n📨 Message : ${reminder.reminder}`,
          reminder.threadID
        );
      }
    }, 60 * 1000); // vérifie toutes les minutes
  }
};
