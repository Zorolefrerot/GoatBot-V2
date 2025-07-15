const fs = require("fs-extra");
const axios = require("axios");
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "verse",
    aliases: ["animevideo", "episode"],
    version: "1.0.0",
    author: "merdi madimba",
    countDown: 15,
    role: 0,
    shortDescription: "Télécharge des épisodes d'anime",
    longDescription: "Télécharge des épisodes d'anime en VF ou VOSTFR selon votre demande",
    category: "media",
    guide: {
      fr: "   {pn} <nom de l'anime> <numéro épisode> [vf|vostfr]: télécharge l'épisode d'anime\n   Exemple: {pn} naruto 1 vf\n   Exemple: {pn} one piece 1000 vostfr\n   Exemple: {pn} attack on titan 1"
    }
  },

  onStart: async function ({ args, message, event, api }) {
    try {
      if (args.length < 2) {
        return message.reply("❌ Veuillez fournir le nom de l'anime et le numéro de l'épisode.\n\nExemple: /anime naruto 1 vf\nExemple: /anime one piece 1000 vostfr");
      }

      // Parser les arguments
      const episodeNumber = args.pop(); // Dernier argument = numéro épisode
      let language = "vostfr"; // Par défaut VOSTFR
      
      // Vérifier si l'avant-dernier argument est une langue
      if (args.length > 0 && (args[args.length - 1].toLowerCase() === "vf" || args[args.length - 1].toLowerCase() === "vostfr")) {
        language = args.pop().toLowerCase();
      }
      
      const animeName = args.join(" ");

      if (!animeName || isNaN(episodeNumber)) {
        return message.reply("❌ Format incorrect. Utilisez: /anime <nom anime> <numéro épisode> [vf|vostfr]");
      }

      const processingMessage = await message.reply("🔍 Recherche de l'épisode en cours...");

      // Rechercher l'anime
      const searchUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(animeName)}&limit=1`;
      
      let animeData;
      try {
        const searchResponse = await axios.get(searchUrl);
        if (!searchResponse.data.data || searchResponse.data.data.length === 0) {
          return api.sendMessage("❌ Aucun anime trouvé pour cette recherche.", event.threadID, event.messageID);
        }
        animeData = searchResponse.data.data[0];
      } catch (error) {
        console.error('Erreur recherche anime:', error);
        return api.sendMessage("❌ Erreur lors de la recherche de l'anime.", event.threadID, event.messageID);
      }

      // Vérifier si l'épisode existe
      if (parseInt(episodeNumber) > animeData.episodes && animeData.episodes !== null) {
        return api.sendMessage(`❌ L'épisode ${episodeNumber} n'existe pas. Cet anime a ${animeData.episodes} épisodes.`, event.threadID, event.messageID);
      }

      // Simuler la recherche d'un lien de streaming (en réalité, il faudrait une vraie API)
      api.editMessage("⏳ Recherche du lien de streaming...", processingMessage.messageID);

      // Pour la démonstration, on utilise une API mock ou on simule
      // En réalité, vous devriez utiliser une vraie API d'anime comme:
      // - Animixplay API
      // - GogoAnime API  
      // - 9anime API
      // Ici je simule avec une API de placeholder

      try {
        // URL d'exemple pour récupérer une vidéo (remplacez par une vraie API)
        const videoUrl = await getAnimeEpisodeUrl(animeName, episodeNumber, language);
        
        if (!videoUrl) {
          return api.sendMessage(`❌ Épisode ${episodeNumber} en ${language.toUpperCase()} non disponible pour ${animeData.title}.`, event.threadID, event.messageID);
        }

        api.editMessage("⬇️ Téléchargement de l'épisode en cours...", processingMessage.messageID);

        // Créer le dossier cache s'il n'existe pas
        const cacheDir = __dirname + `/cache`;
        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir, { recursive: true });
        }

        const fileName = `${event.senderID}_${Date.now()}.mp4`;
        const filePath = __dirname + `/cache/${fileName}`;

        // Télécharger la vidéo
        const response = await axios({
          method: 'GET',
          url: videoUrl,
          responseType: 'stream',
          timeout: 300000 // 5 minutes timeout
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        writer.on('finish', async () => {
          try {
            // Vérifier la taille du fichier
            const stats = fs.statSync(filePath);
            const fileSizeInMB = stats.size / (1024 * 1024);
            
            if (fileSizeInMB > 87) {
              fs.unlinkSync(filePath);
              return api.sendMessage("❌ L'épisode téléchargé est trop volumineux (max 87MB). Essayez avec un épisode plus court.", event.threadID, event.messageID);
            }

            // Formater les informations
            const duration = animeData.duration ? animeData.duration.replace("per ep", "").trim() : "Inconnu";
            const year = animeData.year || "Inconnu";
            const status = animeData.status || "Inconnu";

            // Envoyer l'épisode
            const replyMessage = {
              body: `✅ Épisode téléchargé avec succès!\n\n🎬 Anime: ${animeData.title}\n📺 Épisode: ${episodeNumber}\n🗣️ Langue: ${language.toUpperCase()}\n⏰ Durée: ${duration}\n📅 Année: ${year}\n📊 Statut: ${status}\n💾 Taille: ${fileSizeInMB.toFixed(2)} MB`,
              attachment: fs.createReadStream(filePath)
            };

            api.unsendMessage(processingMessage.messageID);

            api.sendMessage(replyMessage, event.threadID, () => {
              // Nettoyer le fichier temporaire après envoi
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
              }
            }, event.messageID);

          } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
            api.sendMessage("❌ Erreur lors de l'envoi de l'épisode.", event.threadID, event.messageID);
          }
        });

        writer.on('error', (error) => {
          console.error('Erreur de téléchargement:', error);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          api.sendMessage("❌ Erreur lors du téléchargement de l'épisode.", event.threadID, event.messageID);
        });

      } catch (error) {
        console.error('Erreur de streaming:', error);
        api.sendMessage("❌ Erreur lors de la récupération du lien de streaming.", event.threadID, event.messageID);
      }

    } catch (error) {
      console.error('Erreur générale:', error);
      api.sendMessage("❌ Une erreur est survenue lors du traitement de votre demande.", event.threadID, event.messageID);
    }
  }
};

// Fonction pour récupérer l'URL de l'épisode d'anime
async function getAnimeEpisodeUrl(animeName, episodeNumber, language) {
  try {
    // IMPORTANT: Remplacez cette partie par une vraie API d'anime
    // Voici quelques APIs que vous pouvez utiliser:
    
    // 1. API GogoAnime (exemple)
    // const searchUrl = `https://gogoanime.consumet.stream/search?keyw=${encodeURIComponent(animeName)}`;
    
    // 2. API Animixplay (exemple) 
    // const searchUrl = `https://animixplay.to/api/search?q=${encodeURIComponent(animeName)}`;
    
    // 3. API 9anime (exemple)
    // const searchUrl = `https://9anime.to/api/search?keyword=${encodeURIComponent(animeName)}`;

    // Pour la démonstration, on retourne une URL de test
    // EN PRODUCTION: remplacez par une vraie API
    
    // Simuler une recherche et retourner une URL de test
    // Vous devez implémenter la logique réelle ici
    
    // Exemple avec une API fictive:
    /*
    const response = await axios.get(`https://api-anime-example.com/search?name=${encodeURIComponent(animeName)}&episode=${episodeNumber}&lang=${language}`);
    if (response.data && response.data.videoUrl) {
      return response.data.videoUrl;
    }
    */
    
    // Pour la démonstration, retournons null (pas de vidéo trouvée)
    // Dans un vrai cas, vous implémenterez la logique de recherche
    console.log(`Recherche: ${animeName} - Episode ${episodeNumber} - Langue: ${language}`);
    
    // Retourner null pour indiquer qu'aucune vidéo n'a été trouvée
    // En production, remplacez par votre logique de récupération d'URL
    return null;
    
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'URL:', error);
    return null;
  }
}
