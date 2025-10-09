// 🎯 1xbet.js — by Merdi Madimba

const fs = require("fs");
const path = require("path");

// === 🧩 FICHIERS / CONFIGURATION ===
const dataFile = path.join(__dirname, "1xbet-data.json");
const teamsFile = path.join(__dirname, "teams.json");
const matchesFile = path.join(__dirname, "1xbet-matches.json");

if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify({}));
if (!fs.existsSync(teamsFile)) throw new Error("❌ Fichier teams.json introuvable !");
if (!fs.existsSync(matchesFile)) fs.writeFileSync(matchesFile, JSON.stringify([]));

const MIN_BET = 20;
const DAILY_AMOUNT = 200;
const MATCH_COUNT = 5;
const RESOLVE_TIME = 30 * 1000;
const WELCOME_IMAGE = "http://goatbiin.onrender.com/GBhPN2QYD.png";

// === ⚽️ CHARGEMENT DES DONNÉES ===
let matches = JSON.parse(fs.readFileSync(matchesFile)) || [];
let nextMatchId = matches.reduce((max, m) => Math.max(max, m.id || 0), 0) + 1;
const teams = JSON.parse(fs.readFileSync(teamsFile));

function loadData() {
  return JSON.parse(fs.readFileSync(dataFile));
}
function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}
function saveMatches() {
  fs.writeFileSync(matchesFile, JSON.stringify(matches, null, 2));
}

// === 🔧 UTILITAIRES ===
function randomInt(max) { return Math.floor(Math.random() * max); }
function pickTwoDistinct(arr) {
  const i = randomInt(arr.length);
  let j; do { j = randomInt(arr.length); } while (j === i && arr.length > 1);
  return [arr[i], arr[j]];
}

// === 🎲 MATCHS / PARIS ===
function computeOdds(A, B) {
  const drawProb = 0.12;
  const total = A.strength + B.strength;
  const probA = (A.strength / total) * (1 - drawProb);
  const probB = (B.strength / total) * (1 - drawProb);
  const probN = drawProb;
  const randomizer = () => 0.9 + Math.random() * 0.3;
  return { A: Number((1 / probA * randomizer()).toFixed(2)), N: Number((1 / probN * randomizer()).toFixed(2)), B: Number((1 / probB * randomizer()).toFixed(2)) };
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
  const draw = 0.12;
  const pA = (match.teamA.strength / total) * (1 - draw);
  const pB = (match.teamB.strength / total) * (1 - draw);
  const r = Math.random();
  if (r < draw) return "N";
  if (r < draw + pA) return "A";
  return "B";
}

function createMatches(threadID, count = MATCH_COUNT) {
  const newMatches = [];
  for (let i = 0; i < count; i++) {
    const [teamA, teamB] = pickTwoDistinct(teams);
    const odds = computeOdds(teamA, teamB);
    const match = {
      id: nextMatchId++,
      teamA, teamB,
      odds,
      status: "open",
      createdAt: Date.now(),
      createdInThread: threadID || null,
      bets: [],
    };
    matches.push(match);
    newMatches.push(match);
  }
  saveMatches();
  return newMatches;
}

function closeMatchAndScheduleResolve(match) {
  match.status = "closed";
  match._timer && clearTimeout(match._timer);
  match._timer = setTimeout(() => resolveMatch(match.id), RESOLVE_TIME);
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
    const user = data[bet.user]; if (!user) continue;

    if (isDraw && bet.choice === "N") {
      const gain = Math.floor(bet.amount * bet.odds);
      user.money += gain; bet.status = "win"; bet.gain = gain;
      try { global.api.sendMessage(`🎉 ${user.name} a gagné **${gain}$** (match nul) !\n📊 ${match.teamA.name} ${score} ${match.teamB.name}`, bet.threadID); } catch {}
    } else if (!isDraw && bet.choice === result) {
      const gain = Math.floor(bet.amount * bet.odds);
      user.money += gain; bet.status = "win"; bet.gain = gain;
      try { global.api.sendMessage(`🎉 ${user.name} a gagné **${gain}$** !\n📊 ${match.teamA.name} ${score} ${match.teamB.name}`, bet.threadID); } catch {}
    } else { bet.status = "lose"; try { global.api.sendMessage(`💥 ${user.name}, tu as perdu ta mise de ${bet.amount}$.\n📊 ${match.teamA.name} ${score} ${match.teamB.name}`, bet.threadID); } catch {} }
  }

  saveData(data);
  saveMatches();

  const resultText = isDraw ? "Match nul ⚖️" : result === "A" ? match.teamA.name : match.teamB.name;
  const summary = `🏁 Résultat Match ${match.id}\n⚽ ${match.teamA.name} ${score} ${match.teamB.name}\n🎯 Résultat : ${resultText}`;
  try { if (match.createdInThread) global.api.sendMessage(summary, match.createdInThread); } catch {}
}

