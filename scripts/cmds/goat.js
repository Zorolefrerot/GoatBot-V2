const axios = require("axios");

module.exports = {
  config: {
    name: "goat",
    aliases: ["q/"],
    version: "1.1",
    author: "Merdi Madimba",
    description: "Pose une question librement et reçois une réponse intelligente avec RonaldGPT.",
    usage: "Q/ Quelle est la capitale de la France ?",
    category: "🎓 IA",
    role: 0 // tout le monde peut utiliser
  },

  onStart: async function ({ message, args }) {
    const question = args.join(" ");
    if (!question) {
      return message.reply("❗ Pose ta question après la commande.\nExemple : Q/ La capitale de la France ?");
    }

    const apiURL = `https://ronald-api-v1.vercel.app/api/ronald?message=${encodeURIComponent(question)}`;

    try {
      const res = await axios.get(apiURL);
      const answer = res.data?.response;

      if (!answer) {
        return message.reply("❌ Aucune réponse reçue de l’API.");
      }

      return message.reply(` ${answer}`);
    } catch (err) {
      console.error(err);
      return message.reply("❌ Erreur lors de la récupération de la réponse depuis l’API.");
    }
  }
};
