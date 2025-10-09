// 🏆 1xbet.js
const fs = require("fs");
const path = require("path");

// === FICHIERS / CONSTANTES ===
const dataFile = path.join(__dirname, "1xbet-data.json");
const matchesFile = path.join(__dirname, "1xbet-matches.json");
const teamsFile = path.join(__dirname, "teams.json");

// Création fichiers si inexistants
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify({}));
if (!fs.existsSync(matchesFile)) fs.writeFileSync(matchesFile, JSON.stringify([]));
if (!fs.existsSync(teamsFile)) throw new Error("❌ Fichier teams.json introuvable !");

// === UTILITAIRES DE FICHIERS ===
function loadData() {
  try { return JSON.parse(fs.readFileSync(dataFile)); }
  catch { return {}; }
}
function saveData(data) { fs.writeFileSync(dataFile, JSON.stringify(data, null, 2)); }

function loadMatches() {
  try { return JSON.parse(fs.readFileSync(matchesFile)); }
  catch { return []; }
}
function saveMatches(matches) { fs.writeFileSync(matchesFile, JSON.stringify(matches, null, 2)); }

// === CONSTANTES DU JEU ===
const teams = JSON.parse(fs.readFileSync(teamsFile));
const MIN_BET = 20;
const DAILY_AMOUNT = 200;
const MATCH_COUNT = 5;
const RESOLVE_TIME = 30 * 1000; // 30s
const WELCOME_IMAGE = "http://goatbiin.onrender.com/GBhPN2QYD.png";

// === FONCTIONS UTILES ===
function randomInt(max) { return Math.floor(Math.random() * max); }

function pickTwoDistinct(arr) {
  const i = randomInt(arr.length);
  let j;
  do j = randomInt(arr.length); while (j === i && arr.length > 1);
  return [arr[i], arr[j]];
}

function computeOdds(A, B) {
  const drawProb = 0.12;
  const total = A.strength + B.strength;
  const probA = (A.strength / total) * (1 - drawProb);
  const probB = (B.strength / total) * (1 - drawProb);
  const probN = drawProb;
  const randomizer = () => 0.9 + Math.random() * 0.3;

  return {
    A: Number((1 / probA * randomizer()).toFixed(2)),
    N: Number((1 / probN * randomizer()).toFixed(2)),
    B: Number((1 / probB * randomizer()).toFixed(2)),
  };
}

function randomScore(result) {
  const maxGoals = 10;
  if (result === "A") return `${1 + randomInt(maxGoals)}-${randomInt(maxGoals)}`;
  if (result === "B") return `${randomInt(maxGoals)}-${1 + randomInt(maxGoals)}`;
  const s = randomInt(maxGoals + 1);
  return `${s}-${s}`;
}

function pickResultByStrength(match) {
  const total = match.teamA.strength + match.teamB.strength;
  const drawProb = 0.12;
  const probA = (match.teamA.strength / total) * (1 - drawProb);
  const probB = (match.teamB.strength / total) * (1 - drawProb);
  const r = Math.random();
  if (r < drawProb) return "N";
  if (r < drawProb + probA) return "A";
  return "B";
}

// === MATCHES ===
let matches = loadMatches();
let nextMatchId = matches.reduce((max, m) => Math.max(max, m.id), 0) + 1;

function createMatches(threadID, count = MATCH_COUNT) {
  const newMatches = [];
  for (let i = 0; i < count; i++) {
    const [teamA, teamB] = pickTwoDistinct(teams);
    const odds = computeOdds(teamA, teamB);
    const match = {
      id: nextMatchId++,
      teamA,
      teamB,
      odds,
      status: "open",
      createdAt: Date.now(),
      createdInThread: threadID, // ✅ Stocke le groupe où le match est créé
      bets: [],
    };
    matches.push(match);
    newMatches.push(match);
  }
  saveMatches(matches);
  return newMatches;
}

function closeMatchAndScheduleResolve(match) {
  if (match.status !== "open") return;
  match.status = "closed";
  saveMatches(matches);
  setTimeout(() => resolveMatch(match.id), RESOLVE_TIME);
}

// === RÉSOLUTION DE MATCH ===
function resolveMatch(matchId) {
  const data = loadData();
  const match = matches.find(m => m.id === matchId);
  if (!match || match.status === "finished") return;

  const result = pickResultByStrength(match);
  const score = randomScore(result);
  match.status = "finished";
  match.result = result;
  match.score = score;

  const [goalsA, goalsB] = score.split("-").map(Number);
  const isDraw = goalsA === goalsB;
  const threadToNotify = match.createdInThread;

  let recap = `🏁 𝙍é𝙨𝙪𝙡𝙩𝙖𝙩 𝙈𝙖𝙩𝙘𝙝 ${match.id}\n⚽ ${match.teamA.name} ${score} ${match.teamB.name}\n`;

  const resText = isDraw ? "⚖️ 𝙈𝙖𝙩𝙘𝙝 𝙉𝙪𝙡" :
    (result === "A" ? `🏆 ${match.teamA.name} 𝙖 𝙜𝙖𝙜𝙣é !` : `🏆 ${match.teamB.name} 𝙖 𝙜𝙖𝙜𝙣é !`);
  recap += `🎯 𝙍é𝙨𝙪𝙡𝙩𝙖𝙩 : ${resText}\n\n`;

  let gainsText = "";

  for (const bet of match.bets) {
    const user = data[bet.user];
    if (!user) continue;
    const userBet = user.bets.find(b => b.matchID === match.id && b.status === "pending");

    if ((isDraw && bet.choice === "N") || (!isDraw && bet.choice === result)) {
      const gain = Math.floor(bet.amount * bet.odds);
      user.money += gain;
      bet.status = "win";
      bet.gain = gain;
      if (userBet) {
        userBet.status = "win";
        userBet.gain = gain;
      }
      gainsText += `✅ ${user.name} a gagné **${gain}$**\n`;
    } else {
      bet.status = "lose";
      if (userBet) userBet.status = "lose";
      gainsText += `❌ ${user.name} a perdu (${bet.amount}$)\n`;
    }
  }

  saveData(data);
  saveMatches(matches);

  // ✅ Envoie le message global dans le groupe d’origine
  if (threadToNotify) {
    try {
      global.api.sendMessage(`${recap}${gainsText || "Aucun pari enregistré pour ce match."}`, threadToNotify);
    } catch (err) {
      console.error("Erreur d’envoi du résultat :", err);
    }
  }
}

