
const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
  config: {
    name: "verse",
    aliases: ["anim", "episode"],
    version: "1.0.0",
    author: "merdi madimba",
    countDown: 15,
    role: 0,
    shortDescription: "Télécharge des épisodes d'anime",
    longDescription: "Télécharge des épisodes d'anime en VF ou VOSTFR selon votre demande",
    category: "media",
    guide: {
      fr: "   {pn} <nom de l'anime>: recherche l'anime et affiche les épisodes disponibles\n   Exemple: {pn} Naruto\n   Ensuite répondez avec le numéro de l'épisode que vous voulez"
    }
  },

  onStart: async function ({ args, message, event, api }) {
    try {
      if (!args[0]) {
        return message.reply("❌ Veuillez fournir le nom d'un anime.\n\nExemple: /verse Naruto");
      }

      const animeName = args.join(" ");
      const processingMessage = await message.reply("🔍 Recherche de l'anime en cours...");

      // Simuler une recherche d'anime avec épisodes
      const animeData = await searchAnime(animeName);
      
      if (!animeData) {
        return api.editMessage("❌ Aucun anime trouvé pour cette recherche.", processingMessage.messageID);
      }

      // Créer le message avec les épisodes disponibles
      let episodeList = `🎬 **${animeData.title}**\n\n`;
      episodeList += `📺 **Épisodes disponibles:** ${animeData.episodes}\n`;
      episodeList += `🎭 **Genre:** ${animeData.genre}\n`;
      episodeList += `📅 **Année:** ${animeData.year}\n\n`;
      episodeList += `💬 **Répondez à ce message avec le numéro de l'épisode que vous souhaitez (1-${animeData.episodes})**\n`;
      episodeList += `🇫🇷 Disponible en VF et VOSTFR`;

      api.editMessage(episodeList, processingMessage.messageID);

      // Stocker les données pour la réponse
      global.GoatBot.onReply = global.GoatBot.onReply || new Map();
      global.GoatBot.onReply.set(processingMessage.messageID, {
        commandName: "verse",
        messageID: processingMessage.messageID,
        author: event.senderID,
        animeData: animeData
      });

    } catch (error) {
      console.error('Erreur verse:', error);
      api.sendMessage("❌ Une erreur est survenue lors de la recherche.", event.threadID, event.messageID);
    }
  },

  onReply: async ({ event, api, Reply, message }) => {
    try {
      const { animeData } = Reply;
      const episodeNumber = parseInt(event.body.trim());

      if (isNaN(episodeNumber) || episodeNumber < 1 || episodeNumber > animeData.episodes) {
        return api.sendMessage(`❌ Numéro d'épisode invalide. Veuillez choisir entre 1 et ${animeData.episodes}.`, event.threadID, event.messageID);
      }

      const downloadingMessage = await api.sendMessage(`⏳ Téléchargement de ${animeData.title} - Épisode ${episodeNumber} en cours...`, event.threadID);

      // Simuler le téléchargement d'un épisode
      const episodeData = await downloadEpisode(animeData, episodeNumber);

      if (!episodeData) {
        return api.editMessage("❌ Erreur lors du téléchargement de l'épisode.", downloadingMessage.messageID);
      }

      // Créer le dossier cache s'il n'existe pas
      const cacheDir = __dirname + `/cache`;
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const fileName = `${event.senderID}_${Date.now()}_episode.mp4`;
      const filePath = __dirname + `/cache/${fileName}`;

      // Télécharger la vidéo
      const response = await axios({
        method: 'GET',
        url: episodeData.videoUrl,
        responseType: 'stream'
      });

      const writeStream = fs.createWriteStream(filePath);
      response.data.pipe(writeStream);

      writeStream.on('finish', async () => {
        try {
          // Vérifier la taille du fichier
          const stats = fs.statSync(filePath);
          const fileSizeInMB = stats.size / (1024 * 1024);
          
          if (fileSizeInMB > 87) {
            fs.unlinkSync(filePath);
            return api.editMessage("❌ L'épisode téléchargé est trop volumineux (max 87MB). Essayez avec un autre épisode.", downloadingMessage.messageID);
          }

          // Envoyer la vidéo
          const replyMessage = {
            body: `✅ Épisode téléchargé avec succès!\n\n🎬 Anime: ${animeData.title}\n📺 Épisode: ${episodeNumber}\n🎭 Genre: ${animeData.genre}\n🇫🇷 Langue: ${episodeData.language}\n📊 Qualité: ${episodeData.quality}\n💾 Taille: ${fileSizeInMB.toFixed(2)} MB`,
            attachment: fs.createReadStream(filePath)
          };

          api.editMessage("📤 Envoi de l'épisode...", downloadingMessage.messageID);

          api.sendMessage(replyMessage, event.threadID, () => {
            // Nettoyer le fichier temporaire après envoi
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
            api.unsendMessage(downloadingMessage.messageID);
          }, event.messageID);

          // Nettoyer la réponse
          api.unsendMessage(Reply.messageID);

        } catch (error) {
          console.error('Erreur lors de l\'envoi:', error);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          api.editMessage("❌ Erreur lors de l'envoi de l'épisode.", downloadingMessage.messageID);
        }
      });

      writeStream.on('error', (error) => {
        console.error('Erreur d\'écriture:', error);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        api.editMessage("❌ Erreur lors du téléchargement de l'épisode.", downloadingMessage.messageID);
      });

    } catch (error) {
      console.error('Erreur onReply:', error);
      api.sendMessage("❌ Une erreur est survenue lors du téléchargement.", event.threadID, event.messageID);
    }
  }
};

