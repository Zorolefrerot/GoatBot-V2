const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "cmddelete",
    aliases: ["del", "cmddel"],
    version: "1.0",
    author: "Bryan Bulakali",
    role: 2, // réservé aux admins bot
    shortDescription: "Supprime une commande du bot",
    longDescription: "Permet de supprimer une commande installée à distance",
    category: "admin",
    guide: "{p}cmd delete [nomCommande]"
  },

  onStart: async function ({ message, args, event }) {
    const cmdName = args[0];
    if (!cmdName) return message.reply("❌ Merci de spécifier le nom de la commande à supprimer.\nEx: !cmd delete wanted");

    const cmdPath = path.join(__dirname, `${cmdName}.js`);
    
    // Vérifie si le fichier existe
    if (!fs.existsSync(cmdPath)) {
      return message.reply(`❌ La commande "${cmdName}" n'existe pas ou n'est pas installée.`);
    }

    try {
      fs.unlinkSync(cmdPath);
      message.reply(`✅ La commande "${cmdName}" a bien été supprimée.`);
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
      message.reply("❌ Une erreur est survenue lors de la suppression de la commande.");
    }
  }
};
