 module.exports = {
  config: {
    name: "groupinfo",
    aliases: ["ginf"],
    version: "1.0",
    author: "Merdi Madimba",
    countDown: 5,
    role: 0,
    shortDescription: "Affiche les infos du groupe",
    longDescription: "Affiche les infos du groupe : nom, photo, date, admins, nombre de filles/garçons et total de messages",
    category: "group",
    guide: {
      fr: "{pn}"
    }
  },

  onStart: async function ({ api, event, threadsData, usersData }) {
    try {
      const threadID = event.threadID;
      const threadInfo = await api.getThreadInfo(threadID);

      // Nom du groupe
      const groupName = threadInfo.threadName || "Sans nom";

      // Photo du groupe
      const imageURL = threadInfo.imageSrc;

      // Date de création (approx via message count data si disponible)
      const creationTime = new Date(threadInfo.timestamp);
      const formattedDate = creationTime.toLocaleDateString();

      // Liste des administrateurs (tagués)
      const adminIDs = threadInfo.adminIDs || [];
      const adminTags = adminIDs.map(admin => ({
        id: admin.id,
        tag: `@${usersData.get(admin.id)?.name || "Admin"}`
      }));

      // Compter les garçons et les filles
      let maleCount = 0;
      let femaleCount = 0;

      for (const user of threadInfo.userInfo) {
        if (user.gender === 'MALE') maleCount++;
        else if (user.gender === 'FEMALE') femaleCount++;
      }

      const totalMessages = threadInfo.messageCount || "Inconnu";

      // Création du message
      const message = {
        body:
`📣 𝗜𝗻𝗳𝗼𝘀 𝗱𝘂 𝗚𝗿𝗼𝘂𝗽𝗲

📌 𝗡𝗼𝗺 : ${groupName}
🗓️ 𝗖𝗿é𝗲 𝗹𝗲 : ${formattedDate}
👥 𝗔𝗱𝗺𝗶𝗻𝘀 : ${adminTags.map(a => a.tag).join(', ')}

👩 Filles : ${femaleCount}
👨 Garçons : ${maleCount}
💬 Messages totaux : ${totalMessages}
`,
        mentions: adminTags
      };

      // Envoyer la photo si elle existe
      if (imageURL) {
        const axios = require("axios");
        const fs = require("fs-extra");
        const path = __dirname + "/group_photo.jpg";
        const res = await axios.get(imageURL, { responseType: "arraybuffer" });
        fs.writeFileSync(path, Buffer.from(res.data, "utf-8"));

        message.attachment = fs.createReadStream(path);
        api.sendMessage(message, threadID, () => fs.unlinkSync(path));
      } else {
        api.sendMessage(message, threadID);
      }
    } catch (e) {
      api.sendMessage("❌ Erreur lors de la récupération des infos du groupe.", event.threadID);
      console.error(e);
    }
  }
};
