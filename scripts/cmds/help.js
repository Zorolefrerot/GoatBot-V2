const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "[ 🐐 | GoatBot V2 ]"; // changing this wont change the goatbot V2 of list cmd it is just a decoyy

module.exports = {
  config: {
    name: "help",
    version: "1.17",
    author: "NTKhang", // original author Kshitiz // edit Aesther
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View command usage and list all commands directly",
    },
    longDescription: {
      en: "View command usage and list all commands directly",
    },
    category: "info",
    guide: {
      en: "{pn} / help cmdName ",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = "";

      msg += `||◈🔵𝗜𝗗𝗥𝗘𝗠 𝗕𝗢𝗧 𝗖𝗠𝗗𝘀🔴◈||`; //  Aesther Edit

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += ` \n⊷◈◉『  ${category.toUpperCase()} 』◉◈⊷`;
const names = categories[category].commands.sort();
          for (let i = 0; i < names.length; i += 3) {
            const cmds = names.slice(i, i + 3).map((item) => `\n   🏷️${item}`);
            msg += ` ${cmds.join(" ".repeat(Math.max(1, 10 - cmds.join("").length)))}`;
          }

          msg += ``;
        }
      });

      const totalCommands = commands.size;
      msg += `\n🔖𝗧𝗢𝗧𝗔𝗟 𝗖𝗺𝗱 [${totalCommands}📑]\n》𝙲𝚁𝙴𝙰𝚃𝙾𝚁:\n🍁𝗠𝚎𝚛𝚍𝚒-𝗠𝚊𝚍𝚒𝚖𝚋𝚊`;
      msg += ``;
      msg += ``; // its not decoy so change it if you want 

      const helpListImages = [
        "https://i.ibb.co/dJLPhhyq/image.jpg", // add image link here
        "https://i.ibb.co/yF2b6Tc0/image.jpg",
        
      ];

      const helpListImage = helpListImages[Math.floor(Math.random() * helpListImages.length)];

      await message.reply({
        body: msg,
        attachment: await global.utils.getStreamFromURL(helpListImage),
      });
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`Command "${commandName}" not found.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";

        const longDescription = configCommand.longDescription ? configCommand.longDescription.en || "No description" : "No description";

        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `╭── 𝗡𝗔𝗠𝗘 ────⭓
  │ ${configCommand.name}
  ├── 🎯𝗜𝗡𝗙𝗢
  │ 🔵𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${longDescription}
  │ 🔴𝗢𝘁𝗵𝗲𝗿 𝗻𝗮𝗺𝗲𝘀: ${configCommand.aliases ? configCommand.aliases.join(", ") : "Do not have"}
  │ 🔵𝗢𝘁𝗵𝗲𝗿 𝗻𝗮𝗺𝗲𝘀 𝗶𝗻 𝘆𝗼𝘂𝗿 𝗴𝗿𝗼𝘂𝗽: Do not have
  │ 🔴𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${configCommand.version || "1.0"}
  │ 🔵𝗥𝗼𝗹𝗲: ${roleText}
  │ 🔴𝗧𝗶𝗺𝗲 𝗽𝗲𝗿 𝗰𝗼𝗺𝗺𝗮𝗻𝗱: ${configCommand.countDown || 1}s
  │ 🔵𝗔𝘂𝘁𝗵𝗼𝗿: ${author}
  ├── 🎯𝗨𝗦𝗔𝗚𝗘
  │ ${usage}
  ├── 🎯𝗡𝗢𝗧𝗘𝗦
  │ 𝗧𝗵𝗲 𝗰𝗼𝗻𝘁𝗲𝗻𝘁 𝗶𝗻𝘀𝗶𝗱𝗲 <XXXXX> 𝗰𝗮𝗻 𝗯𝗲 𝗰𝗵𝗮𝗻𝗴𝗲𝗱
  │ 𝗧𝗵𝗲 𝗰𝗼𝗻𝘁𝗲𝗻𝘁 𝗶𝗻𝘀𝗶𝗱𝗲 [a|b|c] 𝗶𝘀 𝗮 𝗼𝗿 𝗯 𝗼𝗿 𝗰
  ╰━━━━━━━❖`;

        await message.reply(response);
      }
    }
  },
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "0 (All users)";
    case 1:
      return "1 (Group administrators)";
    case 2:
      return "2 (Admin bot)";
    default:
      return "Unknown role";
  }
	    }
