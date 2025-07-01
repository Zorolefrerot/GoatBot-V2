 const characters = [ { name: "𝗜𝗰𝗵𝗶𝗴𝗼 𝗞𝘂𝗿𝗼𝘀𝗮𝗸𝗶", power: 65 }, { name: "𝗨𝗿𝘆𝘂 𝗜𝗰𝗵𝗶𝗱𝗮", power: 60 }, { name: "𝗦𝘂𝗱𝗼 𝗬𝗮𝘀𝘂𝘁𝗼𝗿𝗮", power: 55 }, { name: "𝗢𝗿𝗶𝗵𝗶𝗺𝗲 𝗜𝗻𝗼𝘂𝗲", power: 40 }, { name: "𝗞𝗼𝗻", power: 10 }, { name: "𝗥𝘂𝗸𝗶𝗮 𝗞𝘂𝗰𝗵𝗶𝗸𝗶", power: 55 }, { name: "𝗚𝗮𝗻𝗷𝘂 𝗦𝗵𝗶𝗯𝗮", power: 45 }, { name: "𝗜𝘁𝘀𝘂𝗴𝗮𝘆𝗮 𝗧𝗼𝘀𝗵𝗶𝗿𝗼", power: 70 }, { name: "𝗞𝗮𝗿𝗶𝘆𝗮", power: 70 }, { name: "𝗚𝗿𝗮𝗻𝗱 𝗙𝗶𝘀𝗵𝗲𝗿", power: 50 }, { name: "𝗥𝗲𝗻𝗷𝗶 𝗔𝗯𝗮𝗿𝗮𝗶", power: 60 }, { name: "𝗕𝘆𝗮𝗸𝘂𝘆𝗮 𝗞𝘂𝗰𝗵𝗶𝗸𝗶", power: 75 }, { name: "𝗠𝗮𝘁𝘀𝘂𝗺𝗼𝘁𝗼 𝗥𝗮𝗻𝗴𝗶𝗸𝘂", power: 60 }, { name: "𝗔𝗶𝘇𝗲𝗻 𝗦𝗼𝘀𝘂𝗸𝗲", power: 75 }, { name: "𝗨𝗿𝗮𝗵𝗮𝗿𝗮 𝗞𝗶𝘀𝘂𝗸𝗲", power: 65 }, { name: "𝗠𝗮𝘆𝘂𝗿𝗶 𝗞𝘂𝗿𝗼𝘁𝘀𝘂𝘀𝗵𝗶", power: 60 }, { name: "𝗦𝗼𝗶 𝗙𝗼𝗻", power: 70 }, { name: "𝗛𝗮𝗻𝗮𝘁𝗮𝗿𝗼 𝗬𝗮𝗺𝗮𝗱𝗮", power: 30 },
{ name: "𝗞𝗲𝗻𝗽𝗮𝗰𝗵𝗶 𝘇𝗮𝗿𝗮𝗸𝗶", power: 85},
 { name: "𝘈𝘭𝘦́𝘢𝘵𝘰𝘪𝘳𝘦🔄", power: 50, isRandom: true } ];

const fightData = {};

function getRandomTechnique(power, type) { let damage = 0; let emoji = ""; switch (type) { case "A": damage = Math.floor(Math.random() * 6 + 5); emoji = "👊 𝘊𝘰𝘶𝘱 𝘥𝘦 𝘱𝘰𝘪𝘯𝘨"; break; case "B": if (Math.random() <= 0.75) { damage = Math.floor(Math.random() * 6 + 15); emoji = "🗡️ 𝘛𝘦𝘤𝘩𝘯𝘪𝘲𝘶𝘦 𝘴𝘱𝘪𝘳𝘪𝘵𝘶𝘦𝘭𝘭𝘦"; } break; case "X": if (Math.random() <= 0.5) { damage = Math.floor(Math.random() * 16 + 30); emoji = "🔥 𝘉𝘢𝘯𝘬𝘢𝘪 / 𝘜𝘭𝘵𝘪𝘮𝘦"; } break; } return { damage: Math.round((damage * power) / 100), emoji }; }

