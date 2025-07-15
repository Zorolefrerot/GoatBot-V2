
const fs = require('fs');
const path = require('path');

// Charger les données de conversation depuis sim.json
const simDataPath = path.join(__dirname, 'others', 'sim.json');
let simData = {};
try {
  simData = JSON.parse(fs.readFileSync(simDataPath, 'utf8'));
} catch (error) {
  console.error('Erreur lors du chargement de sim.json:', error);
}

module.exports = {
  config: {
    name: "idrem",
    version: "1.0.0",
    author: "Merdi Madimba",
    countDown: 5,
    role: 2, // Seul l'administrateur peut utiliser
    shortDescription: "Active/désactive le bot conversationnel",
    longDescription: "Commande pour activer ou désactiver le bot conversationnel automatique",
    category: "admin",
    guide: {
      fr: "{pn} on | off - Active ou désactive le bot conversationnel"
    }
  },

  langs: {
    fr: {
      turnedOn: "✅ Bot conversationnel activé ! Je vais maintenant participer aux conversations.",
      turnedOff: "❌ Bot conversationnel désactivé.",
      onlyAdmin: "❌ Seul l'administrateur peut utiliser cette commande.",
      invalidOption: "❌ Utilisez 'on' ou 'off' seulement."
    }
  },

  onStart: async function({ args, threadsData, message, event, getLang, role }) {
    // Vérifier si l'utilisateur est administrateur
    if (role < 2) {
      return message.reply(getLang("onlyAdmin"));
    }

    const option = args[0];
    
    if (option === "on") {
      await threadsData.set(event.threadID, true, "settings.idremActive");
      return message.reply(getLang("turnedOn"));
    } 
    else if (option === "off") {
      await threadsData.set(event.threadID, false, "settings.idremActive");
      return message.reply(getLang("turnedOff"));
    } 
    else {
      return message.reply(getLang("invalidOption"));
    }
  },

  onChat: async function({ api, event, threadsData, usersData }) {
    const isActive = await threadsData.get(event.threadID, "settings.idremActive");
    
    if (!isActive || !event.body || event.senderID === api.getCurrentUserID()) {
      return;
    }

    // Éviter de répondre aux commandes (messages commençant par des préfixes courants)
    if (event.body.startsWith('/') || event.body.startsWith('!') || event.body.startsWith('.')) {
      return;
    }

    // Probabilité de réponse (70% pour rendre les conversations plus naturelles)
    if (Math.random() > 0.7) {
      return;
    }

    try {
      const userMessage = event.body.toLowerCase().trim();
      let response = await getResponseFromSim(userMessage);
      
      if (response) {
        // Ajouter des variations dans les réponses pour plus de naturel
        const variations = [
          "",
          "😊 ",
          "🤔 ",
          "😄 ",
          "👍 "
        ];
        
        const randomVariation = variations[Math.floor(Math.random() * variations.length)];
        response = randomVariation + response;
        
        // Délai aléatoire pour simuler la réflexion (1-3 secondes)
        setTimeout(() => {
          api.sendMessage(response, event.threadID);
        }, Math.random() * 2000 + 1000);
      }
    } catch (error) {
      console.error("Erreur dans idrem onChat:", error);
    }
  }
};

// Fonction pour obtenir une réponse depuis les données sim
async function getResponseFromSim(userMessage) {
  // Normaliser le message
  const normalizedMessage = userMessage.toLowerCase().trim();
  
  // Chercher une correspondance exacte
  if (simData[normalizedMessage] && simData[normalizedMessage].length > 0) {
    const responses = simData[normalizedMessage];
    const validResponses = responses.filter(r => r !== null && r !== undefined && r !== "undefined");
    
    if (validResponses.length > 0) {
      return validResponses[Math.floor(Math.random() * validResponses.length)];
    }
  }
  
  // Chercher des correspondances partielles (mots-clés)
  const keywords = [
    { words: ["salut", "hello", "hi", "bonjour", "bonsoir"], responses: ["Salut ! 👋", "Hello ! 😊", "Bonjour ! ☀️", "Bonsoir ! 🌙"] },
    { words: ["ça va", "comment ça va", "comment vas-tu"], responses: ["Ça va bien merci ! Et toi ? 😊", "Super bien ! 👍", "Ça roule ! 🚀"] },
    { words: ["merci", "thank you"], responses: ["De rien ! 😊", "Avec plaisir ! 👍", "Pas de problème ! 🙂"] },
    { words: ["oui", "yes"], responses: ["D'accord ! 👍", "Parfait ! ✨", "Super ! 🎉"] },
    { words: ["non", "no"], responses: ["Ah d'accord 🤔", "Je comprends 👌", "Pas de souci ! 😊"] },
    { words: ["drôle", "mdr", "lol", "haha"], responses: ["😂😂😂", "Ah tu me fais rire ! 😄", "Haha ! 🤣"] },
    { words: ["amour", "love"], responses: ["L'amour c'est beau ! 💕", "Aww ! 💖", "C'est mignon ! 💝"] },
    { words: ["triste", "sad"], responses: ["Courage ! 💪", "Ça va aller ! 🤗", "Je suis là pour toi ! 💙"] },
    { words: ["cool", "génial", "super"], responses: ["Trop cool ! 😎", "Génial ! 🎉", "Super ! ✨"] },
    { words: ["bonne nuit", "bonne soirée"], responses: ["Bonne nuit ! 🌙", "Dors bien ! 😴", "À demain ! 👋"] },
    { words: ["au revoir", "bye", "salut"], responses: ["Au revoir ! 👋", "À bientôt ! 🙂", "Bye ! 😊"] }
  ];
  
  for (const keywordGroup of keywords) {
    for (const keyword of keywordGroup.words) {
      if (normalizedMessage.includes(keyword)) {
        return keywordGroup.responses[Math.floor(Math.random() * keywordGroup.responses.length)];
      }
    }
  }
  
  // Réponses par défaut si aucune correspondance
  const defaultResponses = [
    "Intéressant ! 🤔",
    "Ah d'accord ! 👍",
    "Je vois ! 😊",
    "Hmm... 🤨",
    "Raconte-moi en plus ! 😄",
    "C'est cool ! 😎",
    "Ah bon ? 😮",
    "Je comprends ! 👌"
  ];
  
  // 30% de chance d'avoir une réponse par défaut
  if (Math.random() < 0.3) {
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }
  
  return null;
}
