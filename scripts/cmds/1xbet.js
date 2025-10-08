// 1xbet.js
const fs = require("fs");
const path = require("path");

// --- Fichiers ---
const dataFile = path.join(__dirname, "1xbet-data.json");
const matchesFile = path.join(__dirname, "1xbet-matches.json");
const teamsFile = path.join(__dirname, "teams.json");

// --- Init fichiers si besoin ---
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify({}));
if (!fs.existsSync(matchesFile)) fs.writeFileSync(matchesFile, JSON.stringify([]));
if (!fs.existsSync(teamsFile)) throw new Error("teams.json introuvable. Crée teams.json avant de lancer la commande.");

function loadData() { return JSON.parse(fs.readFileSync(dataFile)); }
function saveData(d) { fs.writeFileSync(dataFile, JSON.stringify(d, null, 2)); }

let matches = [];
try { matches = JSON.parse(fs.readFileSync(matchesFile)); } catch (e) { matches = []; }
function saveMatches() { fs.writeFileSync(matchesFile, JSON.stringify(matches, null, 2)); }

const teams = JSON.parse(fs.readFileSync(teamsFile));

// --- Constantes ---
const MIN_BET = 20;
const DAILY_AMOUNT = 200;
const WELCOME_IMAGE = "http://goatbiin.onrender.com/GBhPN2QYD.png"; // change si besoin

// --- Helpers ---
function rndInt(max) { return Math.floor(Math.random() * max); }
function pickTwoDistinct(availableTeams) {
  const i = rndInt(availableTeams.length);
  let j;
  do { j = rndInt(availableTeams.length); } while (j === i);
  return [availableTeams[i], availableTeams[j]];
}

// Calcul des cotes à partir des forces -> stockées dans la structure du match
function computeOdds(teamA, teamB) {
  const drawBase = 0.12; // probabilité de nul de base
  const total = teamA.strength + teamB.strength;
  const probA = (teamA.strength / total) * (1 - drawBase);
  const probB = (teamB.strength / total) * (1 - drawBase);
  const probN = drawBase;

  // léger facteur aléatoire pour variation
  const rA = 0.9 + Math.random() * 0.3;
  const rB = 0.9 + Math.random() * 0.3;
  const rN = 0.95 + Math.random() * 0.2;

  return {
    A: Number((1 / probA * rA).toFixed(2)),
    N: Number((1 / probN * rN).toFixed(2)),
    B: Number((1 / probB * rB).toFixed(2))
  };
}

// Génére un score aléatoire plausbile selon le résultat
function randomScore(result) {
  if (result === "A") return `${Math.floor(Math.random() * 3) + 1}-${Math.floor(Math.random() * 3)}`;
  if (result === "B") return `${Math.floor(Math.random() * 3)}-${Math.floor(Math.random() * 3) + 1}`;
  // nul
  return `${Math.floor(Math.random() * 3)}-${Math.floor(Math.random() * 3)}`;
}

// Résolution basée sur les forces (probabilités)
function pickResultByStrength(match) {
  const total = match.teamA.strength + match.teamB.strength;
  const drawBase = 0.12;
  const probA = (match.teamA.strength / total) * (1 - drawBase);
  const probB = (match.teamB.strength / total) * (1 - drawBase);
  const probN = drawBase;

  const r = Math.random();
  if (r < probN) return "N";
  if (r < probN + probA) return "A";
  return "B";
}

// --- Création & scheduling des matchs ---
let nextMatchId = matches.reduce((m, x) => Math.max(m, x.id || 0), 0) + 1;

function scheduleResolve(match) {
  // clear éventuel timer
  if (match._timer) clearTimeout(match._timer);
  const delay = Math.max(0, (match.resolveAt || (Date.now() + 30000)) - Date.now());
  match._timer = setTimeout(() => resolveMatchRoutine(match.id), delay);
}

