const axios = require('axios');

const Prefixes = [
  '/ai',
  'strift',
  'meryl',
  'madimba',
  'merdi',
  'ai',
  'ask',
];

module.exports = {
  config: {
    name: "ask",
    version: 2.0,
    author: "Merdi Madimba",
    longDescription: "AI avec informations en temps réel",
    category: "ai",
    guide: {
      en: "{p} questions",
    },
  },
  onStart: async function () {},
  onChat: async function ({ api, event, args, message }) {
    try {
      const prefix = Prefixes.find((p) => event.body && event.body.toLowerCase().startsWith(p));
      if (!prefix) {
        return;
      }
      
      const prompt = event.body.substring(prefix.length).trim();
      if (!prompt) {
        await message.reply("[🎯𝗠𝗘𝗥𝗬𝗟 𝗔𝗜🎯]\n 𝘘𝘜𝘌𝘓𝘓𝘌 𝘌𝘚𝘛 𝘝𝘖𝘛𝘙𝘌 𝘘𝘜𝘌𝘚𝘛𝘐𝘖𝘕 ?");
        return;
      }

      // Obtenir la date et l'heure actuelle
      const now = new Date();
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Africa/Kinshasa'
      };
      const dateHeure = now.toLocaleDateString('fr-FR', options);

      // Vérifier si la question concerne le créateur
      const questionCreateur = prompt.toLowerCase();
      if (questionCreateur.includes('créateur') || questionCreateur.includes('createur') || 
          questionCreateur.includes('qui t\'a créé') || questionCreateur.includes('qui t\'a cree') ||
          questionCreateur.includes('ton créateur') || questionCreateur.includes('ton createur') ||
          questionCreateur.includes('qui est ton créateur') || questionCreateur.includes('qui t a créé')) {
        await message.reply("🌟 Mon créateur est Merdi Madimba, un jeune congolais très talentueux ! 🇨🇩✨");
        return;
      }

      // Construire la question avec contexte
      const questionAvecContexte = `Date et heure actuelles: ${dateHeure}. Question: ${prompt}`;

      // Appel à l'API gratuite
      const response = await axios.get(`https://free-unoficial-gpt4o-mini-api-g70n.onrender.com/chat/?query=${encodeURIComponent(questionAvecContexte)}`, {
        headers: { 'Accept': 'application/json' },
        timeout: 30000
      });

      let answer = response.data.response || response.data.answer || response.data.message || "Désolé, je n'ai pas pu obtenir de réponse.";
      
      await message.reply(`[𝗠𝗘𝗥𝗬𝗟💎]\n\n${answer}\n\n📅 ${dateHeure}`);

    } catch (error) {
      console.error("Error:", error.message);
      
      // Fallback vers une autre API si la première échoue
      try {
        const fallbackResponse = await axios.get(`https://api.popcat.xyz/chatbot?msg=${encodeURIComponent(prompt)}&owner=Merdi+Madimba&botname=AE-sther`, {
          timeout: 15000
        });
        
        const answer = fallbackResponse.data.response || "Désolé, je ne peux pas répondre pour le moment.";
        await message.reply(`[𝗠𝗘𝗥𝗬𝗟💎]\n\n${answer}`);
      } catch (fallbackError) {
        console.error("Fallback Error:", fallbackError.message);
        await message.reply("❌ Désolé, je ne peux pas répondre pour le moment. Veuillez réessayer dans quelques instants.");
      }
    }
  }
};