// === 🔁 ASSURE MATCHES OPEN ===
function ensureMatchesExist(threadID) {
  if (!matches.some(m => m.status === "open")) createMatches(threadID, MATCH_COUNT);
}

// === 💻 EXPORT COMMANDE ===
module.exports = {
  config: { name:"1xbet", aliases:["bet","betmatch"], version:"1.0", author:"Merdi Madimba", role:0, description:"Simulation de paris sur matchs de foot", category:"🎮 Jeux" },

  onStart: async function({ api, event, args }) {
    global.api = api;
    const { threadID, senderID, messageID } = event;
    const data = loadData();
    let user = data[senderID];

    if (!user) {
      let fbName = `Joueur-${senderID}`;
      try { const info = await api.getUserInfo(senderID); if (info && info[senderID]?.name) fbName = info[senderID].name; } catch {}
      data[senderID] = user = { money:0, lastDaily:0, name:fbName, bets:[] }; saveData(data);
    }

    const cmd = (args[0]||"").toLowerCase();

    // === MENU PRINCIPAL ===
    if (!cmd) {
      const body = `🏟️ 1XBET (simulation) ⚽

📌 Commandes principales :
• /1xbet matches → Affiche les ${MATCH_COUNT} matchs actuels
• /1xbet bet [ID] [A|N|B] [montant] → Parier (mise min ${MIN_BET}$)
• /1xbet mybets → Tes paris récents
• /1xbet solde → Voir ton solde
• /1xbet daily → Bonus quotidien +${DAILY_AMOUNT}$
• /1xbet top → Top 10 des joueurs

🅰️ = équipe 1 gagne | 🟰 = nul | 🅱️ = équipe 2 gagne`;
      try { const stream = await global.utils.getStreamFromURL(WELCOME_IMAGE); return api.sendMessage({ body, attachment: stream }, threadID, messageID); } catch { return api.sendMessage(body, threadID, messageID); }
    }

    // === SOLDE ===
    if (cmd === "solde") return api.sendMessage(`💰 ${user.name}, ton solde : **${user.money}$**`, threadID, messageID);

    // === DAILY ===
    if (cmd === "daily") {
      const now = Date.now();
      if (now - (user.lastDaily || 0) < 86400000) return api.sendMessage("🕒 Tu as déjà pris ton daily aujourd'hui. Reviens plus tard ⏳", threadID, messageID);
      user.money += DAILY_AMOUNT; user.lastDaily = now; saveData(data);
      return api.sendMessage(`🎁 Bonus de **${DAILY_AMOUNT}$** ajouté ! Nouveau solde : ${user.money}$`, threadID, messageID);
    }

    // === MATCHS ===
    if (cmd === "matches") {
      ensureMatchesExist(threadID);
      const open = matches.filter(m => m.status === "open");
      const text = open.map(m => `📍 Match ${m.id}\n⚽ ${m.teamA.name} 🆚 ${m.teamB.name}\n📈 Cotes → 🅰️ ${m.odds.A} | 🟰 ${m.odds.N} | 🅱️ ${m.odds.B}\n⏱ Statut : ${m.status.toUpperCase()}`).join("\n\n");
      return api.sendMessage(`📋 Matchs disponibles :\n\n${text}`, threadID, messageID);
    }

    // === PARIER ===
    if (cmd === "bet") {
      const id = parseInt(args[1]); const choice = (args[2]||"").toUpperCase(); const amount = parseInt(args[3]);
      if (!id || !["A","N","B"].includes(choice) || isNaN(amount)) return api.sendMessage("⚠️ Format : /1xbet bet [ID] [A|N|B] [montant]", threadID, messageID);
      if (amount < MIN_BET) return api.sendMessage(`💵 Mise minimale : ${MIN_BET}$`, threadID, messageID);
      if (user.money < amount) return api.sendMessage("❌ Solde insuffisant.", threadID, messageID);
      const match = matches.find(m => m.id === id && m.status === "open");
      if (!match) return api.sendMessage("🚫 Match introuvable ou déjà fermé.", threadID, messageID);
      user.money -= amount;
      const bet = { user:senderID, choice, amount, odds: match.odds[choice], threadID };
      match.bets.push(bet); user.bets.push({ matchID:id, choice, amount, odds:match.odds[choice], status:"pending", placedAt:Date.now() });
      saveData(data); saveMatches();
      closeMatchAndScheduleResolve(match);
      return api.sendMessage(`✅ Pari placé sur Match ${match.id} : ${match.teamA.name} vs ${match.teamB.name}\n🎯 Choix: ${choice} | 💵 Mise: ${amount}$\n⌛ Résultat disponible dans ~${Math.round(RESOLVE_TIME/1000)}s`, threadID, messageID);
    }

    // === MES PARIS ===
    if (cmd === "mybets") {
      if (!user.bets.length) return api.sendMessage("📭 Aucun pari actif.", threadID, messageID);
      const txt = user.bets.slice(-10).reverse().map(b => {
        const m = matches.find(x=>x.id===b.matchID);
        const teamsTxt = m?`${m.teamA.name} vs ${m.teamB.name}`:`Match ${b.matchID} (résolu)`;
        const statusTxt = b.status==="pending"?"⏳ En attente":b.status==="win"?"✅ Gagné":b.status==="lose"?"❌ Perdu":b.status==="draw"?"⚖️ Nul":b.status;
        return `🎯 Match ${b.matchID} — ${teamsTxt}\nChoix: ${b.choice} | Mise: ${b.amount}$ | Cote: ${b.odds} | Statut: ${statusTxt}`;
      }).join("\n\n");
      return api.sendMessage(`📋 Tes derniers paris :\n\n${txt}`, threadID, messageID);
    }

    // === TOP 10 ===
    if (cmd === "top") {
      const top = Object.values(data).map(u=>({name:u.name||"Joueur", money:u.money||0})).sort((a,b)=>b.money-a.money).slice(0,10);
      if (!top.length) return api.sendMessage("ℹ️ Aucun joueur enregistré.", threadID, messageID);
      const text = top.map((t,i)=>`${i+1}. 🏅 ${t.name} → ${t.money}$`).join("\n");
      return api.sendMessage(`🏆 Top 10 des plus riches :\n\n${text}`, threadID, messageID);
    }

    // === FAKE ===
    return api.sendMessage("❓ Commande inconnue. Tape /1xbet pour l'aide.", threadID, messageID);
  }
};t text = created.map(m => `📍 Match ${m.id}
⚽ ${m.teamA.name} 🆚 ${m.teamB.name}
📈 Cotes → 🅰️ ${m.odds.A} | 🟰 ${m.odds.N} | 🅱️ ${m.odds.B}
⏱ Statut : ${m.status.toUpperCase()}`).join("\n\n");
        return api.sendMessage(`📋 Matchs disponibles :\n\n${text}`, threadID, messageID);
      } else {
        // affiche les matchs open (les mêmes jusqu'à fermeture)
        const text = open.map(m => `📍 Match ${m.id}
⚽ ${m.teamA.name} 🆚 ${m.teamB.name}
📈 Cotes → 🅰️ ${m.odds.A} | 🟰 ${m.odds.N} | 🅱️ ${m.odds.B}
⏱ Statut : ${m.status.toUpperCase()}`).join("\n\n");
        return api.sendMessage(`📋 Matchs disponibles :\n\n${text}`, threadID, messageID);
      }
    }

    // PARI : /1xbet bet [id] [A|N|B] [amount]
    if (cmd === "bet") {
      const id = parseInt(args[1]);
      const choice = (args[2] || "").toUpperCase();
      const amount = parseInt(args[3]);

      if (!id || !choice || isNaN(amount)) {
        return api.sendMessage("⚠️ Format invalide. Exemple : /1xbet bet 2 A 100", threadID, messageID);
      }
      if (!["A", "B", "N"].includes(choice)) {
        return api.sendMessage("⚠️ Choix invalide — utilise A, N ou B.", threadID, messageID);
      }
      if (amount < MIN_BET) return api.sendMessage(`💵 Mise minimale : ${MIN_BET}$`, threadID, messageID);
      if (user.money < amount) return api.sendMessage("❌ Solde insuffisant.", threadID, messageID);

      // trouve match dans la mémoire
      const match = matches.find(m => m.id === id);
      if (!match) return api.sendMessage("❌ Match introuvable.", threadID, messageID);
      if (match.status !== "open") return api.sendMessage("🚫 Ce match est déjà fermé aux paris.", threadID, messageID);

      // retire la mise
      user.money -= amount;

      // enregistrer le pari dans le match et dans l'historique user
      const bet = { user: senderID, choice, amount, odds: match.odds[choice], threadID };
      match.bets.push(bet);
      if (!user.bets) user.bets = [];
      user.bets.push({ matchID: id, choice, amount, odds: match.odds[choice], status: "pending", placedAt: Date.now() });

      saveData(data);

      // Fermer le match et planifier résolution
      closeMatchAndScheduleResolve(match);

      return api.sendMessage(`✅ Pari placé sur Match ${match.id} : ${match.teamA.name} vs ${match.teamB.name}
🎯 Choix: ${choice} | 💵 Mise: ${amount}$ | Cote: ${match.odds[choice]}
⌛ Résultat disponible dans ~${Math.round(RESOLVE_TIME/1000)}s.`, threadID, messageID);
    }

    // MYBETS
    if (cmd === "mybets") {
      if (!user.bets || user.bets.length === 0) {
        return api.sendMessage("📭 Tu n'as aucun pari enregistré.", threadID, messageID);
      }
      const list = user.bets.slice(-10).reverse().map(b => {
        const m = matches.find(x => x.id === b.matchID);
        const teamsText = m ? `${m.teamA.name} vs ${m.teamB.name}` : `Match ${b.matchID} (résolu)`;
        const statusText = b.status === "pending" ? "⏳ En attente" : b.status === "win" ? "✅ Gagné" : b.status === "lose" ? "❌ Perdu" : b.status === "draw" ? "⚖️ Nul" : b.status;
        return `🎯 Match ${b.matchID} — ${teamsText}\nChoix: ${b.choice} | Mise: ${b.amount}$ | Cote: ${b.odds} | Statut: ${statusText}`;
      }).join("\n\n");
      return api.sendMessage(`📋 Tes derniers paris :\n\n${list}`, threadID, messageID);
    }

    // TOP
    if (cmd === "top") {
      const dataObj = loadData();
      const top = Object.values(dataObj)
        .map(u => ({ name: u.name || "Joueur", money: u.money || 0 }))
        .sort((a,b) => b.money - a.money)
        .slice(0,10);
      if (top.length === 0) return api.sendMessage("ℹ️ Aucun joueur enregistré.", threadID, messageID);
      const text = top.map((t,i) => `${i+1}. 🏅 ${t.name} → ${t.money}$`).join("\n");
      return api.sendMessage(`🏆 Top 10 des plus riches :\n\n${text}`, threadID, messageID);
    }

    // fallback
    return api.sendMessage("❓ Commande inconnue. Tape /1xbet pour l'aide.", threadID, messageID);
  }
};: ${choice} | 💵 Mise : ${amount}$ | Cote : ${match.odds[choice]}\n⏱ Résultat dans quelques secondes...`,
        threadID,
        messageID
      );
    }

    if (cmd === "mybets") {
      if (!user.bets.length) return api.sendMessage("📭 Tu n’as aucun pari actif.", threadID, messageID);
      const txt = user.bets
        .slice(-10)
        .reverse()
        .map((b) => `🎯 Match ${b.matchID} | Choix: ${b.choice} | 💵 ${b.amount}$ | Cote: ${b.odds} | ${
          b.status === "win" ? "✅ Gagné" : b.status === "lose" ? "❌ Perdu" : b.status === "draw" ? "⚖️ Nul" : "⏳ En attente"
        }`)
        .join("\n");
      return api.sendMessage(`📋 **Tes derniers paris :**\n\n${txt}`, threadID, messageID);
    }

    if (cmd === "top") {
      const top = Object.values(data)
        .map((u) => ({ name: u.name, money: u.money }))
        .sort((a, b) => b.money - a.money)
        .slice(0, 10);
      const msg = top.map((t, i) => `${i + 1}. 🏅 ${t.name} → ${t.money}$`).join("\n");
      return api.sendMessage(`🏆 **Top 10 des plus riches :**\n\n${msg}`, threadID, messageID);
    }

    return api.sendMessage("❓ Commande inconnue. Tape `/1xbet` pour l’aide.", threadID, messageID);
  }
};const WELCOME_IMAGE = "http://goatbiin.onrender.com/GBhPN2QYD.png";

// === FONCTIONS UTILITAIRES ===
function randomInt(max) {
  return Math.floor(Math.random() * max);
}
function pickTwoDistinct(arr) {
  const i = randomInt(arr.length);
  let j;
  do j = randomInt(arr.length);
  while (j === i);
  return [arr[i], arr[j]];
}

// === CALCUL DES COTES ===
function computeOdds(A, B) {
  const drawProb = 0.12;
  const total = A.strength + B.strength;
  const probA = (A.strength / total) * (1 - drawProb);
  const probB = (B.strength / total) * (1 - drawProb);
  const probN = drawProb;
  const randomizer = () => 0.9 + Math.random() * 0.3;
  return {
    A: (1 / probA * randomizer()).toFixed(2),
    N: (1 / probN * randomizer()).toFixed(2),
    B: (1 / probB * randomizer()).toFixed(2),
  };
}

// === GÉNÉRATION DE SCORE ===
function randomScore(result) {
  const maxGoals = 10;
  if (result === "A") return `${1 + randomInt(maxGoals)}-${randomInt(maxGoals)}`;
  if (result === "B") return `${randomInt(maxGoals)}-${1 + randomInt(maxGoals)}`;
  const score = randomInt(maxGoals + 1);
  return `${score}-${score}`; // match nul
}

// === DÉTERMINER LE RÉSULTAT SELON LES FORCES ===
function pickResultByStrength(match) {
  const total = match.teamA.strength + match.teamB.strength;
  const draw = 0.12;
  const pA = (match.teamA.strength / total) * (1 - draw);
  const pB = (match.teamB.strength / total) * (1 - draw);
  const r = Math.random();
  if (r < draw) return "N";
  if (r < draw + pA) return "A";
  return "B";
}

// === CRÉATION DE MATCHS ===
let nextMatchId = matches.reduce((max, m) => Math.max(max, m.id || 0), 0) + 1;
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
      resolveAt: Date.now() + RESOLVE_TIME,
      createdInThread: threadID,
      bets: [],
    };
    matches.push(match);
    newMatches.push(match);
    scheduleResolve(match);
  }
  saveMatches(matches);
  return newMatches;
}

// === PLANIFICATION AUTOMATIQUE ===
function scheduleResolve(match) {
  setTimeout(() => resolveMatchRoutine(match.id), match.resolveAt - Date.now());
}

// === RÉSOLUTION DES MATCHS ===
async function resolveMatchRoutine(matchId) {
  matches = loadMatches();
  const data = loadData();
  const match = matches.find((m) => m.id === matchId);
  if (!match || match.status !== "open") return;

  const result = pickResultByStrength(match);
  const score = randomScore(result);
  match.status = "finished";
  match.result = result;
  match.score = score;

  const [goalsA, goalsB] = score.split("-").map(Number);
  const isDraw = goalsA === goalsB;

  for (let bet of match.bets) {
    const user = data[bet.user];
    if (!user) continue;

    if (isDraw) {
      if (bet.choice === "N") {
        const gain = Math.floor(bet.amount * bet.odds);
        user.money += gain;
        bet.status = "win";
        bet.gain = gain;
        try {
          global.api.sendMessage(`🎉 ${user.name} a gagné **${gain}$** pour le match nul ⚖️\n📊 ${match.teamA.name} ${score} ${match.teamB.name}`, bet.threadID);
        } catch {}
      } else {
        bet.status = "lose";
        try {
          global.api.sendMessage(`💥 ${user.name}, tu as perdu ta mise de ${bet.amount}$ 😭\n📊 ${match.teamA.name} ${score} ${match.teamB.name}`, bet.threadID);
        } catch {}
      }
      continue;
    }

    if (bet.choice === result) {
      const gain = Math.floor(bet.amount * bet.odds);
      user.money += gain;
      bet.status = "win";
      bet.gain = gain;
      try {
        global.api.sendMessage(`🎉 ${user.name} a gagné **${gain}$** ! 💰\n📊 ${match.teamA.name} ${score} ${match.teamB.name}`, bet.threadID);
      } catch {}
    } else {
      bet.status = "lose";
      try {
        global.api.sendMessage(`💥 ${user.name}, tu as perdu ta mise de ${bet.amount}$ 😭\n📊 ${match.teamA.name} ${score} ${match.teamB.name}`, bet.threadID);
      } catch {}
    }
  }

  saveData(data);
  saveMatches(matches);

  const resultText = isDraw ? "Match nul ⚖️" : result === "A" ? match.teamA.name : match.teamB.name;
  const summary = `🏁 **Résultat du Match ${match.id}**
