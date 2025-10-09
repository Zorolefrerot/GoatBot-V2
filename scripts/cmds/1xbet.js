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
      try {
        global.api.sendMessage(`🎉 ${user.name} 𝘢 𝘨𝘢𝘨𝘯é **${gain}$** !\n📊 ${match.teamA.name} ${score} ${match.teamB.name}`, bet.threadID);
      } catch {}
    } else {
      bet.status = "lose";
      if (userBet) userBet.status = "lose";
    }
  }

  saveData(data);
  saveMatches(matches);

  try {
    if (match.createdInThread) {
      const resText = isDraw ? "Match nul ⚖️" : (result === "A" ? match.teamA.name : match.teamB.name);
      global.api.sendMessage(
        `🏁 𝙍é𝙨𝙪𝙡𝙩𝙖𝙩 𝙈𝙖𝙩𝙘𝙝 ${match.id}\n⚽ ${match.teamA.name} ${score} ${match.teamB.name}\n🎯 𝙍é𝙨𝙪𝙡𝙩𝙖𝙩 : ${resText}`,
        match.createdInThread
      );
    }
  } catch {}
}

// === EXPORT COMMANDE ===
module.exports = {
  config: {
    name: "1xbet",
    aliases: ["bet", "betmatch"],
    version: "1.2",
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
      const body = `🏟️ 1𝙓𝘽𝙀𝙏 𝙋𝘼𝙍𝙄𝙎 𝙎𝙋𝙊𝙍𝙏𝙄𝙁 🏟️
⚽ /1xbet matches → 𝘼𝙛𝙛𝙞𝙘𝙝𝙚 𝙡𝙚𝙨 ${MATCH_COUNT} 𝙢𝙖𝙩𝙘𝙝𝙨
🎰 /1xbet bet [𝙄𝘿] [𝘼|𝙉|𝘽] [𝙢𝙤𝙣𝙩𝙖𝙣𝙩]
👤 /1xbet mybets → 𝙏𝙚𝙨 𝙥𝙖𝙧𝙞𝙨
💵 /1xbet solde → 𝙎𝙤𝙡𝙙𝙚
💳 /1xbet daily → 𝘽𝙤𝙣𝙪𝙨 +${DAILY_AMOUNT}$
📃 /1xbet top → 𝙏𝙤𝙥 10 𝙟𝙤𝙪𝙚𝙪𝙧𝙨
🅰️ = é𝘲𝘶𝘪𝘱𝘦 1 𝘨𝘢𝘨𝘯𝘦 | 🟰 = 𝘯𝘶𝘭 | 🅱️ = é𝘲𝘶𝘪𝘱𝘦 2 𝘨𝘢𝘨𝘯𝘦`;

      try {
        const stream = await global.utils.getStreamFromURL(WELCOME_IMAGE);
        return api.sendMessage({ body, attachment: stream }, threadID, messageID);
      } catch { return api.sendMessage(body, threadID, messageID); }
    }

    // --- COMMANDES ---
    switch (cmd) {
      case "solde":
        return api.sendMessage(`💰 ${user.name}, 𝙎𝙊𝙇𝘿𝙀 : **${user.money}$**`, threadID, messageID);

      case "daily": {
        const now = Date.now();
        if (now - (user.lastDaily || 0) < 24 * 60 * 60 * 1000)
          return api.sendMessage("🕒 𝙏𝙪 𝙖𝙨 𝙙é𝙟à 𝙥𝙧𝙞𝙨 𝙩𝙤𝙣 𝙙𝙖𝙞𝙡𝙮. 𝙇𝙚 𝙥𝙧𝙤𝙘𝙝𝙖𝙞𝙣 𝙙𝙖𝙣𝙨 24𝙝", threadID, messageID);
        user.money += DAILY_AMOUNT;
        user.lastDaily = now;
        saveData(data);
        return api.sendMessage(`✅ ${DAILY_AMOUNT}$ 𝘢𝘫𝘰𝘶𝘵é. 𝙉𝙤𝙪𝙫𝙚𝙖𝙪 𝙨𝙤𝙡𝙙𝙚 : ${user.money}$`, threadID, messageID);
      }

      case "matches": {
        let open = matches.filter(m => m.status === "open");
        if (!open.length) open = createMatches(threadID, MATCH_COUNT);

        const text = open.map(m => `📍 𝙈𝙖𝙩𝙘𝙝 ${m.id}
⚽ ${m.teamA.name} 🆚 ${m.teamB.name}
📈 𝘾𝙤𝙩𝙚𝙨 → 🅰️ ${m.odds.A} | 🟰 ${m.odds.N} | 🅱️ ${m.odds.B}
⏱ 𝙎𝙩𝙖𝙩𝙪𝙩 : ${m.status.toUpperCase()}`).join("\n\n");

        return api.sendMessage(`📋 𝙈𝙖𝙩𝙘𝙝𝙨 𝙙𝙞𝙥𝙤𝙣𝙞𝙗𝙡𝙚𝙨 :\n\n${text}`, threadID, messageID);
      }

      case "bet": {
        const id = parseInt(args[1]);
        const choice = (args[2] || "").toUpperCase();
        const amount = parseInt(args[3]);
        if (!id || !choice || isNaN(amount))
          return api.sendMessage("⚠️ 𝙁𝙤𝙧𝙢𝙖𝙩 𝙞𝙣𝙫𝙖𝙡𝙞𝙙𝙚. Exemple : /1xbet bet 2 A 100", threadID, messageID);
        if (!["A", "B", "N"].includes(choice))
          return api.sendMessage("⚠️ Choix invalide — A, N ou B.", threadID, messageID);
        if (amount < MIN_BET) return api.sendMessage(`💵 𝖬𝗂𝗌𝖾 𝗆𝗂𝗇 : ${MIN_BET}$`, threadID, messageID);
        if (user.money < amount) return api.sendMessage("❌ 𝗦𝗼𝗹𝗱𝗲 𝗶𝗻𝘀𝘂𝗳𝗳𝗶𝘀𝗮𝗻𝘁.", threadID, messageID);

        const match = matches.find(m => m.id === id);
        if (!match) return api.sendMessage("❌ 𝕄𝕒𝕥𝕔𝕙 𝕚𝕟𝕥𝕣𝕠𝕦𝕧𝕒𝕓𝕝𝕖.", threadID, messageID);
        if (match.status !== "open") return api.sendMessage("🚫 𝗠𝗮𝘁𝗰𝗵 𝗱é𝗷à 𝗳𝗲𝗿𝗺é 𝗮𝘂𝘅 𝗽𝗮𝗿𝗶𝘀.", threadID, messageID);

        user.money -= amount;
        const bet = { user: senderID, choice, amount, odds: match.odds[choice], threadID };
        match.bets.push(bet);
        user.bets.push({
          matchID: id,
          choice,
          amount,
          odds: match.odds[choice],
          status: "pending",
          placedAt: Date.now()
        });

        saveData(data);
        saveMatches(matches);
        closeMatchAndScheduleResolve(match);

        return api.sendMessage(
          `✅ 𝙋𝙖𝙧𝙞 𝙥𝙡𝙖𝙘é 𝙨𝙪𝙧 𝙈𝙖𝙩𝙘𝙝 ${match.id} : ${match.teamA.name} 🆚 ${match.teamB.name}\n🎯 𝘾𝙝𝙤𝙞𝙭: ${choice} | 💵 𝙈𝙞𝙨𝙚: ${amount}$ | 𝘾𝙤𝙩𝙚: ${match.odds[choice]}\n⌛ 𝚁é𝚜𝚞𝚕𝚝𝚊𝚝 𝚍𝚊𝚗𝚜 ~${Math.round(RESOLVE_TIME / 1000)}𝚜.`,
          threadID,
          messageID
        );
      }

      case "mybets": {
        if (!user.bets.length) return api.sendMessage("📭 𝙏𝙊𝙉 𝙃𝙄𝙎𝙏𝙊𝙍𝙄𝙌𝙐𝙀 𝙀𝙎𝙏 𝙑𝙄𝘿𝙀.", threadID, messageID);

        const list = user.bets.slice(-10).reverse().map(b => {
          const m = matches.find(x => x.id === b.matchID);
          const teamsText = m ? `${m.teamA.name} vs ${m.teamB.name}` : `Match ${b.matchID} (résolu)`;
          let statusText = "";
          switch (b.status) {
            case "win": statusText = "✅ 𝘎𝘢𝘨𝘯é"; break;
            case "lose": statusText = "❌ 𝘗𝘦𝘳𝘥𝘶"; break;
            default: statusText = "⏳ 𝘌𝘯 𝘢𝘵𝘵𝘦𝘯𝘵𝘦"; break;
          }
          return `🎯 𝙈𝙖𝙩𝙘𝙝 ${b.matchID} — ${teamsText}\n🎲 𝘾𝙝𝙤𝙞𝙭: ${b.choice} | 💵 𝙈𝙞𝙨𝙚: ${b.amount}$ | 📈 𝘾𝙤𝙩𝙚: ${b.odds}\n📊 𝙎𝙩𝙖𝙩𝙪𝙩: ${statusText}`;
        }).join("\n\n");

        return api.sendMessage(`📋 𝙏𝙊𝙉 𝙃𝙄𝙎𝙏𝙊𝙍𝙄𝙌𝙐𝙀 :\n\n${list}`, threadID, messageID);
      }

      case "top": {
        const top = Object.values(data)
          .map(u => ({ name: u.name, money: u.money || 0 }))
          .sort((a, b) => b.money - a.money)
          .slice(0, 10);
        if (!top.length) return api.sendMessage("ℹ️ 𝙰𝚞𝚌𝚞𝚗 𝚓𝚘𝚞𝚎𝚞𝚛 𝚎𝚗𝚛𝚎𝚐𝚒𝚜𝚝𝚛𝚎.", threadID, messageID);
        const text = top.map((t, i) => `${i + 1}. 🏅 ${t.name} → ${t.money}$`).join("\n");
        return api.sendMessage(`🏆 🅃🄾🄿 10 🄿🄰🅁🄸🄴🅄🅁🅂 :\n\n${text}`, threadID, messageID);
      }

      default:
        return api.sendMessage("❓ 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝗲 𝗶𝗻𝗰𝗼𝗻𝗻𝘂𝗲. 𝗧𝗮𝗽𝗲 /1xbet 𝗽𝗼𝘂𝗿 𝗹'𝗮𝗶𝗱𝗲.", threadID, messageID);
    }
  }
};
