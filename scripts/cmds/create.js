
const axios = require('axios');

module.exports = {
  config: {
    name: "create",
    aliases: ["gen", "img"],
    version: "1.0",
    author: "Merdi Madimba",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "Generate high-quality images from text prompts"
    },
    longDescription: {
      en: "Create stunning images using advanced AI image generation with multiple fallback APIs for best results"
    },
    category: "ai",
    guide: {
      en: "{pn} <your detailed description>\nExample: {pn} a beautiful sunset over mountains with purple sky"
    }
  },

  onStart: async function ({ message, args, event }) {
    try {
      if (!args.length) {
        return message.reply("❌ | Veuillez fournir une description pour générer l'image.\nExemple: create un chat mignon avec des yeux bleus");
      }

      const prompt = args.join(' ');
      
      // Enhanced prompt for better results
      const enhancedPrompt = `${prompt}, high quality, detailed, 4k resolution, professional photography`;
      
      await message.reply("🎨 | Génération de votre image en cours... Veuillez patienter.");

      // Try multiple APIs for best results
      const apis = [
        {
          name: "Pollinations AI",
          url: `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1024&height=1024&model=flux&seed=${Math.floor(Math.random() * 1000000)}`
        },
        {
          name: "Prodia API",
          url: `https://api.prodia.com/v1/sd/generate`,
          method: "POST",
          data: {
            prompt: enhancedPrompt,
            model: "absolutereality_v181.safetensors [3d9d4d2b]",
            steps: 25,
            cfg_scale: 7,
            seed: Math.floor(Math.random() * 1000000),
            sampler: "DPM++ 2M Karras",
            negative_prompt: "blurry, low quality, distorted, ugly, bad anatomy"
          }
        },
        {
          name: "Alternative API",
          url: `https://api.segmind.com/v1/sd1.5-txt2img`,
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            prompt: enhancedPrompt,
            negative_prompt: "blurry, low quality, distorted, ugly, bad anatomy, extra limbs",
            style: "photographic",
            samples: 1,
            scheduler: "DDIM",
            num_inference_steps: 25,
            guidance_scale: 7.5,
            seed: Math.floor(Math.random() * 1000000),
            img_width: 1024,
            img_height: 1024
          }
        }
      ];

      let imageStream = null;
      let usedApi = "";

      // Try each API until one works
      for (const api of apis) {
        try {
          let response;
          
          if (api.method === "POST") {
            response = await axios({
              method: 'POST',
              url: api.url,
              data: api.data,
              headers: api.headers,
              timeout: 30000
            });
            
            // Handle different response formats
            if (response.data.output) {
              imageStream = await global.utils.getStreamFromURL(response.data.output[0]);
            } else if (response.data.images) {
              imageStream = await global.utils.getStreamFromURL(response.data.images[0]);
            } else if (response.data.image) {
              imageStream = await global.utils.getStreamFromURL(response.data.image);
            }
          } else {
            // Direct image URL
            imageStream = await global.utils.getStreamFromURL(api.url);
          }

          if (imageStream) {
            usedApi = api.name;
            break;
          }
        } catch (error) {
          console.log(`${api.name} failed:`, error.message);
          continue;
        }
      }

      // Fallback to simple Pollinations if all else fails
      if (!imageStream) {
        try {
          const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
          imageStream = await global.utils.getStreamFromURL(fallbackUrl);
          usedApi = "Pollinations Fallback";
        } catch (error) {
          return message.reply("❌ | Désolé, impossible de générer l'image pour le moment. Veuillez réessayer plus tard.");
        }
      }

      if (!imageStream) {
        return message.reply("❌ | Erreur lors de la génération de l'image. Veuillez réessayer avec une description différente.");
      }

      return message.reply({
        body: `✅ | Image générée avec succès !\n🎨 Prompt: "${prompt}"\n🔧 Générée avec: ${usedApi}\n\n💡 Astuce: Soyez plus précis dans vos descriptions pour de meilleurs résultats !`,
        attachment: imageStream
      });

    } catch (error) {
      console.error("Create command error:", error);
      return message.reply("❌ | Une erreur est survenue lors de la génération de l'image. Veuillez réessayer.");
    }
  }
};
