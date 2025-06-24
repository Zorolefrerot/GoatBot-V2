const fs = require("fs");
const path = require("path");

// 📦 Chemin du leaderboard
const filePath = path.join(__dirname, "..", "..", "storage", "leaderboard.json");

module.exports = {
  config: {
    name: "statut",
    version: "1.0",
    author: "Merdi Madimba",
    shortDescription: "Voir ton statut dans le classement",
    longDescription: "Affiche le score et le rang d’un utilisateur depuis le leaderboard",
    category: "📊 Utilitaire",
    guide: {
      en: "{p}statut <nom>"
    }
  },

  onStart: async function ({ message, args }) {
    if (!fs.existsSync(filePath)) return message.reply("❌ Aucun leaderboard trouvé.");

    const data = JSON.parse(fs.readFileSync(filePath));
    const nom = args.join(" ").trim();

    if (!nom || !data[nom]) return message.reply("❌ Ce nom n'est pas enregistré dans le leaderboard.");

    const score = data[nom];
    let rang = "🔘 Aucun rang";

    // 🎖️ Attribution du rang selon le score
    if (score >= 10 && score <= 100) rang = "⚰️ LES DÉCHETS DE LA SOCIÉTÉ 🚬";
    else if (score <= 400) rang = "🔞🚮 LES WOOBI 🏳️‍🌈";
    else if (score <= 600) rang = "🤡 LES AVORTONS 💩";
    else if (score <= 1200) rang = "🗣️ LES INTERPRÈTES DE LEWIS ET CLARK 🤝";
    else if (score <= 1800) rang = "🇻🇦 LES SAGES DU VATICAN 📜";
    else if (score <= 2400) rang = "🧠 LES PHILOSOPHES HANDICAPÉS 🦉";
    else if (score <= 3000) rang = "🤔 LES THÉORICIENS DES IDÉES 💡";
    else if (score <= 3600) rang = "👨‍🎨 LES HOMMES DE LA RENAISSANCE 🔬";
    else if (score <= 4200) rang = "🍎 LES THÉORICIENS DE LA RELATIVITÉ 🕢";
    else if (score <= 4800) rang = "🧙‍♂️ LES ENCHANTEURS ARTHURIENS 🔮";
    else if (score <= 5400) rang = "📘 LES PÈRES DE LA PHYSIQUE CLASSIQUE 🤯";
    else if (score <= 6000) rang = "🙏 LES MISSIONNAIRES EXPLORATEURS 🦁";
    else if (score <= 6600) rang = "🗺️ LES NAVIGATEURS DU GLOBE 🌍";
    else if (score <= 7200) rang = "⚓ LES AMIRAUX CHINOIS 🇨🇳";
    else if (score <= 7800) rang = "🌃 LES MAÎTRES DES TROUS NOIRS ⚫";
    else if (score <= 8400) rang = "🌊 LES AMIRAUX DE L'OCÉAN";
    else if (score <= 9000) rang = "🧠 LES PROPHÈTES DU SURHOMME 🚀";
    else if (score <= 10600) rang = "⚔️ LES CORSAIRES DE LA REINE 👑";
    else if (score <= 12600) rang = "🤝 PHILANTHROPES ❤️";
    else if (score <= 14600) rang = "👨‍🌾 PIONNIERS DE PONTYPANDY 🛤️";
    else if (score <= 16600) rang = "✊ ABOLITIONNISTES ⛓️";
    else if (score <= 18600) rang = "🎨 MÉCÈNES 💰";
    else if (score <= 20600) rang = "🕊️ FONDATEURS RELIGIEUX 📕";
    else if (score <= 22600) rang = "✍️ RÉFORMATEURS RELIGIEUX ✝️";
    else if (score <= 24600) rang = "🏰 SEIGNEURS FÉODAUX 🌾";
    else if (score <= 26600) rang = "🛡️ CHEFS DE GUERRE TRIBAUX 🏹";
    else rang = "🌟 LÉGENDE ABSOLUE 🐐";

    return message.reply(
      `👤 Nom : ${nom}\n📊 Points : ${score}\n🎖️ Rang : ${rang}`
    );
  }
};