// Crée n matchs aléatoires et planifie leur résolution
function createMatches(originThreadID, n = 5, resolveInMs = 30000) {
  // on peut éviter l'utilisation répétée des mêmes équipes dans le même batch si tu veux
  for (let i = 0; i < n; i++) {
    const [A, B] = pickTwoDistinct(teams);
    const odds = computeOdds(A, B);
    const match = {
      id: nextMatchId++,
      teamA: A,
      teamB: B,
      odds,
      status: "open",
      bets: [],
      createdInThread: originThreadID,
      createdAt: Date.now(),
      resolveAt: Date.now() + resolveInMs
    };
    matches.push(match);
    scheduleResolve(match);
  }
  saveMatches();
}

// Résolution centrale d'un match : distribue gains/pertes et notifie
function resolveMatchRoutine(matchId) {
  // Lire données fraîches
  matches = JSON.parse(fs.readFileSync(matchesFile));
  const data = JSON.parse(fs.readFileSync(dataFile));

  const matchIndex = matches.findIndex(m => m.id === matchId);
  if (matchIndex === -1) return;
  const match = matches[matchIndex];

  if (match.status !== "open") return; // déjà résolu

  // Déterminer résultat selon forces
  const result = pickResultByStrength(match); // "A" | "B" | "N"
  const score = randomScore(result);
  match.status = "finished";
  match.result = result;
  match.score = score;

  // Pour chaque pari -> gains si choix === result
  for (const bet of match.bets) {
    const uid = bet.user;
    if (!data[uid]) {
      // utilisateur manquant, ignore
      continue;
    }
    // bet.odds a été enregistré au moment du pari (match.odds[choice])
    if (bet.choice === result) {
      const gain = Math.floor(bet.amount * bet.odds); // montant * cote
      data[uid].money = (data[uid].money || 0) + gain;
      // marquer l'historique
      if (!data[uid].bets) data[uid].bets = [];
      data[uid].bets.push({
        matchID: match.id,
        choice: bet.choice,
        amount: bet.amount,
        odds: bet.odds,
        status: "win",
        gain,
        resolvedAt: Date.now(),
        score
      });
      // annonce individuelle dans le thread du pari
      try { global.api.sendMessage(`🎉 ${data[uid].name || 'Joueur'}, TU AS GAGNÉ ${gain}$ !\n📊 Résultat : ${match.teamA.name} ${score} ${match.teamB.name}`, bet.threadID); } catch(e) {}
    } else {
      // perdant (a déjà été débité à la mise)
      if (!data[uid].bets) data[uid].bets = [];
      data[uid].bets.push({
        matchID: match.id,
        choice: bet.choice,
        amount: bet.amount,
        odds: bet.odds,
        status: "lose",
        gain: 0,
        resolvedAt: Date.now(),
        score
      });
      try { global.api.sendMessage(`💥 ${data[uid].name || 'Joueur'}, TU AS PERDU ta mise de ${bet.amount}$.\n📊 Résultat : ${match.teamA.name} ${score} ${match.teamB.name}`, bet.threadID); } catch(e) {}
    }
  }

  // Annonce générale dans le thread où les matchs ont été créés (si connu)
  const announceThread = match.createdInThread;
  try {
    const text = `🏁 Match ${match.id} terminé : ${match.teamA.name} ${match.score} ${match.teamB.name} — Résultat: ${result === "A" ? match.teamA.name : result === "B" ? match.teamB.name : "Nul"}\n\n⚠️ Les gains ont été distribués aux gagnants.`;
    if (announceThread) global.api.sendMessage(text, announceThread);
  } catch (e) { /* ignore */ }

  // sauvegarde
  saveMatches();
  saveData(data);

  // Si plus aucun match 'open' -> créer automatiquement 5 nouveaux matchs et annoncer
  const openCount = matches.filter(m => m.status === "open").length;
  if (openCount === 0) {
    // create 5 new matches in same thread to continue service
    createMatches(announceThread || match.createdInThread || match.bets?.[0]?.threadID || null, 5, 30000);
    // annoncer la création
    try {
      const threadToAnnounce = announceThread || (match.bets && match.bets[0] && match.bets[0].threadID) || null;
      if (threadToAnnounce) {
        const upcoming = matches.slice(-5).map(m => `• ${m.id}. ${m.teamA.name} vs ${m.teamB.name} — 🅰️ ${m.odds.A} | 🟰 ${m.odds.N} | 🅱️ ${m.odds.B}`).join("\n");
        global.api.sendMessage(`🔄 Tous les matchs sont terminés — 5 nouveaux matchs ont été créés :\n\n${upcoming}`, threadToAnnounce);
      }
    } catch (e) { /* ignore */ }
  }
}

