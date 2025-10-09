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

// === EXPORT COMMANDE ===
module.exports = {
  config: {
    name: "aviator",
    version: "5.2",
    author: "Merdi Madimba",
    role: 0,
    category: "🎮 Jeux",
    description: "Jeu de pari Aviator ✈️ réaliste et imprévisible jusqu’à 500 000x — commandes via @"
  },

  // === DÉMARRAGE DE LA COMMANDE ===
  onStart: async function ({ api, event, args }) {
    const { threadID, senderID, messageID } = event;
    const data = loadData();

    if (!data[senderID]) data[senderID] = { money: 0, lastDaily: 0, name: "" };

    // récupérer nom utilisateur si vide
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
    const sub = args[0]; // compatibilité /aviator <sub>

    // === MENU D’ACCUEIL ===
    if (!sub) {
      const imageURL = "http://goatbiin.onrender.com/QOehEbv-y.jpg";
      const body = `🎰 **Bienvenue dans Aviator !** ✈️
🔥 Jeu de pari ultra-rapide et risqué !
💸 Gagne jusqu’à **500 000x** ta mise !

📣 **NOUVEAU :** Utilise les commandes commençant par **@** :
• \`@bet [montant]\` → placer une mise (ex : @bet 100)  
• \`@solde\` → voir ton solde  
• \`@daily\` → réclamer 200$ / jour  
• \`@cash\` ou \`2\` → retirer l'argent durant le vol (uniquement le joueur qui a lancé)  
• \`@top\` → classement des riches  
• \`@help\` → aide rapide

⚠️ Important : quand une partie est en cours dans le salon, **seul le joueur qui a lancé la partie** pourra utiliser les commandes @ liées à la partie (ex: @cash).`;

      try {
        return api.sendMessage({ body, attachment: await global.utils.getStreamFromURL(imageURL) }, threadID, messageID);
      } catch {
        return api.sendMessage(body, threadID, messageID);
      }
    }

    // Si sous-arguments passés, on indique d’utiliser @ maintenant
    return api.sendMessage("ℹ️ Utilise maintenant les commandes avec @, ex: `@bet 100`.", threadID, messageID);
  },

  // === GESTION DES RÉPONSES COMMENCANT PAR @ ===
  onReply: async function ({ api, event, Reply }) {
    const { threadID, senderID, body } = event;
    if (!body) return;
    const data = loadData();
    const text = body.trim();
    const lower = text.toLowerCase();
    const game = activeGames[threadID];

    // --- Confirmation de pari ---
    if (Reply && Reply.type === "confirm") {
      if (senderID !== Reply.player) return;
      if (body.trim() !== "1") return api.sendMessage("❌ Confirmation annulée.", threadID);

      const user = data[senderID];
      if (!user) return api.sendMessage("❌ Utilisateur introuvable.", threadID);
      if (user.money < Reply.amount) return api.sendMessage("❌ Solde insuffisant.", threadID);

      user.money -= Reply.amount;
      saveData(data);

      api.sendMessage(`✅ Pari confirmé ! L’avion décolle... 🚀`, threadID);
      startAviatorGame(api, threadID, senderID, Reply.amount);
      return;
    }

    // --- Si message non @ et pas "2", on ignore ---
    if (!lower.startsWith("@") && text !== "2") return;

    // --- Helper pour bloquer les non-joueurs ---
    function denyIfNotPlayer() {
      if (game && game.player && senderID !== game.player) {
        api.sendMessage(`⛔ Une partie est en cours dans ce salon. Seul ${game.player === senderID ? "toi" : "le joueur ayant lancé la partie"} peut utiliser les commandes @.`, threadID);
        return true;
      }
      return false;
    }

    // --- Retrait rapide "2" ---
    if (text === "2") {
      if (!game || game.player !== senderID) return;
      if (game.crashed || game.state !== "running") return api.sendMessage("🚀 Trop tard ! L’avion est déjà parti 💥", threadID);

      const gain = Math.floor(game.bet * game.multiplier);
      const dataFresh = loadData();
      if (!dataFresh[senderID]) dataFresh[senderID] = { money: 0, lastDaily: 0, name: "" };
      dataFresh[senderID].money += gain;
      saveData(dataFresh);

      clearInterval(game.interval);
      delete activeGames[threadID];

      return api.sendMessage(`💰 Retrait réussi à **${game.multiplier.toFixed(2)}x** ! Tu gagnes **${gain}$** 🎉`, threadID);
    }

    // --- Commandes @ ---
    const parts = text.split(/\s+/);
    const cmd = parts[0].toLowerCase();

    // @help
    if (cmd === "@help") {
      const help = `📘 **Aide Aviator**
• \`@bet [montant]\` → proposer une mise et confirmer avec **1**
• \`@solde\` → voir ton solde
• \`@daily\` → réclamer 200$ / 24h
• \`@cash\` ou \`2\` → retirer pendant le vol (seul le joueur qui a lancé la partie)
• \`@top\` → top 10 des plus riches`;
      return api.sendMessage(help, threadID);
    }

    // @solde
    if (cmd === "@solde") {
      if (denyIfNotPlayer()) return;
      const usr = data[senderID] || { money: 0, name: `Joueur-${senderID}` };
      return api.sendMessage(`💰 ${usr.name}, ton solde est de **${usr.money}$**.`, threadID);
    }

    // @daily
    if (cmd === "@daily") {
      if (denyIfNotPlayer()) return;
      if (!data[senderID]) data[senderID] = { money: 0, lastDaily: 0, name: "" };
      const now = Date.now();
      if (now - (data[senderID].lastDaily || 0) < 24 * 60 * 60 * 1000) {
        const h = Math.ceil((24 * 60 * 60 * 1000 - (now - (data[senderID].lastDaily || 0))) / (1000 * 60 * 60));
        return api.sendMessage(`🕒 Reviens dans ${h}h pour réclamer ton bonus.`, threadID);
      }
      data[senderID].money += 200;
      data[senderID].lastDaily = now;
      saveData(data);
      return api.sendMessage(`✅ Tu as reçu **200$** ! Nouveau solde : ${data[senderID].money}$`, threadID);
    }

    // @top
    if (cmd === "@top") {
      if (denyIfNotPlayer()) return;
      const sorted = Object.entries(data)
        .sort((a, b) => b[1].money - a[1].money)
        .slice(0, 10);
      const msg = sorted.map(([id, u], i) => `${i + 1}. 🏅 ${u.name || `Joueur-${id}`} → ${u.money}$`).join("\n");
      return api.sendMessage(`🏆 **Top 10 des plus riches :**\n\n${msg}`, threadID);
    }

    // @cash
    if (cmd === "@cash") {
      if (!game || game.player !== senderID) return;
      if (game.crashed || game.state !== "running") return api.sendMessage("🚀 Trop tard ! L’avion est déjà parti 💥", threadID);

      const gain = Math.floor(game.bet * game.multiplier);
      if (!data[senderID]) data[senderID] = { money: 0, lastDaily: 0, name: "" };
      data[senderID].money += gain;
      saveData(data);

      clearInterval(game.interval);
      delete activeGames[threadID];

      return api.sendMessage(`💰 Retrait réussi à **${game.multiplier.toFixed(2)}x** ! Tu gagnes **${gain}$** 🎉`, threadID);
    }

    // @bet
    if (cmd === "@bet") {
      if (game) return api.sendMessage("⏳ Une partie est déjà en cours dans ce salon. Attends la fin avant d'en lancer une autre.", threadID);

      const amount = parseFloat(parts[1]);
      if (isNaN(amount) || amount < 20) return api.sendMessage("❌ Montant invalide. Mise minimale : 20$", threadID);
      if (data[senderID].money < amount) return api.sendMessage("❌ Solde insuffisant.", threadID);

      activeGames[threadID] = { player: senderID, bet: amount, state: "waiting" };
      return api.sendMessage(
        `💸 ${data[senderID].name}, tu veux miser **${amount}$** ? Réponds **1** à ce message pour confirmer.`,
        threadID,
        (err, info) => {
          try {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "aviator",
              type: "confirm",
              player: senderID,
              amount
            });
          } catch {
            delete activeGames[threadID];
          }
        }
      );
    }

    // @ inconnue
    return api.sendMessage("⚠️ Commande @ inconnue. Tape `@help` pour voir la liste des commandes.", threadID);
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
  api.sendMessage(`🛫 Le vol commence ! Tape **@cash** ou envoie **2** pour retirer avant que l’avion s’écrase ! 💥`, threadID);

  game.interval = setInterval(() => {
    if (!activeGames[threadID]) return clearInterval(game.interval);

    // multiplier aléatoire
    let jump = Math.random() * (game.multiplier < 5 ? 1.2 : game.multiplier < 20 ? 3 : game.multiplier < 100 ? 10 : 50);
    game.multiplier += jump;

    // crash aléatoire
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