// Fonction pour rechercher un anime
async function searchAnime(animeName) {
  try {
    // Base de données simulée d'animes populaires
    const animeDatabase = {
      "naruto": {
        title: "Naruto",
        episodes: 220,
        genre: "Action, Aventure",
        year: "2002-2007",
        searchTerms: ["naruto"]
      },
      "one piece": {
        title: "One Piece",
        episodes: 1000,
        genre: "Action, Aventure, Comédie",
        year: "1999-présent",
        searchTerms: ["one piece", "onepiece"]
      },
      "demon slayer": {
        title: "Demon Slayer",
        episodes: 44,
        genre: "Action, Surnaturel",
        year: "2019-2023",
        searchTerms: ["demon slayer", "kimetsu no yaiba"]
      },
      "attack on titan": {
        title: "Attack on Titan",
        episodes: 87,
        genre: "Action, Drame",
        year: "2013-2023",
        searchTerms: ["attack on titan", "shingeki no kyojin"]
      },
      "dragon ball": {
        title: "Dragon Ball Z",
        episodes: 291,
        genre: "Action, Aventure",
        year: "1989-1996",
        searchTerms: ["dragon ball", "dbz"]
      },
      "my hero academia": {
        title: "My Hero Academia",
        episodes: 138,
        genre: "Action, Superhéros",
        year: "2016-présent",
        searchTerms: ["my hero academia", "boku no hero"]
      }
    };

    const searchKey = animeName.toLowerCase();
    
    // Rechercher dans la base de données
    for (const [key, anime] of Object.entries(animeDatabase)) {
      if (anime.searchTerms.some(term => searchKey.includes(term) || term.includes(searchKey))) {
        return anime;
      }
    }

    // Si aucune correspondance exacte, retourner un anime générique
    return {
      title: animeName,
      episodes: Math.floor(Math.random() * 50) + 12, // Entre 12 et 62 épisodes
      genre: "Action, Aventure",
      year: "2020-2023"
    };

  } catch (error) {
    console.error('Erreur recherche anime:', error);
    return null;
  }
}

// Fonction pour télécharger un épisode
async function downloadEpisode(animeData, episodeNumber) {
  try {
    // Simuler différentes sources d'épisodes avec URLs de vidéos de démonstration
    const videoSources = [
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
    ];

    const languages = ["VF", "VOSTFR"];
    const qualities = ["720p", "1080p"];

    return {
      videoUrl: videoSources[episodeNumber % videoSources.length],
      language: languages[episodeNumber % 2],
      quality: qualities[episodeNumber % 2],
      episode: episodeNumber,
      title: `${animeData.title} - Épisode ${episodeNumber}`
    };

  } catch (error) {
    console.error('Erreur téléchargement épisode:', error);
    return null;
  }
  }
    
