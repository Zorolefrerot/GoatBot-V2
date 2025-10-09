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
    version: "5.2",
    author: "Merdi Madimba",
    role: 0,
    category: "🎮 Jeux",
    description: "Jeu de pari Aviator ✈️ réaliste et imprévisible jusqu’à 500 000x — commandes via @"
  },

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
    const sub = args[0]; // si utilisé avec /aviator <sub> (on conserve compatibilité)

    // === MENU D’ACCUEIL (explique l'utilisation des @) ===
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

⚠️ Important : quand une partie est en cours dans le salon, **seul le joueur qui a lancé la partie** pourra utiliser les commandes `@` liées à la partie (ex: @cash).`;

      try {
        return api.sendMessage({ body, attachment: await global.utils.getStreamFromURL(imageURL) }, threadID, messageID);
      } catch {
        return api.sendMessage(body, threadID, messageID);
      }
    }

    // Si l'utilisateur a passé des sous-arguments via /aviator sub (compatibilité minimale)
    // on laisse tomber la logique sub ici car tout est géré via @ maintenant.
    return api.sendMessage("ℹ️ Utilise maintenant les commandes avec @, ex: `@bet 100`.", threadID, messageID);
  },

  // === GESTION DES RÉPONSES / MESSAGES COMMENÇANT PAR @ ===
  onReply: async function ({ api, event, Reply }) {
    const { threadID, senderID, body } = event;
    if (!body) return;
    const data = loadData();

    // --- Gestion des confirmations envoyées par le bot (callback pour "1" confirmation) ---
    if (Reply && Reply.type === "confirm") {
      if (senderID !== Reply.player) return; // seul le joueur qui a demandé peut confirmer
      if (body.trim() !== "1") return api.sendMessage("❌ Confirmation annulée.", threadID);
      const user = data[senderID];
      if (!user) return api.sendMessage("❌ Utilisateur introuvable.", threadID);
      if (user.money < Reply.amount) return api.sendMessage("❌ Solde insuffisant.", threadID);
      // retirer la mise et lancer jeu
      user.money -= Reply.amount;
      saveData(data);
      api.sendMessage(`✅ Pari confirmé ! L’avion décolle... 🚀`, threadID);
      startAviatorGame(api, threadID, senderID, Reply.amount);
      return;
    }

    // --- Gestions des messages commençant par @ ou du "2" pour retrait rapide ---
    const text = body.trim();
    const lower = text.toLowerCase();

    // si ce n'est pas une commande @ et pas "2", on ignore
    if (!lower.startsWith("@") && text !== "2") return;

    // si une partie est active dans ce salon et que l'émetteur n'est pas le joueur,
    // on ignore les commandes liées à la partie (sauf topo général ou solde/daily — on choisit d'appliquer la règle pour tout @)
    const game = activeGames[threadID];

    // Helper pour répondre aux non-joueurs quand partie active
    function denyIfNotPlayer() {
      if (game && game.player && senderID !== game.player) {
        api.sendMessage(`⛔ Une partie est en cours dans ce salon. Seul ${game.player === senderID ? "toi" : "le joueur ayant lancé la partie"} peut utiliser les commandes @ pendant la partie.`, threadID);
        return true;
      }
      return false;
    }

    // -- Commande de retrait rapide "2" (conserve ancien raccourci) --
    if (text === "2") {
      if (!game || game.player !== senderID) return; // pas de partie ou pas le joueur
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

    // -- commandes @ ...
    const parts = text.split(/\s+/); // sépare par espace
    const cmd = parts[0].toLowerCase(); // ex: "@bet", "@solde", "@cash"...

    // @help : aide rapide (toujours accessible)
    if (cmd === "@help") {
      const help = `📘 **Aide Aviator**
