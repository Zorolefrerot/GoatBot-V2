module.exports = {
  config: {
    name: "bye",
    version: "1.0",
    author: "Bryan Bulakali & Merdi Madimba",
    role: 2, // Admin du bot uniquement
    shortDescription: "Le bot quitte le groupe",
    longDescription: "Le bot envoie un message d’au revoir avant de quitter automatiquement le groupe",
    category: "admin",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    const farewellMessages = [
      "C'était un plaisir d’être ici, à la prochaine ! 👋",
      "Je quitte le navire. Bonne chance à tous ! ⚓",
      "Mission terminée. À bientôt ! 🫡",
      "Le bot s’en va, mais n'oubliez pas de boire de l’eau 💧",
      "Tchao tchao les amis, prenez soin de vous 😎"
    ];

    const randomMsg = farewellMessages[Math.floor(Math.random() * farewellMessages.length)];

    try {
      await api.sendMessage(randomMsg, event.threadID);
      await api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
    } catch (error) {
      api.sendMessage("❌ Impossible de quitter le groupe. Vérifiez que le bot a les permissions.", event.threadID);
    }
  }
};