// Schedule les timers existants au démarrage (pour persistance)
(function scheduleExisting() {
  try {
    matches.forEach(m => {
      if (m.status === "open") scheduleResolve(m);
    });
  } catch (e) { /* ignore */ }
})();

// --- Commande principale exportée pour GoatBot ---
module.exports = {
  config: {
    name: "1xbet",
    aliases: ["bet", "betmatch"],
    version: "5.0",
    author: "Merdi Madimba",
    role: 0,
    description: "Simulation de paris sur les matchs ⚽",
    category: "🎮 Jeux"
  },

  onStart: async function ({ api, event, args }) {
    // expose api globalement pour que resolveMatchRoutine puisse l'utiliser
    global.api = api;

    const { threadID, senderID, messageID } = event;
    const data = loadData();
    if (!data[senderID]) data[senderID] = { money: 0, lastDaily: 0, name: `Joueur-${senderID}`, bets: [] };
    const user = data[senderID];
    const sub = args[0] ? args[0].toLowerCase() : null;

    // --- Accueil ---
    if (!sub) {
      const body = `🏟️ **1XBET (simulation)** ⚽

Commandes :
• /1xbet matches → Voir les matchs disponibles
• /1xbet bet [matchID] [A|N|B] [montant] → Parier (mise min ${MIN_BET}$)
• /1xbet mybets → Voir tes paris (dernier 10)
• /1xbet solde → Voir ton solde
• /1xbet daily → Bonus quotidien ${DAILY_AMOUNT}$
• /1xbet top → Top 10 des joueurs

🅰️ = équipe 1 gagne | 🟰 = match nul | 🅱️ = équipe 2 gagne`;

      try {
        const stream = await global.utils.getStreamFromURL(WELCOME_IMAGE);
        return api.sendMessage({ body, attachment: stream }, threadID, messageID);
      } catch (e) {
        return api.sendMessage(body, threadID, messageID);
      }
    }

    // --- solde ---
    if (sub === "solde") {
      return api.sendMessage(`💰 ${user.name}, ton solde : ${user.money}$`, threadID, messageID);
    }

    // --- daily ---
    if (sub === "daily") {
      const now = Date.now();
      if (now - (user.lastDaily || 0) < 24 * 60 * 60 * 1000) {
        const remain = Math.ceil((24 * 60 * 60 * 1000 - (now - user.lastDaily)) / (1000 * 60 * 60));
        return api.sendMessage(`🕒 Déjà pris. Reviens dans ${remain}h.`, threadID, messageID);
      }
      user.money += DAILY_AMOUNT;
      user.lastDaily = now;
      saveData(data);
      return api.sendMessage(`✅ Bonus ${DAILY_AMOUNT}$ ajouté. Nouveau solde : ${user.money}$`, threadID, messageID);
    }

    // --- matches ---
    if (sub === "matches") {
      // Si moins de 5 matchs ouverts -> créer pour arriver à 5
      const openMatches = matches.filter(m => m.status === "open");
      if (openMatches.length < 5) {
        const toCreate = 5 - openMatches.length;
        createMatches(threadID, toCreate, 30000); // resolve in 30s
      }

      // recharger matches
      matches = JSON.parse(fs.readFileSync(matchesFile));
      const list = matches
        .filter(m => m.status === "open")
        .map(m => `🏁 Match ${m.id}
⚽ ${m.teamA.name} 🆚 ${m.teamB.name}
💪 Force : ${m.teamA.strength} - ${m.teamB.strength}
📈 Côtes : 🅰️ ${m.odds.A} | 🟰 ${m.odds.N} | 🅱️ ${m.odds.B}
⏱ Résolution dans : ${Math.max(0, Math.ceil((m.resolveAt - Date.now()) / 1000))}s`)
        .join("\n\n");

      if (!list) return api.sendMessage("ℹ️ Aucun match ouvert pour le moment, création en cours...", threadID, messageID);
      return api.sendMessage(`📋 **Matchs disponibles :**\n\n${list}`, threadID, messageID);
    }

    // --- bet ---
    if (sub === "bet") {
      // format: /1xbet bet [matchID] [A|N|B] [amount]
      const matchID = parseInt(args[1]);
      const choice = args[2] ? args[2].toUpperCase() : null;
      const amount = parseInt(args[3]);

      if (!matchID || !choice || isNaN(amount)) {
        return api.sendMessage(`⚠️ Format invalide.\nEx: /1xbet bet 2 A 100`, threadID, messageID);
      }
      if (!["A", "B", "N"].includes(choice)) return api.sendMessage("⚠️ Choix invalide. Utilise A, N ou B.", threadID, messageID);
      if (amount < MIN_BET) return api.sendMessage(`💵 Mise minimale : ${MIN_BET}$`, threadID, messageID);

      // reload matches & data fresh
      matches = JSON.parse(fs.readFileSync(matchesFile));
      const match = matches.find(m => m.id === matchID);
      if (!match) return api.sendMessage(`❌ Match ${matchID} introuvable.`, threadID, messageID);
      if (match.status !== "open") return api.sendMessage("🚫 Ce match n'est plus ouvert aux paris.", threadID, messageID);
      if (user.money < amount) return api.sendMessage("❌ Solde insuffisant.", threadID, messageID);

      // Retirer la mise du user immédiatement
      user.money -= amount;

      // Stocker le pari dans le match et dans l'historique utilisateur (pending)
      const bet = { user: senderID, choice, amount, odds: match.odds[choice], threadID };
      match.bets.push(bet);

      if (!user.bets) user.bets = [];
      user.bets.push({ matchID: match.id, choice, amount, odds: match.odds[choice], status: "pending", placedAt: Date.now() });

      saveData(data);
      saveMatches();

      // informer utilisateur
      api.sendMessage(`✅ Pari placé sur Match ${match.id} : ${match.teamA.name} vs ${match.teamB.name}
Choix: ${choice} | Mise: ${amount}$ | Cote: ${match.odds[choice]}
⌛ Résultat dans ~30s.`, threadID, messageID);

      return;
    }

    // --- mybets ---
    if (sub === "mybets") {
      if (!user.bets || user.bets.length === 0) return api.sendMessage("📭 Tu n'as aucun pari pour l'instant.", threadID, messageID);
      const list = user.bets.slice(-10).reverse().map(b => {
        const m = matches.find(x => x.id === b.matchID);
        const teamsText = m ? `${m.teamA.name} vs ${m.teamB.name}` : "Match supprimé";
        const status = b.status === "pending" ? "⏳ En attente" : b.status === "win" ? "✅ Gagné" : "❌ Perdu";
        const score = b.resolvedAt ? (m && m.score ? ` | Score: ${m.score}` : "") : "";
        return `🎯 Match ${b.matchID} — ${teamsText}
Choix: ${b.choice} | Mise: ${b.amount}$ | Cote: ${b.odds} | Statut: ${status}${score}`;
      }).join("\n\n");
      return api.sendMessage(`📋 Tes 10 derniers paris :\n\n${list}`, threadID, messageID);
    }

    // --- top ---
    if (sub === "top") {
      const data = loadData();
      const top = Object.entries(data).map(([uid, u]) => ({ name: u.name || uid, money: u.money || 0 }))
        .sort((a, b) => b.money - a.money).slice(0, 10);
      const text = top.map((t, i) => `${i + 1}. ${t.name} — ${t.money}$`).join("\n");
      return api.sendMessage(`🏆 Top 10 :\n\n${text}`, threadID, messageID);
    }

    // fallback
    return api.sendMessage("Commande inconnue. Tape /1xbet pour l'aide.", threadID, messageID);
  }
};
