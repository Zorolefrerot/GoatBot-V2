const characters = [
  {
    name: "𝖭𝖺𝗋𝗎𝗍𝗈",
    power: 50,
    basic: "Rasengan",
    ultimate: "𝗠𝘂𝗹𝘁𝗶𝗰𝗹𝗼𝗻𝗲𝘀 + 𝗥𝗮𝘀𝗲𝗻𝗴𝗮𝗻 𝗚𝗲𝗮𝗻𝘁"
  },
  {
    name: "𝖭𝖺𝗋𝗎𝗍𝗈 (Ermite)",
    power: 60,
    basic: "𝗥𝗮𝘀𝗲𝗻𝗴𝗮𝗻 𝗚𝗲𝗮𝗻𝘁",
    ultimate: "𝗠𝗼𝗱𝗲.𝗲𝗿𝗺𝗶𝘁𝗲 + 𝗙𝘂𝘁𝗼𝗻 𝗥𝗮𝘀𝗲𝗻𝘀𝗵𝘂𝗿𝗶𝗸𝗲𝗻"
  },
  {
    name: "𝘕𝘢𝘳𝘶𝘵𝘰 (Rikudo)",
    power: 70,
    basic: "𝗢𝗿𝗯𝗲 𝗧𝗿𝘂𝘁𝗵 𝗦𝗲𝗲𝗸𝗲𝗿",
    ultimate: "𝗕𝗶𝗷𝘂𝘂 𝗺𝗼𝗱𝗲 𝗥𝗮𝘀𝗲𝗻𝘀𝗵𝘂𝗿𝗶𝗸𝗲𝗻"
  },
  {
    name: "𝖲𝖺𝗌𝗎𝗄𝖾",
    power: 60,
    basic: "𝗖𝗵𝗶𝗱𝗼𝗿𝗶",
    ultimate: "𝗞𝗶𝗿𝗶𝗻"
  },
  {
    name: "𝖲𝖺𝗌𝗎𝗄𝖾 (Taka)",
    power: 65,
    basic: "𝗖𝗵𝗶𝗱𝗼𝗿𝗶 𝗡𝗮𝗴𝗮𝘀𝗵𝗶",
    ultimate: "𝗦𝘂𝘀𝗮𝗻𝗼'𝗼"
  },
  {
    name: "𝖲𝖺𝗌𝗎𝗄𝖾 (Rinnegan)",
    power: 70,
    basic: "𝗔𝗺𝗮𝘁𝗲𝗿𝗮𝘀𝘂",
    ultimate: "𝗜𝗻𝗱𝗿𝗮'𝘀 𝗮𝗿𝗿𝗼𝘄"
  },
  {
    name: "𝖪𝖺𝗄𝖺𝗌𝗁𝗂",
    power: 60,
    basic: "𝗥𝗮𝗶𝗸𝗶𝗿𝗶",
    ultimate: "𝗞𝗮𝗺𝘂𝗶"
  },
  {
    name: "𝖬𝗂𝗇𝖺𝗍𝗈",
    power: 80,
    basic: "𝗛𝗶𝗿𝗮𝗶𝘀𝗵𝗶𝗯 𝗥𝗮𝘀𝗲𝗻𝗴𝗮𝗻",
    ultimate: "𝗠𝗼𝗱𝗲 𝗞𝘆𝘂𝘂𝗯𝗶 + 𝗛𝗶𝗿𝗮𝗶𝘀𝗵𝗶𝗻 𝗝𝗶𝗸𝗸𝘂 𝗷𝗶𝗽𝗽𝘂 𝘀𝗲𝗻𝗽𝗼 𝗿𝗲𝗻𝗼𝗱𝗮𝗻 𝘇𝗲𝗿𝗼𝘀𝗵𝗶𝗸𝗶"
  },
  {
    name: "𝖧𝖺𝗌𝗁𝗂𝗋𝖺𝗆𝖺",
    power: 70,
    basic: "𝗙𝗼𝗿𝗲𝘁 𝗻𝗮𝗶𝘀𝘀𝗮𝗻𝘁𝗲",
    ultimate: "𝗔𝗿𝘁 𝗦𝗲𝗻𝗶𝗻-𝗠𝗶𝗹𝗹𝗲𝘀 𝗺𝗮𝗶𝗻𝘀"
  },
  {
    name: "𝖳𝗈𝖻𝗂𝗋𝖺𝗆𝖺",
    power: 60,
    basic: "𝗦𝘂𝗶𝘁𝗼𝗻 : 𝗟𝗲 𝗱𝗿𝗮𝗴𝗼𝗻 𝗲𝗹𝗲𝗺𝗲𝗻𝘁𝗮𝗶𝗿𝗲 𝗮 𝗾𝘂𝗲𝘂𝗲",
    ultimate: "𝗘𝗱𝗼 𝘁𝗲𝗻𝘀𝗲𝗶"
  },
  {
    name: "𝘛𝘴𝘶𝘯𝘢𝘥𝘦",
    power: 60,
    basic: "𝗖𝗼𝘂𝗽 𝘀𝘂𝗿𝗽𝘂𝗶𝘀𝘀𝗮𝗻𝘁",
    ultimate: "𝗦𝗰𝗲𝗮𝘂 𝗕𝘆𝗮𝗸𝘂𝗴𝗼"
  },
  {
    name: "𝖧𝗂𝗋𝗎𝗓𝖾𝗇",
    power: 65,
    basic: "𝗧𝗲𝗰𝗵𝗻𝗶𝗾𝘂𝗲 𝗱𝗲𝘀 5 𝗲𝗹𝗲𝗺𝗲𝗻𝘁𝘀",
    ultimate: "𝗦𝗵𝗶𝗻𝗶𝗴𝗮𝗺𝗶 𝗦𝗲𝗮𝗹"
  },
  {
    name: "𝖯𝖺𝗂𝗇 (Tendo)",
    power: 68,
    basic: "𝗦𝗵𝗶𝗻𝗿𝗮 𝗧𝗲𝗻𝘀𝗲𝗶",
    ultimate: "𝗖𝗵𝗶𝗯𝗮𝗸𝘂 𝗧𝗲𝗻𝘀𝗲𝗶"
  },
  {
    name: "𝖪𝗈𝗇𝖺𝗇",
    power: 55,
    basic: "𝗗𝗮𝗻𝘀𝗲 𝗱𝗲 𝗽𝗮𝗽𝗶𝗲𝗿",
    ultimate: "𝗠𝗲𝗿 𝗱𝗲𝘀 𝗽𝗮𝗽𝗶𝗲𝗿𝘀 𝗲𝘅𝗽𝗹𝗼𝘀𝗶𝗳𝘀"
  },
  {
    name: "𝖭𝖺𝗀𝖺𝗍𝗈",
    power: 68,
    basic: "𝗔𝗯𝘀𝗼𝗿𝗯𝘁𝗶𝗼𝗻 𝗰𝗵𝗮𝗸𝗿𝗮",
    ultimate: "𝗥𝗲́𝗮𝗻𝗶𝗺𝗮𝘁𝗶𝗼𝗻 𝘂𝗻𝗶𝘃𝗲𝗿𝘀𝗲𝗹𝗹𝗲"
  },
  {
    name: "Deidara",
    power: 60,
    basic: "𝗔𝗿𝗴𝗶𝗹𝗲 𝗲𝘅𝗽𝗹𝗼𝘀𝗶𝘃𝗲 𝗖2",
    ultimate: "𝗔𝘂𝘁𝗼-𝗱𝗲𝘀𝘁𝗿𝘂𝗰𝘁𝗶𝗼𝗻 𝗖𝗢"
  },
  {
    name: "𝖪𝖺𝗄𝗎𝗓𝗎",
    power: 60,
    basic: "𝗙𝘂𝘁𝗼𝗻 - 𝗭𝗮𝗻𝗸𝗼𝗸𝘂𝗵𝗮",
    ultimate: "𝗖𝗼𝗲𝘂𝗿𝘀 𝗲𝗻𝗰𝗵𝗮𝗶𝗻𝗲́𝘀"
  },
  {
    name: "𝖧𝗂𝖽𝖺𝗇",
    power: 50,
    basic: "𝗔𝘁𝘁𝗮𝗾𝘂𝗲 𝗿𝗶𝘁𝘂𝗲𝗹",
    ultimate: "𝗥𝗶𝘁𝘂𝗲𝗹 𝗝𝗮𝘀𝗵𝗶𝗻"
  },
  {
    name: "𝖲𝖺𝗌𝗈𝗋𝗂",
    power: 58,
    basic: "𝗠𝗮𝗿𝗶𝗼𝗻𝗲𝘁𝘁𝗲𝘀",
    ultimate: "𝗔𝗿𝗺𝗲́𝗲 𝗱𝗲𝘀 100 "
  },
  {
    name: "𝖨𝗍𝖺𝖼𝗁𝗂",
    power: 70,
    basic: "𝗧𝘀𝘂𝗸𝘂𝘆𝗼𝗺𝗶",
    ultimate: "𝗔𝗺𝗮𝘁𝗲𝗿𝗮𝘀𝘂 + 𝗦𝘂𝘀𝗮𝗻𝗼'𝗼"
  },
  {
    name: "𝖪𝗂𝗓𝖺𝗆𝖾",
    power: 62,
    basic: "𝗥𝗲𝗾𝘂𝗶𝗻 𝗚𝗲𝗮𝗻𝘁",
    ultimate: "𝗙𝘂𝘀𝗶𝗼𝗻 𝗮𝘃𝗲𝗰 𝘀𝗮𝗺𝗲𝗵𝗮𝗱𝗮"
  },
  {
    name: "𝖮𝗋𝗈𝖼𝗁𝗂𝗆𝖺𝗋𝗎",
    power: 65,
    basic: "𝗣𝗼𝗶𝗴𝗻𝗲́𝗲 𝗱𝘂 𝘀𝗲𝗿𝗽𝗲𝗻𝘁 𝘀𝗽𝗲𝗰𝘁𝗿𝗮𝗹",
    ultimate: "𝗠𝗼𝗱𝗲 𝘀𝗮𝗴𝗲 𝗕𝗹𝗮𝗻𝗰"
  },
  {
    name: "𝖠𝗌𝗎𝗆𝖺",
    power: 55,
    basic: "𝗟𝗮𝗺𝗲𝘀 𝗱𝗲 𝗰𝗵𝗮𝗸𝗿𝗮",
    ultimate: "𝗙𝘂𝗿𝗶𝗲 𝗠𝗼𝗱𝗲"
  },
  {
    name: "𝖦𝖺𝗂",
    power: 70,
    basic: "𝗙𝗲𝘂 𝗱𝗲 𝗹𝗮 𝗷𝗲𝘂𝗻𝗲𝘀𝘀𝗲",
    ultimate: "8𝗲𝗺 𝗽𝗼𝗿𝘁𝗲 - 𝗡𝘂𝗶𝘁 𝗱𝗲 𝗹𝗮 𝗺𝗼𝗿𝘁"
  },
  {
    name: "𝖪𝗎𝗋𝖾𝗇𝖺𝗂",
    power: 45,
    basic: "𝗚𝗲𝗻𝗷𝘂𝘁𝘀𝘂",
    ultimate: "𝗣𝗶𝗲𝗴𝗲 𝗳𝗹𝗼𝗿𝗮𝗹"
  },
  {
    name: "𝖦𝖺𝖺𝗋𝖺",
    power: 68,
    basic: "𝗦𝗮𝗯𝗹𝗲 𝗺𝗼𝘂𝘃𝗮𝗻𝘁",
    ultimate: "𝗔𝗿𝗺𝘂𝗿𝗲 + 𝗦𝗮𝗯𝗹𝗲 𝗳𝘂𝗻𝗲𝗿𝗮𝗶𝗿𝗲"
  },
  {
    name: "𝖳𝖾𝗆𝖺𝗋𝗂",
    power: 58,
    basic: "𝗩𝗲𝗻𝘁 𝗧𝗿𝗮𝗻𝗰𝗵𝗮𝗻𝘁",
    ultimate: "𝗗𝗮𝗻𝘀𝗲 𝗱𝗲 𝗹𝗮 𝗳𝗮𝘂𝗰𝗶𝗹𝗹𝗲"
  },
  {
    name: "𝖪𝖺𝗇𝗄𝗎𝗋𝗈",
    power: 56,
    basic: "𝗣𝗼𝘂𝗽𝗲́𝗲 𝗞𝗮𝗿𝗮𝘀𝘂",
    ultimate: "𝗣𝗶𝗲𝗴𝗲 𝗱𝗲𝘀 𝘁𝗿𝗼𝗶𝘀 𝗺𝗮𝗿𝗶𝗼𝗻𝗲𝘁𝘁𝗲𝘀"
  },
  {
    name: "𝖧𝗂𝗇𝖺𝗍𝖺",
    power: 52,
    basic: "𝗣𝗮𝘂𝗺𝗺𝗲 𝗱𝘂 𝗵𝗮𝗸𝗸𝗲",
    ultimate: "𝗣𝗿𝗼𝘁𝗲𝗰𝘁𝗶𝗼𝗻 𝗱𝗲𝘀 64 𝗰𝗼𝘂𝗽𝘀"
  },
  {
    name: "𝖭𝖾𝗃𝗂",
    power: 60,
    basic: " 𝗧𝗼𝘂𝗿𝗯𝗶𝗹𝗹𝗼𝗻 𝗱𝗶𝘃𝗶𝗻",
    ultimate: "𝗟𝗲𝘀 64 𝗽𝗼𝗶𝗻𝗴 𝗱𝘂 𝗵𝗮𝗸𝗸𝗲"
  },
  {
    name: "𝖫𝖾𝖾",
    power: 65,
    basic: "𝗟𝗼𝘁𝘂𝘀 𝗿𝗲𝗰𝘁𝗼",
    ultimate: "6𝗲𝗺 𝗽𝗼𝗿𝘁𝗲 - 𝗽𝗮𝗼𝗻 𝗱𝘂 𝗺𝗶𝗱𝗶"
  },
  {
    name: "𝖲𝗁𝗂𝗄𝖺𝗆𝖺𝗋𝗎",
    power: 60,
    basic: "𝗢𝗺𝗯𝗿𝗲 𝗺𝗮𝗻𝗶𝗽𝘂𝗹𝗮𝘁𝗿𝗶𝗰𝗲",
    ultimate: "𝗣𝗶𝗲𝗴𝗲 𝘀𝘁𝗿𝗮𝘁𝗲𝗴𝗶𝗾𝘂𝗲 𝘁𝗼𝘁𝗮𝗹"
  },
  {
    name: "𝖲𝖺𝗄𝗎𝗋𝖺",
    power: 60,
    basic: "𝗖𝗼𝘂𝗽 𝗦𝘂𝗽𝗲𝗿𝘀𝗼𝗻𝗶𝗾𝘂𝗲",
    ultimate: "𝗦𝗰𝗲𝗮𝘂 𝗕𝘆𝗮𝗸𝘂𝗴𝗼 𝗱𝗲𝗰𝗵𝗮𝗶𝗻𝗲́"
  },
  {
    name: "𝖬𝖺𝖽𝖺𝗋𝖺",
    power: 75,
    basic: "𝗦𝘂𝘀𝗮𝗻𝗼'𝗼",
    ultimate: "𝗟𝗶𝗺𝗯𝗼 + 𝗠𝗲́𝘁𝗲́𝗿𝗼𝗲𝘀"
  },
  {
    name: "𝖮𝖻𝗂𝗍𝗈",
    power: 70,
    basic: "𝗞𝗮𝗺𝘂𝗶",
    ultimate: "𝗝𝘂𝘂𝗯𝗶 𝗺𝗼𝗱𝗲"
  },
  {
    name: "𝖹𝖾𝗍𝗌𝗎",
    power: 40,
    basic: "𝗔𝘁𝘁𝗮𝗾𝘂𝗲 𝗳𝘂𝗿𝘁𝗶𝘃𝗲",
    ultimate: "𝗜𝗻𝗳𝗲𝗰𝘁𝗶𝗼𝗻 𝗱𝗲 𝗰𝗼𝗿𝗽𝘀"
  },
  {
    name: "𝖪𝖺𝗀𝗎𝗒𝖺",
    power: 78,
    basic: "𝗣𝗼𝗿𝘁𝗮𝗶𝗹 𝗱𝗶𝗺𝗲𝗻𝘀𝗶𝗼𝗻𝗻𝗲𝗹",
    ultimate: "𝗢𝘀 𝗰𝗲𝗻𝗱𝗿𝗲́ + 𝗘𝘅𝗽𝗮𝗻𝘀𝗶𝗼𝗻 𝗱𝗶𝘃𝗶𝗻𝗲"
  },
  {
    name: "𝖠𝗒",
    power: 66,
    basic: "𝗖𝗼𝘂𝗽 𝗥𝗮𝗶𝗸𝗮𝗴𝗲",
    ultimate: "𝗠𝗼𝗱𝗲 𝗳𝗼𝘂𝗱𝗿𝗲"
  },
  {
    name: "𝖬𝖾𝗂",
    power: 60,
    basic: "𝗔𝗰𝗶𝗱𝗲 𝗯𝗼𝘂𝗶𝗹𝗹𝗮𝗻𝘁",
    ultimate: "𝗩𝗮𝗽𝗲𝘂𝗿 𝗱𝗲𝘀𝘁𝗿𝘂𝗰𝘁𝗿𝗶𝗰𝗲"
  },
  {
    name: "𝖮𝗇𝗈𝗄𝗂",
    power: 65,
    basic: "𝗧𝗲𝗰𝗵𝗻𝗶𝗾𝘂𝗲 𝗱𝗲 𝗹𝗲𝗴𝗲𝗿𝘁𝗲́",
    ultimate: "𝗝𝗶𝗻𝘁𝗼𝗻 : 𝗗𝗲́𝗺𝗮𝘁𝗲́𝗿𝗹𝗶𝘀𝗮𝘁𝗶𝗼𝗻"
  },
  {
    name: "𝖡𝖾𝖾",
    power: 68,
    basic: "𝗟𝗮𝗺𝗲𝘀 𝗮̀ 8 𝘀𝗮𝗯𝗿𝗲𝘀",
    ultimate: "𝗠𝗼𝗱𝗲 𝗛𝗮𝗰𝗵𝗶𝗯𝗶"
  },
  {
    name: "𝖡𝗈𝗋𝗎𝗍𝗈",
    power: 60,
    basic: "𝗥𝗮𝘀𝗲𝗻𝗴𝗮𝗻 𝗶𝗻𝘃𝗶𝗰𝗶𝗯𝗹𝗲",
    ultimate: "𝗞𝗮𝗺𝗮 𝗮𝗰𝘁𝗶𝘃𝗲́ + 𝗷𝗼𝘂𝗴𝗮𝗻"
  }
];