⚽ ${match.teamA.name} ${score} ${match.teamB.name}
🎯 Résultat : ${resultText}
💸 Les gains ont été distribués !`;

  if (match.createdInThread) global.api.sendMessage(summary, match.createdInThread);

  const openMatches = matches.filter((m) => m.status === "open");
  if (openMatches.length === 0) {
    const newBatch = createMatches(match.createdInThread || null, MATCH_COUNT);
    const msg = newBatch
      .map((m) => `📍 Match ${m.id} : ${m.teamA.name} 🆚 ${m.teamB.name}\n📈 Cotes → 🅰️ ${m.odds.A} | 🟰 ${m.odds.N} | 🅱️ ${m.odds.B}`)
      .join("\n\n");
    if (match.createdInThread) global.api.sendMessage(`🔁 **Nouveaux matchs disponibles !**\n\n${msg}`, match.createdInThread);
  }
}

// === REPLANIFICATION DES MATCHS EXISTANTS ===
matches.filter((m) => m.status === "open").forEach(scheduleResolve);

// === COMMANDE PRINCIPALE ===
module.exports = {
  config: {
    name: "1xbet",
    aliases: ["bet", "betmatch"],
    version: "6.3",
    author: "Merdi Madimba",
    role: 0,
    description: "💵 Simulation de paris sur les matchs de foot ⚽",
    category: "🎮 Jeux",
  },
  onStart: async function ({ api, event, args }) {
    global.api = api;
    const { threadID, senderID, messageID } = event;
    const data = loadData();

    // Récupération du vrai nom Facebook
    if (!data[senderID]) {
      const info = await api.getUserInfo(senderID);
      data[senderID] = {
        money: 0,
        lastDaily: 0,
        name: info[senderID]?.name || `Joueur-${senderID}`,
        bets: [],
      };
    }
    const user = data[senderID];
    const cmd = (args[0] || "").toLowerCase();

    if (!cmd) {
      const msg = `🏟️ **Bienvenue sur 1XBET (Simulation)** ⚽