module.exports = { config: { name: "bleach-fight", aliases: ["fight", "bf"], version: "1.0", author: "Merdi Madimba", shortDescription: "Jeu de combat Bleach", longDescription: "Lance un combat virtuel inspiré de l'univers de Bleach", category: "🎮 Jeux", guide: "{p}bleach-fight", role: 0 },

onStart: async function ({ event, message }) { const { senderID, threadID } = event; if (fightData[threadID]) return message.reply("⛔️ Un combat est déjà en cours dans ce groupe !");

fightData[threadID] = {
  userID: senderID,
  phase: "waitingStart",
  playerHP: 100,
  botHP: 100,
  round: 1
};

await message.send({
  body: `📺 𝘉𝘪𝘦𝘯𝘷𝘦𝘯𝘶𝘦 <@${senderID}> dans « 🎮𝗕𝗟𝗘𝗔𝗖𝗛-𝗙𝗜𝗚𝗛𝗧🎯 » !

⚡️ 𝘛𝘢𝘱𝘦 @start 𝘱𝘰𝘶𝘳 𝘤𝘰𝘮𝘮𝘦𝘯𝘤𝘦𝘳 !`, attachment: await global.utils.getStreamFromURL("http://goatbiin.onrender.com/ib93wNfUE.jpg") }); },

onChat: async function ({ event, message }) { const { threadID, senderID, body } = event; if (!fightData[threadID] || fightData[threadID].userID !== senderID) return; const session = fightData[threadID]; const input = body.trim().toLowerCase();

if (input === "@start" && session.phase === "waitingStart") {
  session.phase = "chooseCharacter";
  let list = characters.map((c, i) => `${i + 1}. ${c.name}`).join("\n");
  return message.reply(`🔎𝘊𝘩𝘰𝘪𝘴𝘪𝘴 𝘛𝘰𝘯 𝘱𝘦𝘳𝘴𝘰𝘯𝘯𝘢𝘨𝘦 𝘦𝘯 𝘦𝘯𝘷𝘰𝘺𝘢𝘯𝘵 𝘭𝘦 𝘯𝘶𝘮𝘦́𝘳𝘰 𝘤𝘰𝘳𝘳𝘦𝘴𝘱𝘰𝘯𝘥𝘢𝘯𝘵 :\n${list}`);
}

if (session.phase === "chooseCharacter" && !isNaN(input)) {
  const index = parseInt(input) - 1;
  if (!characters[index]) return message.reply("❌ Numéro invalide.");
  session.playerChar = characters[index];
  session.botChar = characters[Math.floor(Math.random() * (characters.length - 1))];
  session.phase = "readyToFight";
  return message.reply(`🌟 𝘝𝘰𝘵𝘳𝘦 𝘱𝘦𝘳𝘴𝘰 𝘦𝘴𝘵 : ${session.playerChar.name}

🧠 𝘛𝘰𝘯 𝘢𝘥𝘷𝘦𝘳𝘴𝘢𝘪𝘳𝘦 𝘦𝘴𝘵  : ${session.botChar.name} 📈 𝘛𝘢𝘱𝘦 @fight 𝘱𝘰𝘶𝘳 𝘭𝘢𝘯𝘤𝘦𝘳 𝘭𝘢 𝘱𝘢𝘳𝘵𝘪𝘦 !`); }

if (input === "@fight" && session.phase === "readyToFight") {
  session.phase = "fighting";
  return message.reply(`𝗕𝗘𝗚𝗜𝗡𝗡 𝗙𝗜𝗚𝗛𝗧🔥 !

🌟 ${session.playerChar.name} VS ${session.botChar.name} 🎯 HP: 100% vs 100% 📈 Tape @A (poing), @B (technique), ou @X (ultime)`); }

if (session.phase === "fighting" && input.startsWith("@")) {
  const type = input.slice(1).toUpperCase();
  if (!["A", "B", "X"].includes(type)) return;

  const botMove = getRandomTechnique(session.botChar.power, ["A", "B", "X"][Math.floor(Math.random() * 3)]);
  const userMove = getRandomTechnique(session.playerChar.power, type);

  if (!userMove.damage) return message.reply(`⚠️ Pas assez d'énergie spirituelle pour utiliser la technique ${type} !`);

  session.playerHP -= botMove.damage;
  session.botHP -= userMove.damage;

  const hpUser = session.playerHP <= 0 ? 0 : session.playerHP;
  const hpBot = session.botHP <= 0 ? 0 : session.botHP;

  const result = `🤜 ROUND ${session.round++}

🤖 Bot attaque avec ${botMove.emoji} (-${botMove.damage}%) 🥷 Tu attaques avec ${userMove.emoji} (-${userMove.damage}%)

❤️ Vie actuelle: ✊ ${session.playerChar.name} : ${hpUser}% ☠️ ${session.botChar.name} : ${hpBot}%`;

if (hpUser <= 0 || hpBot <= 0) {
    const winner = hpUser > hpBot ? `🏆 Bravo <@${senderID}> ! Tu as gagné !` : `❌ Défaite ! ${session.botChar.name} l'emporte.`;
    delete fightData[threadID];
    return message.reply(`${result}\n\n${winner}`);
  }

  return message.reply(result);
}

if (input === "@end") {
  delete fightData[threadID];
  return message.reply("❌ Combat annulé.");
}

} };