// === EXPORT COMMANDE ===
module.exports = {
  config: {
    name: "1xbet",
    aliases: ["bet", "betmatch"],
    version: "1.3",
    author: "Merdi Madimba",
    role: 0,
    description: "Simulation de paris sur matchs",
    category: "🎮 Jeux"
  },

  onStart: async function ({ api, event, args }) {
    global.api = api;
    const { threadID, senderID, messageID } = event;
    const data = loadData();

    // === INITIALISATION UTILISATEUR ===
    if (!data[senderID]) {
      let fbName = `Joueur-${senderID}`;
      try {
        const info = await api.getUserInfo(senderID);
        if (info && info[senderID]?.name) fbName = info[senderID].name;
      } catch {}
      data[senderID] = { money: 0, lastDaily: 0, name: fbName, bets: [] };
      saveData(data);
    }

    const user = data[senderID];
    const cmd = (args[0] || "").toLowerCase();

    // === MENU PRINCIPAL ===
    if (!cmd) {
      const body = `🏟️ 1𝙓𝘽𝙀𝙏 𝙋𝘼𝙍𝙄𝙎 𝙎𝙋𝙊𝙍𝙏𝙄𝙁 🏟️
⚽ /1xbet matches → 𝘼𝙛𝙛𝙞𝙘𝙝𝙚 𝙡𝙚𝙨 ${MATCH_COUNT} 𝙢𝙖𝙩𝙘𝙝𝙨
🎰 /1xbet bet [𝙄𝘿] [𝘼|𝙉|𝘽] [𝙢𝙤𝙣𝙩𝙖𝙣𝙩]
👤 /1xbet mybets → 𝙏𝙚𝙨 𝙥𝙖𝙧𝙞𝙨
💵 /1xbet solde → 𝙎𝙤𝙡𝙙𝙚
💳 /1xbet daily → 𝘽𝙤𝙣𝙪𝙨 +${DAILY_AMOUNT}$
📃 /1xbet top → 𝙏𝙤𝙥 10 𝙟𝙤𝙪𝙚𝙪𝙧𝙨`;

      try {
        const stream = await global.utils.getStreamFromURL(WELCOME_IMAGE);
        return api.sendMessage({ body, attachment: stream }, threadID, messageID);
      } catch { return api.sendMessage(body, threadID, messageID); }
    }

    // === GESTION COMMANDES ===
    switch (cmd) {
      case "matches": {
        let open = matches.filter(m => m.status === "open" && m.createdInThread === threadID);
        if (!open.length) open = createMatches(threadID, MATCH_COUNT);
        const list = open.map(m =>
          `📍 𝙈𝙖𝙩𝙘𝙝 ${m.id}\n⚽ ${m.teamA.name} 🆚 ${m.teamB.name}\n📈 Cotes → 🅰️ ${m.odds.A} | 🟰 ${m.odds.N} | 🅱️ ${m.odds.B}\n⏱ Statut : ${m.status}`
        ).join("\n\n");
        return api.sendMessage(`📋 𝙈𝙖𝙩𝙘𝙝𝙨 𝙙𝙞𝙨𝙥𝙤𝙣𝙞𝙗𝙡𝙚𝙨 :\n\n${list}`, threadID, messageID);
      }

      case "solde":
        return api.sendMessage(`💰 ${user.name}, ton solde est de **${user.money}$**`, threadID, messageID);

      case "daily": {
        const now = Date.now();
        if (now - (user.lastDaily || 0) < 24 * 60 * 60 * 1000)
          return api.sendMessage("🕒 Tu as déjà pris ton daily. Reviens dans 24h.", threadID, messageID);
        user.money += DAILY_AMOUNT;
        user.lastDaily = now;
        saveData(data);
        return api.sendMessage(`✅ +${DAILY_AMOUNT}$ ajoutés à ton solde !`, threadID, messageID);
      }

      case "mybets": {
        if (!user.bets.length) return api.sendMessage("📭 Aucun pari enregistré.", threadID, messageID);
        const list = user.bets.slice(-10).reverse().map(b => {
          const m = matches.find(x => x.id === b.matchID);
          const status = b.status === "win" ? "✅ Gagné" :
                         b.status === "lose" ? "❌ Perdu" : "⏳ En attente";
          return `🎯 Match ${b.matchID} (${m ? `${m.teamA.name} vs ${m.teamB.name}` : "Terminé"})\n💵 Mise: ${b.amount}$ | Choix: ${b.choice} | Cote: ${b.odds}\n📊 Statut: ${status}`;
        }).join("\n\n");
        return api.sendMessage(`📋 TES PARIS :\n\n${list}`, threadID, messageID);
      }

      default:
        return api.sendMessage("❓ Commande inconnue. Tape /1xbet pour le menu.", threadID, messageID);
    }
  }
};
