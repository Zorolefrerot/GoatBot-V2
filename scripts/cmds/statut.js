 const fs = require("fs");
const path = require("path");

// Chemin vers le fichier de leaderboard
const filePath = path.join(__dirname, "data", "leaderboard.json");

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
    const nom = args.join(" ");

    if (!nom || !data[nom]) return message.reply("❌ Ce nom n'est pas enregistré dans le leaderboard.");

    const score = data[nom];
    let rang = "🔘 Aucun rang";

    // Définir le rang selon les points
    if (score >= 10 && score <= 100) rang = "⚰️LES DÉCHETS DE LA SOCIÉTÉ 🚬";
    else if (score >= 110 && score <= 400) rang = "🔞🚮LES WOOBI 🏳️‍🌈";
    else if (score >= 410 && score <= 600) rang = "🤡LES AVORTONS💩";
    else if (score >= 610 && score <= 1200) rang = "🗣️LES INTERPRÈTES DE LEWIS ET CLARK🤝";
    else if (score >= 1210 && score <= 1800) rang = "🇻🇦LES SAGES DU VATICAN📜";
    else if (score >= 1810 && score <= 2400) rang = "🧠LES PHILOSOPHES HANDICAPÉ 🦉";
    else if (score >= 2410 && score <= 3000) rang = "🤔LES THÉORICIENS DES IDÉES 💡";
    else if (score >= 3010 && score <= 3600) rang = "👨‍🎨LES HOMMES DE LA RENAISSANCE 🔬";
    else if (score >= 3610 && score <= 4200) rang = "🍎LES THÉORICIENS DE LA RELATIVITÉ 🕢";
    else if (score >= 4210 && score <= 4800) rang = "🧙‍♂️LES ENCHANTEURS DE LA LÉGENDE ARTHURIENNE 🔮";
    else if (score >= 4810 && score <= 5400) rang = "🍎LES PÈRES DE LA PHYSIQUE CLASSIQUE 🤯";
    else if (score >= 5410 && score <= 6000) rang = "🙏LES MISSIONNAIRES EXPLORATEURS D'AFRIQUE 🦁";
    else if (score >= 6010 && score <= 6600) rang = "🗺️LES NAVIGATEURS DU GLOBE🌍";
    else if (score >= 6610 && score <= 7200) rang = "⚓LES AMIRAUX CHINOIS 🇨🇳";
    else if (score >= 7210 && score <= 7800) rang = "🌃LES MAÎTRES DES TROUS NOIRS⚫";
    else if (score >= 7810 && score <= 8400) rang = "⚓LES AMIRAUX DE LA MER OCÉANE 🌊";
    else if (score >= 8410 && score <= 9000) rang = "🧠LES PROPHÈTES DU SURHOMME 🚀";
    else if (score >= 9010 && score <= 10600) rang = "⚔️LES CORSAIRES DE LA REINE 👑";
    else if (score >= 10610 && score <= 12600) rang = "🤝 PHILANTHROPE ❤️";
    else if (score >= 12610 && score <= 14600) rang = "👨‍🌾 PIONNIER DE PONTYPANDY🛤️";
    else if (score >= 14610 && score <= 16600) rang = "✊ ABOLITIONNISTE ⛓️";
    else if (score >= 16610 && score <= 18600) rang = "🎨 MÉCÈNE 💰";
    else if (score >= 18610 && score <= 20600) rang = "🕊️ FONDATEUR D'ORDRE RELIGIEUX📕";
    else if (score >= 20610 && score <= 22600) rang = "✍️REFORMATEUR RELIGIEUX✝️";
    else if (score >= 22610 && score <= 24600) rang = "🏰 SEIGNEUR FEODAL🌾";
    else if (score >= 24610 && score <= 26600) rang = "🛡️ CHEF DE GUERRE TRIBAL🏹";

    return message.reply(`👤 Nom : ${nom}\n📊 Points : ${score}\n🎖️ Rang : ${rang}`);
  }
};
