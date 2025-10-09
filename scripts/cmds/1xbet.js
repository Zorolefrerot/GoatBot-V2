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
      createdInThread: threadID || null,
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

  for (const bet of match.bets) {
    const user = data[bet.user];
    if (!user) continue;

    if ((isDraw && bet.choice === "N") || (!isDraw && bet.choice === result)) {
      const gain = Math.floor(bet.amount * bet.odds);
      user.money += gain;
      bet.status = "win";
      bet.gain = gain;
      try {
        global.api.sendMessage(`🎉 ${user.name} a gagné **${gain}$** !\n📊 ${match.teamA.name} ${score} ${match.teamB.name}`, bet.threadID);
      } catch {}
    } else bet.status = "lose";
  }

  saveData(data);
  saveMatches(matches);

  try {
    if (match.createdInThread) {
      const resText = isDraw ? "Match nul ⚖️" : (result === "A" ? match.teamA.name : match.teamB.name);
      global.api.sendMessage(`🏁 Résultat Match ${match.id}\n⚽ ${match.teamA.name} ${score} ${match.teamB.name}\n🎯 Résultat : ${resText}`, match.createdInThread);
    }
  } catch {}
}

// === EXPORT COMMANDE ===
module.exports = {
  config: {
    name: "1xbet",
    aliases: ["bet", "betmatch"],
    version: "1.1",
    author: "Merdi Madimba",
    role: 0,
    description: "Simulation de paris sur matchs",
    category: "🎮 Jeux"
  },
  onStart: async function ({ api, event, args }) {
    global.api = api;
    const { threadID, senderID, messageID } = event;
    const data = loadData();

    // --- INIT UTILISATEUR ---
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

    // --- MENU PRINCIPAL ---
    if (!cmd) {
      const body = `🏟️ 1XBET (simulation)
• /1xbet matches → Affiche les ${MATCH_COUNT} matchs
• /1xbet bet [ID] [A|N|B] [montant]
• /1xbet mybets → Tes paris
• /1xbet solde → Solde
• /1xbet daily → Bonus +${DAILY_AMOUNT}$
• /1xbet top → Top 10 joueurs
🅰️ = équipe 1 gagne | 🟰 = nul | 🅱️ = équipe 2 gagne`;

      try {
        const stream = await global.utils.getStreamFromURL(WELCOME_IMAGE);
        return api.sendMessage({ body, attachment: stream }, threadID, messageID);
      } catch { return api.sendMessage(body, threadID, messageID); }
    }

    // --- COMMANDES ---
    switch(cmd) {
      case "solde":
        return api.sendMessage(`💰 ${user.name}, ton solde : **${user.money}$**`, threadID, messageID);

      case "daily": {
        const now = Date.now();
        if (now - (user.lastDaily || 0) < 24*60*60*1000) return api.sendMessage("🕒 Tu as déjà pris ton daily.", threadID, messageID);
        user.money += DAILY_AMOUNT;
        user.lastDaily = now;
        saveData(data);
        return api.sendMessage(`✅ ${DAILY_AMOUNT}$ ajouté. Nouveau solde : ${user.money}$`, threadID, messageID);
      }

      case "matches": {
        let open = matches.filter(m => m.status === "open");
        if (!open.length) open = createMatches(threadID, MATCH_COUNT);

        const text = open.map(m => `📍 Match ${m.id}
⚽ ${m.teamA.name} 🆚 ${m.teamB.name}
📈 Cotes → 🅰️ ${m.odds.A} | 🟰 ${m.odds.N} | 🅱️ ${m.odds.B}
⏱ Statut : ${m.status.toUpperCase()}`).join("\n\n");

        return api.sendMessage(`📋 Matchs disponibles :\n\n${text}`, threadID, messageID);
      }

      case "bet": {
        const id = parseInt(args[1]);
        const choice = (args[2] || "").toUpperCase();
        const amount = parseInt(args[3]);
        if (!id || !choice || isNaN(amount)) return api.sendMessage("⚠️ Format invalide. Exemple : /1xbet bet 2 A 100", threadID, messageID);
        if (!["A","B","N"].includes(choice)) return api.sendMessage("⚠️ Choix invalide — A, N ou B.", threadID, messageID);
        if (amount < MIN_BET) return api.sendMessage(`💵 Mise min : ${MIN_BET}$`, threadID, messageID);
        if (user.money < amount) return api.sendMessage("❌ Solde insuffisant.", threadID, messageID);

        const match = matches.find(m => m.id === id);
        if (!match) return api.sendMessage("❌ Match introuvable.", threadID, messageID);
        if (match.status !== "open") return api.sendMessage("🚫 Match déjà fermé aux paris.", threadID, messageID);

        user.money -= amount;
        const bet = { user: senderID, choice, amount, odds: match.odds[choice], threadID };
        match.bets.push(bet);
        user.bets.push({ matchID: id, choice, amount, odds: match.odds[choice], status: "pending", placedAt: Date.now() });

        saveData(data);
        saveMatches(matches);
        closeMatchAndScheduleResolve(match);

        return api.sendMessage(`✅ Pari placé sur Match ${match.id} : ${match.teamA.name} vs ${match.teamB.name}\n🎯 Choix: ${choice} | 💵 Mise: ${amount}$ | Cote: ${match.odds[choice]}\n⌛ Résultat dans ~${Math.round(RESOLVE_TIME/1000)}s.`, threadID, messageID);
      }

      case "mybets": {
        if (!user.bets.length) return api.sendMessage("📭 Tu n'as aucun pari.", threadID, messageID);
        const list = user.bets.slice(-10).reverse().map(b => {
          const m = matches.find(x => x.id === b.matchID);
          const teamsText = m ? `${m.teamA.name} vs ${m.teamB.name}` : `Match ${b.matchID} (résolu)`;
          const statusText = b.status === "pending" ? "⏳ En attente" : b.status === "win" ? "✅ Gagné" : b.status === "lose" ? "❌ Perdu" : "⚖️ Nul";
          return `🎯 Match ${b.matchID} — ${teamsText}\nChoix: ${b.choice} | Mise: ${b.amount}$ | Cote: ${b.odds} | Statut: ${statusText}`;
        }).join("\n\n");
        return api.sendMessage(`📋 Tes derniers paris :\n\n${list}`, threadID, messageID);
      }

      case "top": {
        const top = Object.values(data).map(u => ({ name: u.name, money: u.money || 0 }))
          .sort((a,b)=>b.money - a.money).slice(0,10);
        if (!top.length) return api.sendMessage("ℹ️ Aucun joueur enregistré.", threadID, messageID);
        const text = top.map((t,i)=>`${i+1}. 🏅 ${t.name} → ${t.money}$`).join("\n");
        return api.sendMessage(`🏆 Top 10 joueurs :\n\n${text}`, threadID, messageID);
      }

      default:
        return api.sendMessage("❓ Commande inconnue. Tape /1xbet pour l'aide.", threadID, messageID);
    }
  }
};
