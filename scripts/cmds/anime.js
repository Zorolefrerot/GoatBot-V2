 const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "anime",
    version: "1.1",
    author: "Merdi Madimba",
    shortDescription: {
      fr: "🔍 Recherche un animé sur MyAnimeList"
    },
    longDescription: {
      fr: "Fournit des informations détaillées sur un animé depuis MyAnimeList via l'API Jikan"
    },
    category: "🎭 Animé",
    guide: {
      fr: "anime <nom>"
    },
    cooldown: 5,
    role: 0,
    credits: "Merdi Madimba"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const query = args.join(" ");

    if (!query) {
      return api.sendMessage("❗ Utilisation : anime <nom de l'animé>", threadID, messageID);
    }

    try {
      const res = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`);
      const anime = res.data.data?.[0];

      if (!anime) {
        return api.sendMessage("❌ Aucun animé trouvé.", threadID, messageID);
      }

      const info =
`🎬 ${anime.title} (${anime.type})
⭐ Note : ${anime.score ?? "N/A"} | Épisodes : ${anime.episodes ?? "?"}
📅 Diffusé : ${anime.aired?.from?.split("T")[0] ?? "?"}
📖 Synopsis : ${anime.synopsis?.substring(0, 300) ?? "Aucun synopsis disponible"}...
🔗 ${anime.url}`;

      // Créer le dossier cache si inexistant
      const cachePath = path.join(__dirname, "cache");
      if (!fs.existsSync(cachePath)) {
        fs.mkdirSync(cachePath);
      }

      const imagePath = path.join(cachePath, `${anime.mal_id}.jpg`);
      const imgRes = await axios.get(anime.images.jpg.image_url, { responseType: "arraybuffer" });
      fs.writeFileSync(imagePath, Buffer.from(imgRes.data, "binary"));

      // Envoi du message avec l'image
      api.sendMessage({
        body: info,
        attachment: fs.createReadStream(imagePath)
      }, threadID, () => {
        fs.unlinkSync(imagePath); // Supprime l'image après envoi
      });

    } catch (err) {
      console.error("❌ Erreur API Jikan :", err.message);
      return api.sendMessage("❌ Une erreur s'est produite lors de la récupération des données.", threadID, messageID);
    }
  }
};
