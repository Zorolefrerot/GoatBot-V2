const fs = require("fs-extra");
const path = require("path");

const FILE_PATH = path.join(__dirname, "../../storage/horloge_reminders.json");

module.exports = {
  config: {
    name: "horloge",
    version: "2.2",
    author: "Merdi Madimba",
    role: 0,
    description: "Créer un rappel à une heure précise (GMT)",
    category: "utilitaire",
    guide: {
      fr: "!horloge 20:00 aller au travail"
    }
  },

  onStart: async function ({ message, event, args, api }) {
    if (args.length < 2)
      return message.reply("❌ Format invalide.\n\n✅ Exemple : `!horloge 20:00 aller au travail`");

    const timeArg = args[0];
    const regex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!regex.test(timeArg)) return message.reply("⏰ Heure invalide. Format : HH:MM (ex: 18:30)");

    const [hour, minute] = timeArg.split(":").map(Number);
    const now = new Date();
    const targetTime = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      hour,
      minute,
      0
    ));

    if (targetTime <= now) targetTime.setUTCDate(targetTime.getUTCDate() + 1);

    const reminderText = args.slice(1).join(" ");
    const userID = event.senderID;
    const threadID = event.threadID;

    // ✅ Obtenir le nom de l'utilisateur via l'API
    const userInfo = await api.getUserInfo(userID);
    const userName = userInfo[userID]?.name || `UID: ${userID}`;

    const newReminder = {
      userID,
      userName,
      threadID,
      reminder: reminderText,
      time: targetTime.getTime()
    };

    let data = [];
    if (fs.existsSync(FILE_PATH)) {
      data = JSON.parse(fs.readFileSync(FILE_PATH));
    }

    data.push(newReminder);
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));

    return message.reply(`✅ Rappel enregistré pour **${timeArg} GMT** : "${reminderText}"`);
  },

  onLoad: async ({ api }) => {
    setInterval(() => {
      const now = Date.now();
      if (!fs.existsSync(FILE_PATH)) return;

      const data = JSON.parse(fs.readFileSync(FILE_PATH));
      const keep = [];

      for (const reminder of data) {
        if (now >= reminder.time) {
          const date = new Date(reminder.time);
          const hour = String(date.getUTCHours()).padStart(2, "0");
          const minute = String(date.getUTCMinutes()).padStart(2, "0");

          const msg = `⏰ **Rappel automatique !**\n\n📝 ${reminder.reminder}\n👤 ${reminder.userName} (${reminder.userID})\n🕒 Heure programmée : ${hour}:${minute} GMT`;

          api.sendMessage(msg, reminder.threadID);
        } else {
          keep.push(reminder);
        }
      }

      fs.writeFileSync(FILE_PATH, JSON.stringify(keep, null, 2));
    }, 60 * 1000); // Vérifie chaque minute
  }
};
