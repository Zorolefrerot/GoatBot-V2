const fs = require("fs");
const path = require("path");

// === FICHIER DE SAUVEGARDE ===
const dataFile = path.join(__dirname, "aviator-data.json");
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify({}));

function loadData() {
  try {
    return JSON.parse(fs.readFileSync(dataFile));
  } catch {
    return {};
  }
}

function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

const activeGames = {}; // parties actives par salon

module.exports = {
  config: {
    name: "aviator",
    version: "6.0",
    author: "Merdi Madimba",
    role: 0,
    category: "🎮 Jeux",
    description: "Jeu de pari Aviator ✈️ réaliste et imprévisible jusqu’à 500 000x — commandes via /aviator ou /av",
    aliases: ["av"]
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, senderID, messageID } = event;
    const data = loadData();

    if (!data[senderID]) data[senderID] = { money: 0, lastDaily: 0, name: "" };

    if (!data[senderID].name) {
      try {
        const info = await api.getUserInfo(senderID);
        data[senderID].name = info[senderID]?.name || "Joueur inconnu";
      } catch {
        data[senderID].name = "Joueur inconnu";
      }
      saveData(data);
    }

    const user = data[senderID];
    const sub = args[0]?.toLowerCase();

    // === MENU PRINCIPAL ===
    if (!sub) {
      const imageURL = "http://goatbiin.onrender.com/QOehEbv-y.jpg";
      const body = `🎰 **Bienvenue dans Aviator !** ✈️
💸 Jeu de pari rapide et risqué
🔥 Gagne jusqu’à 500 000x !

📣 **Commandes disponibles :**
• /aviator bet [montant] → lancer une mise (min 20$)
• /aviator solde → voir ton solde
• /aviator daily → réclamer 200$ / jour
• /aviator cash → retirer l'argent durant le vol (seul le joueur)
• /aviator top → top 10 des plus riches
• /aviator help → aide rapide

⚠️ Seul le joueur ayant lancé la partie peut utiliser cash pendant le vol.`;

      try {
        return api.sendMessage({ body, attachment: await global.utils.getStreamFromURL(imageURL) }, threadID, messageID);
      } catch {
        return api.sendMessage(body, threadID, messageID);
      }
    }

    // === SOUS-COMMANDES ===
    switch (sub) {
      case "help":
        return api.sendMessage(`📘 **Aide Aviator**
• /aviator bet [montant] → proposer une mise
• /aviator solde → voir ton solde
• /aviator daily → réclamer 200$ / jour
• /aviator cash → retirer l'argent durant le vol
• /aviator top → top 10 des plus riches`, threadID);

      case "solde": {
        const usr = data[senderID];
        return api.sendMessage(`💰 ${usr.name}, ton solde est de **${usr.money}$**.`, threadID);
      }

      case "daily": {
        const usr = data[senderID];
        const now = Date.now();
        if (now - (usr.lastDaily || 0) < 24 * 60 * 60 * 1000) {
          const h = Math.ceil((24 * 60 * 60 * 1000 - (now - (usr.lastDaily || 0))) / (1000 * 60 * 60));
          return api.sendMessage(`🕒 Reviens dans ${h}h pour réclamer ton bonus.`, threadID);
        }
        usr.money += 200;
        usr.lastDaily = now;
        saveData(data);
        return api.sendMessage(`✅ Tu as reçu **200$** ! Nouveau solde : ${usr.money}$`, threadID);
      }

      case "top": {
        const sorted = Object.entries(data)
          .sort((a, b) => b[1].money - a[1].money)
          .slice(0, 10);
        const msg = sorted.map(([id, u], i) => `${i + 1}. 🏅 ${u.name || `Joueur-${id}`} → ${u.money}$`).join("\n");
        return api.sendMessage(`🏆 **Top 10 des plus riches :**\n\n${msg}`, threadID);
      }

      case "bet": {
        const amount = parseFloat(args[1]);
        if (!amount || amount < 20) return api.sendMessage("❌ Montant invalide. Mise minimale : 20$", threadID);
        if (data[senderID].money < amount) return api.sendMessage("❌ Solde insuffisant.", threadID);

        if (activeGames[threadID]) return api.sendMessage("⏳ Une partie est déjà en cours dans ce salon. Attends la fin.", threadID);

        // Déduire directement la mise et lancer le jeu
        data[senderID].money -= amount;
        saveData(data);

        startAviatorGame(api, threadID, senderID, amount);
        return api.sendMessage(`💸 ${data[senderID].name} a misé **${amount}$**. L’avion décolle ! 🚀 Utilise /aviator cash pour retirer avant le crash.`, threadID);
      }

      case "cash": {
        const game = activeGames[threadID];
        if (!game || game.player !== senderID) return api.sendMessage("🚫 Aucune partie en cours pour toi dans ce salon.", threadID);
        if (game.crashed || game.state !== "running") return api.sendMessage("🚀 Trop tard ! L’avion est déjà parti 💥", threadID);

        const gain = Math.floor(game.bet * game.multiplier);
        data[senderID].money += gain;
        saveData(data);

        clearInterval(game.interval);
        delete activeGames[threadID];

        return api.sendMessage(`💰 Retrait réussi à **${game.multiplier.toFixed(2)}x** ! Tu gagnes **${gain}$** 🎉`, threadID);
      }

      default:
        return api.sendMessage("⚠️ Sous-commande inconnue. Tape /aviator help pour voir la liste.", threadID);
    }
  }
};

// === LOGIQUE DU JEU AVIATOR ===
async function startAviatorGame(api, threadID, playerID, bet) {
  const data = loadData();
  const user = data[playerID];

  const game = activeGames[threadID] = {
    player: playerID,
    bet,
    multiplier: 1.0,
    crashed: false,
    state: "running"
  };

  const crashPoint = generateCrashPoint();
  api.sendMessage(`🛫 Le vol commence ! Utilise /aviator cash pour retirer avant que l’avion s’écrase ! 💥`, threadID);

  game.interval = setInterval(() => {
    if (!activeGames[threadID]) return clearInterval(game.interval);

    let jump = Math.random() * (game.multiplier < 5 ? 1.2 : game.multiplier < 20 ? 3 : game.multiplier < 100 ? 10 : 50);
    game.multiplier += jump;

    if (Math.random() < 0.03 || game.multiplier >= crashPoint) {
      clearInterval(game.interval);
      game.crashed = true;
      game.state = "finished";
      api.sendMessage(`💥 L’avion a explosé à **${game.multiplier.toFixed(2)}x** ! ${user.name} a tout perdu 😭`, threadID);
      delete activeGames[threadID];
      return;
    }

    const effect = ["✈️", "🚀", "💨", "🔥"][Math.floor(Math.random() * 4)];
    api.sendMessage(`${effect} Multiplicateur : **${game.multiplier.toFixed(2)}x**`, threadID);
  }, 1200);
}

// === POINT DE CRASH ALÉATOIRE ===
function generateCrashPoint() {
  const r = Math.random() * 100;
  if (r < 50) return 1 + Math.random() * 1.5;
  if (r < 70) return 2.5 + Math.random() * 7.5;
  if (r < 80) return 10 + Math.random() * 40;
  if (r < 85) return 50 + Math.random() * 150;
  if (r < 90) return 200 + Math.random() * 300;
  if (r < 95) return 500 + Math.random() * 4500;
  if (r < 97) return 5000 + Math.random() * 20000;
  if (r < 99) return 25000 + Math.random() * 75000;
  return 100000 + Math.random() * 400000;
}
