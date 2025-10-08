const fs = require("fs");
const path = require("path");

// === FICHIER DE SAUVEGARDE ===
const dataFile = path.join(__dirname, "aviator-data.json");
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify({}));

function loadData() {
  return JSON.parse(fs.readFileSync(dataFile));
}
function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

const activeGames = {}; // jeux par salon

module.exports = {
  config: {
    name: "aviator",
    version: "5.1",
    author: "Merdi Madimba",
    role: 0,
    category: "🎮 Jeux",
    description: "Jeu de pari Aviator ✈️ réaliste et imprévisible jusqu’à 500 000x"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, senderID, messageID } = event;
    const data = loadData();
    if (!data[senderID]) data[senderID] = { money: 0, lastDaily: 0, name: "" };

    // récupérer nom utilisateur
    if (!data[senderID].name) {
      try {
        const info = await api.getUserInfo(senderID);
        data[senderID].name = info[senderID].name || "Joueur inconnu";
      } catch {
        data[senderID].name = "Joueur inconnu";
      }
      saveData(data);
    }

    const prefix = "/";
    const sub = args[0];
    const user = data[senderID];

    // === MENU D’ACCUEIL ===
    if (!sub) {
      const imageURL = "http://goatbiin.onrender.com/QOehEbv-y.jpg";
      return api.sendMessage({
        body: `🎰 **Bienvenue dans Aviator !** ✈️  
🔥 Jeu de pari ultra rapide et risqué !  
💸 Gagne jusqu’à **500 000x** ta mise !  

💵 **Commandes :**
- ${prefix}aviator solde → voir ton solde  
- ${prefix}aviator daily → obtenir 200$ / jour  
- ${prefix}aviator bet [montant] → lancer une partie  
- ${prefix}aviator top → classement des riches  
💥 Tape **2** pour retirer ton argent avant que l’avion s’écrase ! 🚀`,
        attachment: await global.utils.getStreamFromURL(imageURL)
      }, threadID, messageID);
    }

    // === SOLDE ===
    if (sub === "solde") {
      return api.sendMessage(`💰 ${user.name}, ton solde est de **${user.money}$**.`, threadID, messageID);
    }

    // === DAILY ===
    if (sub === "daily") {
      const now = Date.now();
      if (now - user.lastDaily < 24 * 60 * 60 * 1000) {
        const h = Math.ceil((24 * 60 * 60 * 1000 - (now - user.lastDaily)) / (1000 * 60 * 60));
        return api.sendMessage(`🕒 Reviens dans ${h}h pour réclamer ton bonus.`, threadID, messageID);
      }
      user.money += 200;
      user.lastDaily = now;
      saveData(data);
      return api.sendMessage(`✅ Tu as reçu **200$** ! Nouveau solde : ${user.money}$`, threadID, messageID);
    }

    // === TOP 10 ===
    if (sub === "top") {
      const sorted = Object.entries(data)
        .sort((a, b) => b[1].money - a[1].money)
        .slice(0, 10);
      const msg = sorted.map(([id, u], i) => `${i + 1}. 🏅 ${u.name} → ${u.money}$`).join("\n");
      return api.sendMessage(`🏆 **Top 10 des plus riches :**\n\n${msg}`, threadID);
    }

    // === PARI ===
    if (sub === "bet") {
      if (activeGames[threadID]) return api.sendMessage("⏳ Une partie est déjà en cours ici !", threadID);
      const amount = parseFloat(args[1]);
      if (isNaN(amount) || amount < 20) return api.sendMessage("❌ Mise minimale : 20$", threadID);
      if (user.money < amount) return api.sendMessage("❌ Solde insuffisant.", threadID);

      activeGames[threadID] = { player: senderID, bet: amount, state: "waiting" };
      return api.sendMessage(
        `💸 Tu veux miser **${amount}$** ? Tape **1** pour confirmer.`,
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

  // === GESTION DES RÉPONSES ===
  onReply: async function ({ api, event, Reply }) {
    const { threadID, senderID, body } = event;
    const data = loadData();

    // --- Confirmation du pari ---
    if (Reply.type === "confirm") {
      if (senderID !== Reply.player) return;
      if (body.trim() !== "1") return api.sendMessage("❌ Confirmation annulée.", threadID);

      const user = data[senderID];
      if (user.money < Reply.amount) return api.sendMessage("❌ Solde insuffisant.", threadID);
      user.money -= Reply.amount;
      saveData(data);

      api.sendMessage(`✅ Pari confirmé ! L’avion décolle... 🚀`, threadID);
      startAviatorGame(api, threadID, senderID, Reply.amount);
    }

    // --- Retrait en direct avec "2" ---
    if (body.trim() === "2") {
      const game = activeGames[threadID];
      if (!game || game.player !== senderID) return;
      if (game.crashed || game.state !== "running") return api.sendMessage("🚀 Trop tard ! L’avion est déjà parti 💥", threadID);

      const gain = Math.floor(game.bet * game.multiplier);
      const data = loadData();
      data[senderID].money += gain;
      saveData(data);

      clearInterval(game.interval);
      delete activeGames[threadID];

      return api.sendMessage(`💰 Retrait réussi à **${game.multiplier.toFixed(2)}x** ! Tu gagnes **${gain}$** 🎉`, threadID);
    }
  }
};

// === LOGIQUE DU JEU ===
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
  api.sendMessage(`🛫 Le vol commence ! Tape **2** pour retirer avant que l’avion s’écrase ! 💥`, threadID);

  game.interval = setInterval(() => {
    if (!activeGames[threadID]) return clearInterval(game.interval);

    if (Math.random() < 0.1) return; // pause aléatoire

    let jump = Math.random() * (game.multiplier < 5 ? 1.2 : game.multiplier < 20 ? 3 : game.multiplier < 100 ? 10 : 50);
    game.multiplier += jump;

    // crash aléatoire avant la fin
    if (Math.random() < 0.03) {
      clearInterval(game.interval);
      game.crashed = true;
      game.state = "finished";
      api.sendMessage(`💥 L’avion a explosé soudainement à **${game.multiplier.toFixed(2)}x** ! ${user.name} a tout perdu 😭`, threadID);
      delete activeGames[threadID];
      return;
    }

    // crash programmé
    if (game.multiplier >= crashPoint) {
      clearInterval(game.interval);
      game.crashed = true;
      game.state = "finished";
      api.sendMessage(`🔥 L’avion s’est écrasé à **${crashPoint.toFixed(2)}x** ! ${user.name} a tout perdu 😭`, threadID);
      delete activeGames[threadID];
      return;
    }

    const effect = ["✈️", "🚀", "💨", "🔥"][Math.floor(Math.random() * 4)];
    api.sendMessage(`${effect} Multiplicateur : **${game.multiplier.toFixed(2)}x**`, threadID);
  }, 1200);
}

// === GÉNÉRATION DU POINT DE CRASH ===
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
