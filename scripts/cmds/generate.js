 module.exports = { config: { name: "generate", aliases: ["gnt"], version: "1.0", author: "Merdi Madimba", countDown: 5, role: 0, shortDescription: "Génère un tableau stylisé pour quiz", longDescription: "Génère un tableau de style quiz avec mention du modo et un style d'emoji aléatoire", category: "utilitaires", guide: "{pn}" },

onStart: async function ({ message, event, usersData }) { const modoName = await usersData.getName(event.senderID);

const templates = [
  `♨️⚔️🐥⚡𝗛𝗘𝗥𝗕𝗢𝗚𝗘𝗡𝗜𝗦𝗧𝗘𝗦⚡🐥⚔️♨️\n\n𝕄𝕆𝔻𝕆: @${modoName}\n\n---\n🪩🧧\n🪩🧧\n🪩🧧\n🪩🧧\n🪩🧧\n🪩🧧\n---\n\n𝕄𝕆𝔻𝕆 𝔸𝕃𝕃\n𝕆ℝ𝕋ℍ𝕆 ⛔\n𝕄𝔼𝕊𝕊𝔸𝔾𝔼𝕊 𝔻𝔼𝕋𝔸ℂℍ𝔼𝕊 ⛔\n𝕃𝕆𝕋𝕆⛔\n\n🏆 [ ${modoName.toUpperCase()} ]🏆`,

  `💥💀✨🔥𝗛𝗘𝗥𝗕𝗢𝗚𝗘𝗡𝗜𝗦𝗧𝗘𝗦🔥✨💀💥\n\n𝕄𝕆𝔻𝕆: @${modoName}\n\n---\n💣💎\n💣💎\n💣💎\n💣💎\n💣💎\n💣💎\n---\n\n𝕄𝕆𝔻𝕆 𝔸𝕃𝕃\n𝕆ℝ𝕋ℍ𝕆 ✅\n𝕄𝔼𝕊𝕊𝔸𝔾𝔼𝕊 𝔻𝔼𝕋𝔸ℂℍ𝔼𝕊 ⛔\n𝕃𝕆𝕋𝕆✅\n\n🏆 [ ${modoName.toUpperCase()} ]🏆`,

  `🧨🎯🎮🎲𝗛𝗘𝗥𝗕𝗢𝗚𝗘𝗡𝗜𝗦𝗧𝗘𝗦🎲🎮🎯🧨\n\n𝕄𝕆𝔻𝕆: @${modoName}\n\n---\n🎰🧃\n🎰🧃\n🎰🧃\n🎰🧃\n🎰🧃\n🎰🧃\n---\n\n𝕄𝕆𝔻𝕆 𝔸𝕃𝕃\n𝕆ℝ𝕋ℍ𝕆 ⛔\n𝕄𝔼𝕊𝕊𝔸𝔾𝔼𝕊 𝔻𝔼𝕋𝔸ℂℍ𝔼𝕊 ✅\n𝕃𝕆𝕋𝕆✅\n\n🏆 [ ${modoName.toUpperCase()} ]🏆`,

  `🧿💎⚜️⚙️ 𝗛𝗘𝗥𝗕𝗢𝗚𝗘𝗡𝗜𝗦𝗧𝗘𝗦⚙️⚜️💎🧿\n\n𝕄𝕆𝔻𝕆: @${modoName}\n\n---\n💠🔹\n💠🔹\n💠🔹\n💠🔹\n💠🔹\n💠🔹\n---\n\n𝕄𝕆𝔻𝕆 𝔸𝕃𝕃\n𝕆ℝ𝕋ℍ𝕆 ✅\n𝕄𝔼𝕊𝕊𝔸𝔾𝔼𝕊 𝔻𝔼𝕋𝔸ℂℍ𝔼𝕊 ✅\n𝕃𝕆𝕋𝕆⛔\n\n🏆 [ ${modoName.toUpperCase()} ]🏆`,

  `🌀🔱🛡️📿𝗛𝗘𝗥𝗕𝗢𝗚𝗘𝗡𝗜𝗦𝗧𝗘𝗦📿🛡️🔱🌀\n\n𝕄𝕆𝔻𝕆: @${modoName}\n\n---\n🔮🎐\n🔮🎐\n🔮🎐\n🔮🎐\n🔮🎐\n🔮🎐\n---\n\n𝕄𝕆𝔻𝕆 𝔸𝕃𝕃\n𝕆ℝ𝕋ℍ𝕆 ⛔\n𝕄𝔼𝕊𝕊𝔸𝔾𝔼𝕊 𝔻𝔼𝕋𝔸ℂℍ𝔼𝕊 ✅\n𝕃𝕆𝕋𝕆⛔\n\n🏆 [ ${modoName.toUpperCase()} ]🏆`,

  `🛸👾🔭🧬𝗛𝗘𝗥𝗕𝗢𝗚𝗘𝗡𝗜𝗦𝗧𝗘𝗦🧬🔭👾🛸\n\n𝕄𝕆𝔻𝕆: @${modoName}\n\n---\n🌌🛰️\n🌌🛰️\n🌌🛰️\n🌌🛰️\n🌌🛰️\n🌌🛰️\n---\n\n𝕄𝕆𝔻𝕆 𝔸𝕃𝕃\n𝕆ℝ𝕋ℍ𝕆 ✅\n𝕄𝔼𝕊𝕊𝔸𝔾𝔼𝕊 𝔻𝔼𝕋𝔸ℂℍ𝔼𝕊 ⛔\n𝕃𝕆𝕋𝕆✅\n\n🏆 [ ${modoName.toUpperCase()} ]🏆`,

  `🥷⚔️🉐🥋 𝗛𝗘𝗥𝗕𝗢𝗚𝗘𝗡𝗜𝗦𝗧𝗘𝗦🥋🉐⚔️🥷\n\n𝕄𝕆𝔻𝕆: @${modoName}\n\n---\n🈶🎎\n🈶🎎\n🈶🎎\n🈶🎎\n🈶🎎\n🈶🎎\n---\n\n𝕄𝕆𝔻𝕆 𝔸𝕃𝕃\n𝕆ℝ𝕋ℍ𝕆 ✅\n𝕄𝔼𝕊𝕊𝔸𝔾𝔼𝕊 𝔻𝔼𝕋𝔸ℂℍ𝔼𝕊 ✅\n𝕃𝕆𝕋𝕆✅\n\n🏆 [ ${modoName.toUpperCase()} ]🏆`
];

const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

message.reply(randomTemplate);

} };
