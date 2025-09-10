•cmd install uptime.js module.exports = {
  config: {
    name: "uptime",
    aliases: ["up", "upt"],
    version: "1.0",
    author: "XyryllPanget",
    role: 2,
    shortDescription: {
      en: "Displays the uptime of the bot."
    },
    longDescription: {
      en: "Displays the amount of time that the bot has been running for."
    },
    category: "System",
    guide: {
      en: "Use {p}uptime to display the uptime of the bot."
    }
  },
  onStart: async function ({ api, event, args }) {
    const uptime = process.uptime();
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const days = Math.floor(uptime / (60 * 60 * 24));
    const uptimeString = `${hours} hours ${minutes} minutes ${seconds} second`;
    api.sendMessage(`💝 𝗧𝗘𝗠𝗣𝗦 𝗗'𝗔𝗖𝗧𝗜𝗩𝗜𝗧𝗘 𝗗𝗘 𝗠𝗜𝗥𝗔💝 \n•.:°❀×═════════×❀°:.•
\n ${uptimeString}`, event.threadID);
  }
};