// Étape suivante : Intégration dans le module.exports avec les choix, combat, interface visuelle, effets, stats, restrictions... veux-tu que je continue dans ce même fichier ou en créer un autre pour diviser les étapes (ex: select.js, fight.js) ?

const gameState = {};

module.exports = { config: { name: "naruto-storm", aliases: ["nstorm"], version: "1.0", author: "Merdi Madimba", role: 0, category: "game", shortDescription: "Jeu de combat Naruto multijoueur", longDescription: "Simule un combat entre deux joueurs avec les personnages de Naruto", guide: { en: "{p}naruto-storm" } },

onStart: async function ({ message, event }) { const threadID = event.threadID;

if (gameState[threadID]) {
  return message.reply("⛔ Une partie est déjà en cours dans ce groupe. Terminez-la avant d'en commencer une nouvelle.");
}

gameState[threadID] = {
  step: "waiting_start",
  players: {},
  turn: null,
  p1Character: null,
  p2Character: null,
  p1HP: 100,
  p2HP: 100
};

return message.reply({
  body: `⚡ 𝖡𝗂𝖾𝗇𝗏𝖾𝖻𝗎𝖾 𝖽𝖺𝗇𝗌 𝗅𝖾 𝗃𝖾𝗎 𝗡𝗔𝗥𝗨𝗧𝗢-𝗦𝗧𝗢𝗥𝗠 ! \n𝖤𝗇𝗏𝗈𝗒𝖾𝗓 !start 𝗉𝗈𝗎𝗋 𝖼𝗈𝗆𝗆𝖾𝗇𝖼𝖾𝗋 𝗅𝖾 𝖽𝗎𝖾𝗅.`,
  attachment: await global.utils.getStreamFromURL("https://i.ibb.co/1Gdycvds/image.jpg")
});

},

onChat: async function ({ event, message }) { const threadID = event.threadID; const userID = event.senderID; const body = event.body.toLowerCase();

if (!gameState[threadID]) return;
const state = gameState[threadID];

if (state.step === "waiting_start" && body === "!start") {
  state.step = "choose_p1";
  state.players.p1 = userID;
  return message.reply("🧙 𝗝𝗼𝘂𝗲𝘂𝗿 1, 𝘁𝗮𝗽𝗲𝘇 !P1 𝗽𝗼𝘂𝗿 𝗰𝗵𝗼𝗶𝘀𝗶𝗿 𝘂𝗻 𝗽𝗲𝗿𝘀𝗼𝗻𝗻𝗮𝗴𝗲.");
}

if (state.step === "choose_p1" && body === "!p1" && userID === state.players.p1) {
  state.step = "choose_p2";
  return message.reply("🧝 𝗝𝗼𝘂𝗲𝘂𝗿 2, 𝘁𝗮𝗽𝗲𝘇 !P2 𝗽𝗼𝘂𝗿 𝗰𝗵𝗼𝗶𝘀𝗶𝗿 𝘂𝗻 𝗽𝗲𝗿𝘀𝗼𝗻𝗻𝗮𝗴𝗲.");
}

if (state.step === "choose_p2" && body === "!p2") {
  state.players.p2 = userID;
  state.step = "choose_characters";
  return message.reply("🎯 𝗖𝗵𝗼𝗶𝘀𝘀𝗶𝘀𝘀𝗲𝘇 𝘂𝗻 𝗽𝗲𝗿𝘀𝗼𝗻𝗻𝗮𝗴𝗲 𝗲𝗻 𝘁𝗮𝗽𝗮𝗻𝘁 𝗹𝗲 𝗻𝘂𝗺𝗲́𝗿𝗼 𝗰𝗼𝗿𝗿𝗲𝘀𝗽𝗼𝗻𝗱𝗮𝗻𝘁 \n" +
    characters.map((char, i) => `${i + 1}. ${char.name}`).join("\n"));
}

if (state.step === "choose_characters" && !state.p1Character) {
  const index = parseInt(body) - 1;
  if (!characters[index]) return message.reply("Numéro invalide. Essayez encore.");
  state.p1Character = characters[index];
  return message.reply(`✅ 𝗝𝗼𝘂𝗲𝘂𝗿 1 𝗮 𝗰𝗵𝗼𝗶𝘀𝗶𝘀 ${state.p1Character.name}. 𝗝𝗼𝘂𝗲𝘂𝗿 2 𝘁𝗮𝗽𝗲𝘇 𝘃𝗼𝘁𝗿𝗲 𝗻𝘂𝗺𝗲́𝗿𝗼 𝗽𝗼𝘂𝗿 𝗰𝗵𝗼𝗶𝘀𝗶𝗿 𝘂𝗻 𝗽𝗲𝗿𝘀𝗼𝗻𝗻𝗮𝗴𝗲.`);
}

if (state.step === "choose_characters" && state.p1Character && !state.p2Character && userID === state.players.p2) {
  const index = parseInt(body) - 1;
  if (!characters[index]) return message.reply("Numéro invalide. Essayez encore.");
  state.p2Character = characters[index];
  state.turn = "p1";
  state.step = "battle";
  return message.reply(`⚔️ 𝗟𝗲 𝗰𝗼𝗺𝗯𝗮𝘁 𝗰𝗼𝗺𝗺𝗲𝗻𝗰𝗲 𝗲𝗻𝘁𝗿𝗲 ${state.p1Character.name} 𝗲𝘁 ${state.p2Character.name} !\n𝖤𝗇𝗏𝗈𝗒𝖾𝗓 !a (𝖼𝗈𝗎𝗉), !b (𝖼𝗁𝖺𝗄𝗋𝖺) ou !x (𝗍𝖾𝖼𝗁𝗇𝗂𝗊𝗎𝖾 𝗎𝗅𝗍𝗂𝗆𝖾)`);
}

// Gestion des attaques
if (state.step === "battle") {
  if ((state.turn === "p1" && userID !== state.players.p1) || (state.turn === "p2" && userID !== state.players.p2)) {
    return;
  }

  const attacker = state.turn === "p1" ? state.p1Character : state.p2Character;
  const defender = state.turn === "p1" ? state.p2Character : state.p1Character;
  const hpKey = state.turn === "p1" ? "p2HP" : "p1HP";

  let damage = 0;
  let tech = "👐 𝗖𝗼𝘂𝗽";

  if (body === "!a") {
    damage = Math.floor(Math.random() * 6 + 5);
  } else if (body === "!b") {
    damage = Math.floor(Math.random() * 6 + 15);
    tech = `💥 ${attacker.basic}`;
  } else if (body === "!x") {
    const chance = Math.random();
    if (chance > 0.5) {
      damage = Math.floor(Math.random() * 16 + 30);
      tech = `🔥 ${attacker.ultimate}`;
    } else {
      return message.reply("⛔ Pas assez de chakra !");
    }
  } else {
    return message.reply("❓𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝗲 𝗶𝗻𝘃𝗮𝗹𝗶𝗱𝗲. Tapez !a, !b ou !x");
  }

  state[hpKey] -= damage;
  const attackerName = attacker.name;
  const targetName = defender.name;
  const hp1 = state.p1HP;
  const hp2 = state.p2HP;

  const result = `🎮 ${attackerName} 𝘂𝘁𝗶𝗹𝗶𝘀𝗲 ${tech} 𝗲𝘁 𝗶𝗻𝗳𝗹𝗶𝗴𝗲 ${damage}% 𝗱𝗲 𝗱𝗲𝗴𝗮𝘁𝘀 𝗮̀ ${targetName} !\n\n💖 𝗩𝗶𝗲 𝗱𝗲 ${state.p1Character.name}: ${hp1}%\n💔 𝗩𝗶𝗲 𝗱𝗲 ${state.p2Character.name}: ${hp2}%`;
  state.turn = state.turn === "p1" ? "p2" : "p1";

  if (hp1 <= 0 || hp2 <= 0) {
    delete gameState[threadID];
    const winner = hp1 <= 0 ? state.p2Character.name : state.p1Character.name;
    return message.reply(`🏁 𝗙𝗶𝗻 𝗱𝘂 𝗰𝗼𝗺𝗯𝗮𝘁, 𝗹𝗲 𝗴𝗮𝗴𝗻𝗮𝘁 𝗲𝘀𝘁 ${winner} ! 🏆`);
  }

  return message.reply(result);
}

} };
