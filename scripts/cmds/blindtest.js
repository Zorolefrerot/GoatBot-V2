
const axios = require('axios');

module.exports = {
  config: {
    name: "blindtest",
    aliases: ["bt"],
    version: "1.0",
    author: "Merdi Madimba",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Play anime opening/ending for blind test"
    },
    longDescription: {
      en: "Play a specific opening or ending from an anime for blind test game"
    },
    category: "game",
    guide: {
      en: "{pn} <opening/ending> <number> <anime name>\n"
        + "Example: {pn} opening 1 Naruto\n"
        + "Example: {pn} ending 2 One Piece"
    }
  },

  onStart: async function ({ message, args, event, api }) {
    try {
      if (args.length < 3) {
        return message.reply("❌ Usage: /bt <opening/ending> <number> <anime name>\nExample: /bt opening 1 Naruto");
      }

      const type = args[0].toLowerCase();
      const number = parseInt(args[1]);
      const animeName = args.slice(2).join(' ');

      if (!['opening', 'ending', 'op', 'ed'].includes(type)) {
        return message.reply("❌ Type must be 'opening', 'ending', 'op', or 'ed'");
      }

      if (isNaN(number) || number < 1) {
        return message.reply("❌ Number must be a positive integer");
      }

      // Convert type to API format
      const themeType = (type === 'opening' || type === 'op') ? 'OP' : 'ED';

      message.reply("🔍 Searching for the anime theme...");

      // Search for anime
      const searchResponse = await axios.get(`https://api.animethemes.moe/search/anime`, {
        params: {
          q: animeName,
          limit: 1
        }
      });

      if (!searchResponse.data.search.anime || searchResponse.data.search.anime.length === 0) {
        return message.reply(`❌ Anime "${animeName}" not found. Try with a different name.`);
      }

      const anime = searchResponse.data.search.anime[0];

      // Get anime details with themes
      const animeResponse = await axios.get(`https://api.animethemes.moe/anime/${anime.slug}`, {
        params: {
          include: 'animethemes.animethemeentries.videos,animethemes.song.artists'
        }
      });

      const animeData = animeResponse.data.anime;
      
      // Find the specific theme
      const theme = animeData.animethemes.find(t => 
        t.type === themeType && t.sequence === number
      );

      if (!theme) {
        return message.reply(`❌ ${themeType} ${number} not found for "${animeData.name}"`);
      }

      // Get the video URL
      const entry = theme.animethemeentries[0];
      if (!entry || !entry.videos || entry.videos.length === 0) {
        return message.reply(`❌ No video available for this theme`);
      }

      const video = entry.videos[0];
      const videoUrl = `https://animethemes.moe/video/${video.basename}`;

      // Get song and artist info
      const songInfo = theme.song ? `🎵 **${theme.song.title}**` : '';
      const artistInfo = theme.song && theme.song.artists ? 
        `👤 **Artist(s):** ${theme.song.artists.map(a => a.name).join(', ')}` : '';

      const responseMessage = `🎌 **Blind Test - ${animeData.name}**\n` +
        `🎬 **${themeType} ${number}**\n` +
        `${songInfo}\n` +
        `${artistInfo}\n\n` +
        `🎵 **Can you guess this anime theme?**`;

      // Send the message with video attachment
      message.reply({
        body: responseMessage,
        attachment: await global.utils.getStreamFromURL(videoUrl)
      });

    } catch (error) {
      console.error('Blind test error:', error);
      
      if (error.response && error.response.status === 404) {
        return message.reply("❌ The requested anime or theme was not found in the database.");
      } else if (error.response && error.response.status === 429) {
        return message.reply("❌ Too many requests. Please wait a moment and try again.");
      } else {
        return message.reply("❌ An error occurred while fetching the anime theme. Please try again later.");
      }
    }
  }
};
