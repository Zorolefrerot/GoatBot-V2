const axios = require('axios');

module.exports = {
  config: {
    name: "google",
    aliases: ["search", "g"],
    version: "2.0",
    author: "Merdi Madimba",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Recherche Google avec informations en temps réel"
    },
    longDescription: {
      en: "Effectue des recherches sur Google et retourne les résultats avec des informations en temps réel et des images"
    },
    category: "utility",
    guide: {
      en: "{pn} <terme de recherche>\nExemple: {pn} intelligence artificielle"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const query = args.join(' ');
    
    if (!query) {
      return api.sendMessage("❌ Veuillez fournir un terme de recherche.\nExemple: google intelligence artificielle", event.threadID, event.messageID);
    }

    try {
      // Message de chargement
      let loadingMessage = await api.sendMessage("🔍 Recherche en cours sur Google...", event.threadID);

      // Configuration de l'API Google Custom Search
      const cx = "7514b16a62add47ae";
      const apiKey = "AIzaSyAqBaaYWktE14aDwDE8prVIbCH88zni12E";
      const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=5`;

      const response = await axios.get(searchUrl);
      const searchResults = response.data.items;

      if (!searchResults || searchResults.length === 0) {
        api.unsendMessage(loadingMessage.messageID);
        return api.sendMessage("❌ Aucun résultat trouvé sur Google pour cette recherche.", event.threadID, event.messageID);
      }

      // Construire le message de réponse
      let messageText = `🔍 **Résultats Google pour "${query}"**\n\n`;
      
      // Traitement des 5 premiers résultats
      for (let i = 0; i < Math.min(searchResults.length, 5); i++) {
        const result = searchResults[i];
        messageText += `${i + 1}. **${result.title}**\n`;
        messageText += `📄 ${result.snippet || "Aucune description disponible"}\n`;
        messageText += `🔗 ${result.link}\n\n`;
      }

      // Ajouter des informations supplémentaires
      messageText += `📊 Environ ${response.data.searchInformation?.totalResults || "N/A"} résultats trouvés\n`;
      messageText += `⏱️ Temps de recherche: ${response.data.searchInformation?.searchTime || "N/A"} secondes\n`;
      messageText += `🕐 Recherche effectuée le: ${new Date().toLocaleString('fr-FR')}\n`;

      // Supprimer le message de chargement
      api.unsendMessage(loadingMessage.messageID);

      // Préparer le message avec image si disponible
      const messageOptions = {
        body: messageText
      };

      // Chercher une image dans les résultats
      let imageUrl = null;
      for (const result of searchResults) {
        if (result.pagemap && result.pagemap.cse_image && result.pagemap.cse_image[0]) {
          imageUrl = result.pagemap.cse_image[0].src;
          break;
        }
      }

      // Si aucune image n'est trouvée dans les résultats, faire une recherche d'images
      if (!imageUrl) {
        try {
          const imageSearchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&searchType=image&num=1`;
          const imageResponse = await axios.get(imageSearchUrl);
          
          if (imageResponse.data.items && imageResponse.data.items.length > 0) {
            imageUrl = imageResponse.data.items[0].link;
          }
        } catch (imageError) {
          console.log("Erreur lors de la recherche d'image:", imageError);
        }
      }

      // Ajouter l'image si disponible
      if (imageUrl) {
        try {
          const imageStream = await global.utils.getStreamFromURL(imageUrl);
          messageOptions.attachment = imageStream;
        } catch (imageError) {
          console.log("Erreur lors du chargement de l'image:", imageError);
        }
      }

      // Envoyer le message final
      api.sendMessage(messageOptions, event.threadID, event.messageID);

    } catch (error) {
      console.error("Erreur Google Search:", error);
      
      // Supprimer le message de chargement en cas d'erreur
      try {
        api.unsendMessage(loadingMessage.messageID);
      } catch (e) {}

      // Message d'erreur détaillé
      let errorMessage = "❌ Erreur lors de la recherche Google:\n";
      
      if (error.response && error.response.status === 403) {
        errorMessage += "• Limite d'API atteinte ou clé API invalide\n";
      } else if (error.response && error.response.status === 429) {
        errorMessage += "• Trop de requêtes, veuillez réessayer plus tard\n";
      } else {
        errorMessage += `• ${error.message}\n`;
      }
      
      errorMessage += "\nVeuillez réessayer dans quelques instants.";
      
      api.sendMessage(errorMessage, event.threadID, event.messageID);
    }
  }
};
