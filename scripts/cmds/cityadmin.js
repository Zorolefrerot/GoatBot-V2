const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "cityadmin",
    version: "1.1",
    author: "Merdi Madimba",
    role: 2, // seul admin
    shortDescription: "Supprimer une ville ou ses notifications",
    longDescription: "Permet à l’administrateur de supprimer une ville ou d'effacer les notifications avec l’UID.",
    category: "admin",
    guide: "{pn} delete [uid]\n{pn} clearNotif [uid]"
  },

  onStart: async function ({ args, api, event }) {
    const { threadID, messageID } = event;
    const subCommand = args[0];
    const uid = args[1];

    if (!subCommand || !uid) {
      return api.sendMessage("❌ Utilisation :\n- !cityadmin delete [uid]\n- !cityadmin clearNotif [uid]", threadID, messageID);
    }

    const dataPath = path.join(__dirname, "city-data.js");
    let cityData;

    try {
      delete require.cache[require.resolve("./city-data.js")];
      cityData = require("./city-data.js");
    } catch (e) {
      return api.sendMessage("❌ Erreur lors du chargement de city-data.js", threadID, messageID);
    }

    if (!cityData.cities[uid]) {
      return api.sendMessage(`❌ Aucune ville trouvée pour l'UID ${uid}`, threadID, messageID);
    }

    if (subCommand === "delete") {
      const name = cityData.cities[uid].name;
      delete cityData.cities[uid];

      const newContent = `module.exports = ${JSON.stringify(cityData, null, 2)}\n`;
      fs.writeFileSync(dataPath, newContent, "utf-8");

      return api.sendMessage(`✅ La ville "${name}" (UID: ${uid}) a été supprimée.`, threadID, messageID);
    }

    if (subCommand === "clearNotif") {
      cityData.cities[uid].notif = [];

      const newContent = `module.exports = ${JSON.stringify(cityData, null, 2)}\n`;
      fs.writeFileSync(dataPath, newContent, "utf-8");

      return api.sendMessage(`✅ Notifications de la ville "${cityData.cities[uid].name}" (UID: ${uid}) supprimées.`, threadID, messageID);
    }

    return api.sendMessage("❌ Sous-commande invalide. Utilisez delete ou clearNotif.", threadID, messageID);
  }
};
