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
        await message.reply("[💎 | 𝗠𝗘𝗥𝗬𝗟]\n 👋𝘚𝘢𝘭𝘶𝘵 𝘮𝘰𝘪 𝘤'𝘦𝘴𝘵 @𝗠𝗲𝗿𝘆𝗹 𝘷𝘰𝘵𝘳𝘦 𝘤𝘩𝘢𝘵𝘣𝘰𝘵😊\n 𝘘𝘶𝘦𝘭𝘭𝘦 𝘦𝘴𝘵 𝘷𝘰𝘵𝘳𝘦 𝘲𝘶𝘦𝘴𝘵𝘪𝘰𝘯⁉️");
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
      const questionAvecContexte = `Date et heure actuelles: ${dateHeure}. Question de l'utilisateur: ${prompt}`;

      // API 1: Llama API via SamirXR
      try {
        const response = await axios.get(`https://api.samirxpikachu.run.place/llama?content=${encodeURIComponent(questionAvecContexte)}`, {
          timeout: 20000
        });

        if (response.data && response.data.response) {
          await message.reply(`[💎 | 𝗠𝗘𝗥𝗬𝗟]\n\n${response.data.response}\n\n📅 ${dateHeure}`);
          return;
        }
      } catch (err) {
        console.log("API 1 failed, trying API 2...");
      }

      // API 2: GPT4 API
      try {
        const response2 = await axios.get(`https://api.kenliejugarap.com/freegpt4o8k/?question=${encodeURIComponent(questionAvecContexte)}`, {
          timeout: 20000
        });

        if (response2.data && response2.data.response) {
          await message.reply(`[💎 | 𝗠𝗘𝗥𝗬𝗟]\n\n${response2.data.response}\n\n📅 ${dateHeure}`);
          return;
        }
      } catch (err) {
        console.log("API 2 failed, trying API 3...");
      }

      // API 3: SimSimi API
      try {
        const response3 = await axios.post('https://simsimi.vn/web/simtalk', 
          `text=${encodeURIComponent(prompt)}&lc=fr`, 
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            timeout: 15000
          }
        );

        if (response3.data && response3.data.success) {
          await message.reply(`[💎 | 𝗠𝗘𝗥𝗬𝗟]\n\n${response3.data.success}\n\n📅 ${dateHeure}`);
          return;
        }
      } catch (err) {
        console.log("API 3 failed, trying API 4...");
      }

      // API 4: Dernière option - AI ChatBot
      try {
        const response4 = await axios.get(`https://hashier-api-chatgpt-v1-0.onrender.com/api/chatgpt?query=${encodeURIComponent(questionAvecContexte)}`, {
          timeout: 20000
        });

        if (response4.data && response4.data.response) {
          await message.reply(`[💎 | 𝗠𝗘𝗥𝗬𝗟]\n\n${response4.data.response}\n\n📅 ${dateHeure}`);
          return;
        }
      } catch (err) {
        console.log("All APIs failed");
      }

      // Si toutes les APIs échouent
      await message.reply("❌ Désolé, je ne peux pas répondre pour le moment. Les services AI sont temporairement indisponibles. Veuillez réessayer dans quelques instants.");

    } catch (error) {
      console.error("Error in ask command:", error.message);
      await message.reply("❌ Une erreur s'est produite. Veuillez réessayer.");
    }
  }
};
