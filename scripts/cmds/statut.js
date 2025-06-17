const fs = require("fs");
const path = __dirname + "/leaderboard.json";

module.exports = {
  config: {
    name: "statut",
    version: "1.0",
    author: "Merdi",
    role: 0,
    shortDescription: "Voir ton statut",
    longDescription: "Affiche ton nom, tes points et ton rang selon ton score",
    category: "📊 Utilitaire",
    guide: {
      en: "{p}statut <ton_nom>"
    }
  },

  onStart: async function ({ message, args }) {
    if (args.length === 0) return message.reply("❗Tu dois entrer ton nom : {p}statut <ton_nom>");

    const username = args.join(" ");
    let data = {};

    if (fs.existsSync(path)) {
      data = JSON.parse(fs.readFileSync(path));
    }

    const points = data[username];
    if (points === undefined) {
      return message.reply(`🙁 ${username} n'est pas enregistré dans le tableau de score.`);
    }

    // Déterminer le rang selon les points
    const getRank = (pts) => {
      const ranges = [
        [10, 100, "⚰️LES DÉCHETS DE LA SOCIÉTÉ 🚬"],
        [110, 400, "🔞🚮LES WOOBI 🏳️‍🌈"],
        [410, 600, "🤡LES AVORTONS💩"],
        [610, 1200, "🗣️LES INTERPRÈTES DE LEWIS ET CLARK🤝"],
        [1210, 1800, "🇻🇦LES SAGES DU VATICAN📜"],
        [1810, 2400, "🧠LES PHILOSOPHES HANDICAPÉ 🦉"],
        [2410, 3000, "🤔LES THÉORICIENS DES IDÉES 💡"],
        [3010, 3600, "👨‍🎨LES HOMMES DE LA RENAISSANCE 🔬"],
        [3610, 4200, "🍎LES THÉORICIENS DE LA RELATIVITÉ 🕢"],
        [4210, 4800, "🧙‍♂️LES ENCHANTEURS DE LA LÉGENDE ARTHURIENNE 🔮"],
        [4810, 5400, "🍎LES PÈRES DE LA PHYSIQUE CLASSIQUE 🤯"],
        [5410, 6000, "🙏LES MISSIONNAIRES EXPLORATEURS D'AFRIQUE 🦁"],
        [6010, 6600, "🗺️LES NAVIGATEURS DU GLOBE🌍"],
        [6610, 7200, "⚓LES AMIRAUX CHINOIS 🇨🇳"],
        [7210, 7800, "🌃LES MAÎTRES DES TROUS NOIRS⚫"],
        [7810, 8400, "⚓LES AMIRAUX DE LA MER OCÉANE 🌊"],
        [8410, 9000, "🧠LES PROPHÈTES DU SURHOMME 🚀"],
        [9010, 10600, "⚔️LES CORSAIRES DE LA REINE 👑"],
        [10610, 12600, "🤝 PHILANTHROPE ❤️"],
        [12610, 14600, "👨‍🌾 PIONNIER DE PONTYPANDY🛤️"],
        [14610, 16600, "✊ ABOLITIONNISTE ⛓️"],
        [16610, 18600, "🎨 MÉCÈNE 💰"],
        [18610, 20600, "🕊️ FONDATEUR D'ORDRE RELIGIEUX📕"],
        [20610, 22600, "✍️REFORMATEUR RELIGIEUX✝️"],
        [22610, 24600, "🏰 SEIGNEUR FEODAL🌾"],
        [24610, 26600, "🛡️ CHEF DE GUERRE TRIBAL🏹"]
      ];

      for (const [min, max, rank] of ranges) {
        if (pts >= min && pts <= max) return rank;
      }
      return "🚫 Rang inconnu (hors catégorie)";
    };

    const rank = getRank(points);

    const replyMsg = `👤 Nom : ${username}\n🏅 Points : ${points}\n🎖️ Rang : ${rank}`;
    return message.reply(replyMsg);
  }
};