💰 Commandes disponibles :
📊 /1xbet matches → Voir les matchs ouverts
🎯 /1xbet bet [ID] [A|N|B] [montant] → Placer un pari
💵 /1xbet solde → Voir ton argent
🎁 /1xbet daily → Réclamer ton bonus quotidien (+${DAILY_AMOUNT}$)
🏆 /1xbet top → Voir le classement des riches
🧾 /1xbet mybets → Voir tes paris récents

🅰️ = Équipe 1 gagne | 🟰 = Nul | 🅱️ = Équipe 2 gagne`;
      const img = await global.utils.getStreamFromURL(WELCOME_IMAGE);
      return api.sendMessage({ body: msg, attachment: img }, threadID, messageID);
    }

    if (cmd === "solde") return api.sendMessage(`💰 ${user.name}, ton solde : **${user.money}$**`, threadID, messageID);

    if (cmd === "daily") {
      const now = Date.now();
      if (now - (user.lastDaily || 0) < 86400000) return api.sendMessage("🕒 Tu as déjà pris ton bonus aujourd'hui. Reviens plus tard ⏳", threadID, messageID);
      user.money += DAILY_AMOUNT;
      user.lastDaily = now;
      saveData(data);
      return api.sendMessage(`🎁 Bonus de **${DAILY_AMOUNT}$** ajouté à ton solde ! 💸`, threadID, messageID);
    }

    if (cmd === "matches") {
      let open = matches.filter((m) => m.status === "open");
      if (open.length < MATCH_COUNT) createMatches(threadID, MATCH_COUNT - open.length);
      open = loadMatches().filter((m) => m.status === "open");
      const msg = open
        .map(
          (m) =>
            `📍 Match ${m.id}\n⚽ ${m.teamA.name} 🆚 ${m.teamB.name}\n📈 Cotes → 🅰️ ${m.odds.A} | 🟰 ${m.odds.N} | 🅱️ ${m.odds.B}\n⏱ Résolution dans ${Math.ceil(
              (m.resolveAt - Date.now()) / 1000
            )}s`
        )
        .join("\n\n");
      return api.sendMessage(`📋 **Matchs disponibles :**\n\n${msg}`, threadID, messageID);
    }

    if (cmd === "bet") {
      const id = parseInt(args[1]);
      const choice = (args[2] || "").toUpperCase();
      const amount = parseInt(args[3]);
      if (!id || !choice || isNaN(amount)) return api.sendMessage("⚠️ Format : /1xbet bet [ID] [A|N|B] [montant]", threadID, messageID);
      const match = matches.find((m) => m.id === id && m.status === "open");
      if (!match) return api.sendMessage("❌ Match introuvable ou fermé.", threadID, messageID);
      if (amount < MIN_BET) return api.sendMessage(`💵 Mise minimale : ${MIN_BET}$`, threadID, messageID);
      if (user.money < amount) return api.sendMessage("❌ Solde insuffisant.", threadID, messageID);

      user.money -= amount;
      const bet = { user: senderID, choice, amount, odds: match.odds[choice], threadID };
      match.bets.push(bet);
      user.bets.push({ matchID: id, choice, amount, odds: match.odds[choice], status: "pending" });
      saveData(data);
      saveMatches(matches);

      return api.sendMessage(
        `✅ Pari confirmé sur **${match.teamA.name} 🆚 ${match.teamB.name}**\n🎯 Choix : ${choice} | 💵 Mise : ${amount}$ | Cote : ${match.odds[choice]}\n⏱ Résultat dans quelques secondes...`,
        threadID,
        messageID
      );
    }

    if (cmd === "mybets") {
      if (!user.bets.length) return api.sendMessage("📭 Tu n’as aucun pari actif.", threadID, messageID);
      const txt = user.bets
        .slice(-10)
        .reverse()
        .map((b) => `🎯 Match ${b.matchID} | Choix: ${b.choice} | 💵 ${b.amount}$ | Cote: ${b.odds} | ${
          b.status === "win" ? "✅ Gagné" : b.status === "lose" ? "❌ Perdu" : b.status === "draw" ? "⚖️ Nul" : "⏳ En attente"
        }`)
        .join("\n");
      return api.sendMessage(`📋 **Tes derniers paris :**\n\n${txt}`, threadID, messageID);
    }

    if (cmd === "top") {
      const top = Object.values(data)
        .map((u) => ({ name: u.name, money: u.money }))
        .sort((a, b) => b.money - a.money)
        .slice(0, 10);
      const msg = top.map((t, i) => `${i + 1}. 🏅 ${t.name} → ${t.money}$`).join("\n");
      return api.sendMessage(`🏆 **Top 10 des plus riches :**\n\n${msg}`, threadID, messageID);
    }

    return api.sendMessage("❓ Commande inconnue. Tape `/1xbet` pour l’aide.", threadID, messageID);
  },
};    }

    if (cmd === "mybets") {
      if (!user.bets.length) return api.sendMessage("📭 Tu n’as aucun pari actif.", threadID, messageID);
      const txt = user.bets
        .slice(-10)
        .reverse()
        .map((b) => `🎯 Match ${b.matchID} | Choix: ${b.choice} | 💵 ${b.amount}$ | Cote: ${b.odds} | ${
          b.status === "win" ? "✅ Gagné" : b.status === "lose" ? "❌ Perdu" : b.status === "draw" ? "⚖️ Nul" : "⏳ En attente"
        }`)
        .join("\n");
      return api.sendMessage(`📋 **Tes derniers paris :**\n\n${txt}`, threadID, messageID);
    }

    if (cmd === "top") {
      const top = Object.values(data)
        .map((u) => ({ name: u.name, money: u.money }))
        .sort((a, b) => b.money - a.money)
        .slice(0, 10);
      const msg = top.map((t, i) => `${i + 1}. 🏅 ${t.name} → ${t.money}$`).join("\n");
      return api.sendMessage(`🏆 **Top 10 des plus riches :**\n\n${msg}`, threadID, messageID);
    }

    return api.sendMessage("❓ Commande inconnue. Tape `/1xbet` pour l’aide.", threadID, messageID);
  }
};
