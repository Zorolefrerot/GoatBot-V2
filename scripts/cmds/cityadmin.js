module.exports = {
  config: {
    name: "cityadmin",
    version: "1.0",
    author: "Merdi Madimba",
    description: "Permet à l'admin de supprimer les notifications ou une ville entière via l'UID du créateur.",
    usage: "/cityadmin notif <uid> ou /cityadmin delete <uid>",
    cooldown: 5
  },

  async onCall({ message, args }) {
    const fs = require("fs");
    const path = __dirname + "/city.json";

    // Vérification admin
    if (message.senderID !== global.GoatBot.config.ADMIN_UID) {
      return message.reply("❌ | Cette commande est réservée à l'administrateur du bot.");
    }

    // Vérification des arguments
    if (args.length !== 2 || !["notif", "delete"].includes(args[0])) {
      return message.reply("❌ | Utilisation : /cityadmin notif <uid> ou /cityadmin delete <uid>");
    }

    const [action, uid] = args;

    // Chargement du fichier
    if (!fs.existsSync(path)) {
      return message.reply("❌ | Le fichier city.json est introuvable.");
    }

    let data = JSON.parse(fs.readFileSync(path, "utf-8"));
    let modified = false;

    for (const cityName in data) {
      const city = data[cityName];

      if (city.owner === uid) {
        if (action === "notif") {
          city.notifications = [];
          modified = true;
        }

        if (action === "delete") {
          delete data[cityName];
          modified = true;
        }
      }
    }

    if (!modified) {
      return message.reply(`❌ | Aucune ville trouvée avec l'UID : ${uid}`);
    }

    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    return message.reply(`✅ | ${action === "notif" ? "Notifications effacées" : "Ville supprimée"} pour l'UID : ${uid}`);
  }
};
