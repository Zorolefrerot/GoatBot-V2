 module.exports = {
  config: {
    name: "gc",
    aliases: [],
    version: "1.0",
    author: "Merdi Madimba",
    countDown: 3,
    role: 0,
    shortDescription: "Envoyer un message dans un autre groupe",
    longDescription: "Utilisé pour envoyer un message personnalisé dans un groupe cible à partir d’un autre groupe",
    category: "group",
    guide: {
      fr: "{pn} [message à envoyer]"
    }
  },

  onStart: async function ({ api, event, args }) {
    // Remplace ici par le TID du groupe où tu veux envoyer les messages
    const TARGET_THREAD_ID = "8020253971328400"; // <<< METS ICI TON VRAI THREAD ID

    const message = args.join(" ");
    if (!message)
      return api.sendMessage("❌ | Tu dois écrire un message à envoyer.\nExemple : !gc Bonjour le groupe cible !", event.threadID, event.messageID);

    try {
      // Envoie dans le groupe cible
      await api.sendMessage(message, TARGET_THREAD_ID);
      api.sendMessage("✅ | Message envoyé dans le groupe cible.", event.threadID, event.messageID);
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ | Une erreur est survenue lors de l'envoi du message.", event.threadID, event.messageID);
    }
  }
};
