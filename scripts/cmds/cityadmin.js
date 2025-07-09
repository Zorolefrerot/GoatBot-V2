module.exports = {
  config: {
    name: "cityadmin",
    version: "1.0",
    author: "Merdi Madimba",
    role: 2, // seul admin du bot
    shortDescription: "Supprimer une ville ou ses notifications",
    longDescription: "Permet à l’administrateur de supprimer une ville ou ses notifications avec l’UID du créateur.",
    category: "city",
    guide: {
      fr: "/cityadmin clear <uid>\n/cityadmin delete <uid>"
    }
  },

  onStart: async function ({ message, event, args }) {
    const fs = require("fs");
    const path = __dirname + "/city-data.js";

    if (!fs.existsSync(path)) {
      return message.reply("📦 Aucun fichier de données 'city-data.js' trouvé.");
    }

    const data = JSON.parse(fs.readFileSync(path, "utf-8"));

    const action = args[0];
    const targetUID = args[1];

    if (!["clear", "delete"].includes(action) || !targetUID) {
      return message.reply("❌ Utilisation incorrecte.\n\nExemples :\n/cityadmin clear 1000000000000\n/cityadmin delete 1000000000000");
    }

    let modified = false;

    if (action === "clear") {
      for (const cityName in data) {
        if (data[cityName].uid == targetUID) {
          data[cityName].notifications = [];
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(path, JSON.stringify(data, null, 2), "utf-8");
        return message.reply(`✅ Notifications effacées pour toutes les villes de l'UID ${targetUID}`);
      } else {
        return message.reply("⚠️ Aucune ville trouvée pour cet UID.");
      }

    } else if (action === "delete") {
      let count = 0;
      for (const cityName in data) {
        if (data[cityName].uid == targetUID) {
          delete data[cityName];
          count++;
        }
      }

      if (count > 0) {
        fs.writeFileSync(path, JSON.stringify(data, null, 2), "utf-8");
        return message.reply(`✅ ${count} ville(s) supprimée(s) appartenant à l'UID ${targetUID}`);
      } else {
        return message.reply("⚠️ Aucune ville trouvée pour cet UID.");
      }
    }
  }
};