• \`@bet [montant]\` → proposer une mise et confirmer avec **1**
• \`@solde\` → voir ton solde
• \`@daily\` → réclamer 200$ / 24h
• \`@cash\` ou \`2\` → retirer pendant le vol (seul le joueur qui a lancé la partie)
• \`@top\` → top 10 des plus riches`;
      return api.sendMessage(help, threadID);
    }

    // @solde : accessible (mais si partie activée, on bloque si sender != player)
    if (cmd === "@solde") {
      if (game && game.player && senderID !== game.player) return api.sendMessage("⛔ Une partie est en cours ici. Seul le joueur peut utiliser @ pendant la partie.", threadID);
      const dataFresh = loadData();
      const usr = dataFresh[senderID] || { money: 0, name: `Joueur-${senderID}` };
      return api.sendMessage(`💰 ${usr.name}, ton solde est de **${usr.money}$**.`, threadID);
    }

    // @daily : réclamer 200$ (même règle d'accès si partie en cours)
    if (cmd === "@daily") {
      if (game && game.player && senderID !== game.player) return api.sendMessage("⛔ Une partie est en cours ici. Seul le joueur peut utiliser @ pendant la partie.", threadID);
      const dataFresh = loadData();
      if (!dataFresh[senderID]) dataFresh[senderID] = { money: 0, lastDaily: 0, name: "" };
      const now = Date.now();
      if (now - (dataFresh[senderID].lastDaily || 0) < 24 * 60 * 60 * 1000) {
        const h = Math.ceil((24 * 60 * 60 * 1000 - (now - (dataFresh[senderID].lastDaily || 0))) / (1000 * 60 * 60));
        return api.sendMessage(`🕒 Reviens dans ${h}h pour réclamer ton bonus.`, threadID);
      }
      dataFresh[senderID].money += 200;
      dataFresh[senderID].lastDaily = now;
      saveData(dataFresh);
      return api.sendMessage(`✅ Tu as reçu **200$** ! Nouveau solde : ${dataFresh[senderID].money}$`, threadID);
    }

    // @top : classement (global, accessible même si partie active — mais on applique la même règle d'accès)
    if (cmd === "@top") {
      if (game && game.player && senderID !== game.player) return api.sendMessage("⛔ Une partie est en cours ici. Seul le joueur peut utiliser @ pendant la partie.", threadID);
      const dataFresh = loadData();
      const sorted = Object.entries(dataFresh)
        .sort((a, b) => b[1].money - a[1].money)
        .slice(0, 10);
      const msg = sorted.map(([id, u], i) => `${i + 1}. 🏅 ${u.name || `Joueur-${id}`} → ${u.money}$`).join("\n");
      return api.sendMessage(`🏆 **Top 10 des plus riches :**\n\n${msg}`, threadID);
    }

    // @cash : retrait pendant le vol (équivalent à "2")
    if (cmd === "@cash") {
      if (!game || game.player !== senderID) return; // pas de partie ou pas le joueur
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

    // @bet : lancer un pari (ex: @bet 100)
    if (cmd === "@bet") {
      // si une partie existe et est en cours, bloquer si ce n'est pas le joueur ou si partie running
      if (game) {
        // s'il y a déjà une partie en attente ou en cours, on empêche un nouveau pari
        return api.sendMessage("⏳ Une partie est déjà en cours dans ce salon. Attends la fin avant d'en lancer une autre.", threadID);
      }

      // parse montant
      const amountStr = parts[1];
      const amount = parseFloat(amountStr);
      if (isNaN(amount) || amount < 20) return api.sendMessage("❌ Montant invalide. Mise minimale : 20$", threadID);
      const dataFresh = loadData();
      if (!dataFresh[senderID]) dataFresh[senderID] = { money: 0, lastDaily: 0, name: "" };
      if (dataFresh[senderID].money < amount) return api.sendMessage("❌ Solde insuffisant.", threadID);

      // créer entrée temporaire en attente de confirmation
      activeGames[threadID] = { player: senderID, bet: amount, state: "waiting" };
      // message de confirmation (on attend que le joueur réponde "1" en réponse à ce message)
      return api.sendMessage(
        `💸 ${dataFresh[senderID].name || "Joueur"}, tu veux miser **${amount}$** ? Réponds **1** à ce message pour confirmer.`,
        threadID,
        (err, info) => {
          try {
            // enregistre la demande de confirmation pour capter la réponse "1"
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "aviator",
              type: "confirm",
              player: senderID,
              amount
            });
          } catch (e) {
            // si on ne peut pas enregistrer surReply, supprime la partie en attente
            delete activeGames[threadID];
          }
        }
      );
    }

    // commande @ inconnue
    return api.sendMessage("⚠️ Commande @ inconnue. Tape `@help` pour voir la liste des commandes.", threadID);
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
  api.sendMessage(`🛫 Le vol commence ! Tape **@cash** ou envoie **2** pour retirer avant que l’avion s’écrase ! 💥`, threadID);

  game.interval = setInterval(() => {
    // si jeu supprimé par une action extérieure
    if (!activeGames[threadID]) return clearInterval(game.interval);

    // avancement variable + pause aléatoire
    if (Math.random() < 0.1) return; // 10% de chance de "ralentir" sans bouger

    let jump = Math.random() * (game.multiplier < 5 ? 1.2 : game.multiplier < 20 ? 3 : game.multiplier < 100 ? 10 : 50);
    game.multiplier += jump;

    // Chance d'arrêt aléatoire avant crash (perte immédiate)
    if (Math.random() < 0.03) {
      clearInterval(game.interval);
      game.crashed = true;
      game.state = "finished";
      api.sendMessage(`💥 L’avion a explosé soudainement à **${game.multiplier.toFixed(2)}x** ! ${user.name} a tout perdu 😭`, threadID);
      delete activeGames[threadID];
      return;
    }

    // Crash prévu (atteint ou dépassé)
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
  if (r < 50) return 1 + Math.random() * 1.5;        // 50% → entre 1x et 2.5x
  if (r < 70) return 2.5 + Math.random() * 7.5;      // 20% → entre 2.5x et 10x
  if (r < 80) return 10 + Math.random() * 40;        // 10% → entre 10x et 50x
  if (r < 85) return 50 + Math.random() * 150;       // 5% → entre 50x et 200x
  if (r < 90) return 200 + Math.random() * 300;      // 5% → entre 200x et 500x
  if (r < 95) return 500 + Math.random() * 4500;     // 5% → entre 500x et 5000x
  if (r < 97) return 5000 + Math.random() * 20000;   // 2% → entre 5k et 25k
  if (r < 99) return 25000 + Math.random() * 75000;  // 2% → entre 25k et 100k
  return 100000 + Math.random() * 400000;            // 1% → entre 100k et 500k
}
