const fs = require("fs");
const path = require("path");

// Fichier pour stocker les données utilisateurs
const dataFile = path.join(__dirname, "aviator-data.json");

// Charger ou créer le fichier
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify({}));

// Fonction utilitaire
function loadData() {
  return JSON.parse(fs.readFileSync(dataFile));
}
function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// Sessions actives
const activeGames = {};

module.exports = {
  config: {
    name: "aviator",
    aliases: [],
    version: "1.0",
    author: "Merdi Madimba",
    role: 0,
    description: "Jeu de pari Aviator",
    category: "🎮 Jeux"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, senderID, messageID } = event;
    const data = loadData();
    if (!data[senderID]) data[senderID] = { money: 0, lastDaily: 0 };
    const user = data[senderID];
    const prefix = "/";

    // Vérifie le sous-commande
    const sub = args[0];

    // =======================
    // /aviator → message d’accueil + help
    // =======================
    if (!sub) {
      const imageURL = "https://i.ibb.co/xG7wPbC/aviator-game.jpg"; // ← change cette image
      return api.sendMessage({
        body:
`🎰 **Bienvenue dans Aviator !** ✈️
Le jeu de pari où tout se joue en une seconde !

💵 Commandes disponibles :
- ${prefix}aviator solde → voir ton solde
- ${prefix}aviator daily → obtenir 200$ chaque 24H
- ${prefix}aviator bet [montant] → parier
- ${prefix}aviator top → classement des 10 plus riches

⚠️ Mise minimale : 20$`,
        attachment: await global.utils.getStreamFromURL(imageURL)
      }, threadID, messageID);
    }

    // =======================
    // /aviator solde
    // =======================
    if (sub === "solde") {
      return api.sendMessage(`💰 Ton solde actuel est de : ${user.money}$`, threadID, messageID);
    }

    // =======================
    // /aviator daily
    // =======================
    if (sub === "daily") {
      const now = Date.now();
      if (now - user.lastDaily < 24 * 60 * 60 * 1000) {
        const remaining = Math.ceil((24 * 60 * 60 * 1000 - (now - user.lastDaily)) / (1000 * 60 * 60));
        return api.sendMessage(`🕒 Tu as déjà pris ton daily. Reviens dans ${remaining}h.`, threadID, messageID);
      }
      user.money += 200;
      user.lastDaily = now;
      saveData(data);
      return api.sendMessage(`✅ Tu as reçu 200$ de bonus quotidien !\n💵 Nouveau solde : ${user.money}$`, threadID, messageID);
    }

    // =======================
    // /aviator top
    // =======================
    if (sub === "top") {
      const sorted = Object.entries(data)
        .sort((a, b) => b[1].money - a[1].money)
        .slice(0, 10);
      const msg = sorted.map(([uid, u], i) => `${i + 1}. ${u.name || uid} → ${u.money}$`).join("\n");
      return api.sendMessage(`🏆 **Top 10 des plus riches :**\n${msg || "Aucun joueur pour le moment."}`, threadID, messageID);
    }

    // =======================
    // /aviator bet [montant]
    // =======================
    if (sub === "bet") {
      if (activeGames[threadID]) return api.sendMessage("⏳ Une partie est déjà en cours dans ce groupe !", threadID, messageID);
      const amount = parseFloat(args[1]);
      if (isNaN(amount) || amount < 20) return api.sendMessage("❌ Mise invalide. Mise minimale : 20$", threadID, messageID);
      if (user.money < amount) return api.sendMessage("❌ Tu n’as pas assez d’argent.", threadID, messageID);

      activeGames[threadID] = { player: senderID, bet: amount, state: "waiting" };

      return api.sendMessage(
        `💸 Tu veux parier ${amount}$ ?\nTape **1** pour confirmer.`,
        threadID,
        (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "aviator",
            type: "confirm",
            player: senderID,
            amount
          });
        },
        messageID
      );
    }
  },

  // =======================
  // Gestion des réponses
  // =======================
  onReply: async function ({ api, event, Reply }) {
    const { threadID, senderID, body } = event;
    const data = loadData();

    // Confirmation du pari
    if (Reply.type === "confirm") {
      if (senderID !== Reply.player) return;
      if (body.trim() !== "1") return api.sendMessage("❌ Confirmation annulée.", threadID);

      const user = data[senderID];
      if (user.money < Reply.amount) return api.sendMessage("❌ Solde insuffisant.", threadID);

      user.money -= Reply.amount;
      saveData(data);

      api.sendMessage(`✅ Pari confirmé ! Lancement du vol...`, threadID);
      activeGames[threadID] = {
        player: senderID,
        bet: Reply.amount,
        multiplier: 1.0,
        crashed: false,
        state: "running"
      };

      startAviatorGame(api, threadID, senderID, Reply.amount);
    }

    // Retrait d’argent (cash)
    if (body.trim().toLowerCase() === "cash") {
      const game = activeGames[threadID];
      if (!game || game.state !== "running") return;
      if (senderID !== game.player) return;

      if (game.crashed) return api.sendMessage("🚀 L’avion est déjà parti !", threadID);

      const gain = Math.floor(game.bet * game.multiplier);
      const data = loadData();
      data[senderID].money += gain;
      saveData(data);

      game.state = "finished";
      api.sendMessage(`💰 Tu as récupéré ${gain}$ à ${game.multiplier.toFixed(2)}x !`, threadID);
    }
  }
};

// =======================
// Fonction du jeu Aviator
// =======================
async function startAviatorGame(api, threadID, playerID, bet) {
  const game = activeGames[threadID];
  const crashPoint = randomCrashPoint();
  let multiplier = 1.0;

  const interval = setInterval(() => {
    if (multiplier >= crashPoint) {
      clearInterval(interval);
      game.crashed = true;
      game.state = "finished";
      api.sendMessage("🚀🔴 L’avion est parti ! Pari perdu.", threadID);
      delete activeGames[threadID];
      return;
    }

    multiplier += 0.5;
    api.sendMessage(`✈️ ${multiplier.toFixed(2)}x`, threadID);
  }, 2000);
}

// Probabilité de crash
function randomCrashPoint() {
  const r = Math.random() * 100;
  if (r < 50) return Math.random() * 14 + 1; // 1.00x à 15.00x (50%)
  if (r < 60) return Math.random() * 45 + 15.5; // 15.5x à 60x (10%)
  if (r < 70) return Math.random() * 49.5 + 50.5; // 50.5x à 100x (10%)
  if (r < 80) return Math.random() * 249.5 + 100.5; // 100.5x à 350x (10%)
  if (r < 85) return Math.random() * 149.5 + 350.5; // 350.5x à 500x (5%)
  return Math.random() * 9999500 + 500.5; // 500.5x à 10.000.000x (5%)
}
