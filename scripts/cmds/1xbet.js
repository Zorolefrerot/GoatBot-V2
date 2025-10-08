const fs = require("fs");
const path = require("path");

// --- Fichiers ---
const dataFile = path.join(__dirname, "1xbet-data.json");
const matchesFile = path.join(__dirname, "1xbet-matches.json");
const teamsFile = path.join(__dirname, "teams.json");

// --- Initialisation ---
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify({}));
if (!fs.existsSync(matchesFile)) fs.writeFileSync(matchesFile, JSON.stringify([]));

function loadData() {
  return JSON.parse(fs.readFileSync(dataFile));
}
function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

let matches = [];
try {
  matches = JSON.parse(fs.readFileSync(matchesFile));
} catch (e) {
  matches = [];
}
function saveMatches() {
  fs.writeFileSync(matchesFile, JSON.stringify(matches, null, 2));
}

const teams = JSON.parse(fs.readFileSync(teamsFile));

// --- Constantes ---
const MIN_BET = 20;
const DAILY_AMOUNT = 200;
const WELCOME_IMAGE = "http://goatbiin.onrender.com/GBhPN2QYD.png";

// --- Outils ---
function randomTeams() {
  const idx1 = Math.floor(Math.random() * teams.length);
  let idx2;
  do {
    idx2 = Math.floor(Math.random() * teams.length);
  } while (idx2 === idx1);
  return [teams[idx1], teams[idx2]];
}

function computeOdds(teamA, teamB) {
  const drawBase = 0.12;
  const total = teamA.strength + teamB.strength;
  const probA = (teamA.strength / total) * (1 - drawBase);
  const probB = (teamB.strength / total) * (1 - drawBase);
  const probN = drawBase;
  const rA = 0.9 + Math.random() * 0.3;
  const rB = 0.9 + Math.random() * 0.3;
  const rN = 0.95 + Math.random() * 0.2;
  return {
    A: Number((1 / probA * rA).toFixed(2)),
    N: Number((1 / probN * rN).toFixed(2)),
    B: Number((1 / probB * rB).toFixed(2))
  };
}

function randomScore(result) {
  if (result === "A") return `${Math.floor(Math.random() * 3) + 1}-${Math.floor(Math.random() * 2)}`;
  if (result === "B") return `${Math.floor(Math.random() * 2)}-${Math.floor(Math.random() * 3) + 1}`;
  return `${Math.floor(Math.random() * 3)}-${Math.floor(Math.random() * 3)}`;
}

function resolveMatch(match) {
  const r = Math.random();
  const total = match.teamA.strength + match.teamB.strength;
  const drawBase = 0.12;
  const probA = (match.teamA.strength / total) * (1 - drawBase);
  const probB = (match.teamB.strength / total) * (1 - drawBase);
  const probN = drawBase;

  if (r < probN) return "N";
  if (r < probN + probA) return "A";
  return "B";
}

// --- Commande principale ---
module.exports = {
  config: {
    name: "1xbet",
    aliases: ["bet", "betmatch"],
    version: "4.0",
    author: "Merdi Madimba",
    role: 0,
    description: "Simulation de paris sur les matchs ⚽",
    category: "🎮 Jeux"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, senderID, messageID } = event;
    const data = loadData();
    if (!data[senderID]) data[senderID] = { money: 0, lastDaily: 0, name: "Joueur", bets: [] };
    const user = data[senderID];
    const sub = args[0] ? args[0].toLowerCase() : null;

    // --- Menu d’accueil ---
    if (!sub) {
      const body = `🏟️ **BIENVENUE SUR 1XBET** ⚽💸

🎮 **Commandes disponibles :**
📊 /1xbet matches → Voir les matchs du jour  
💰 /1xbet solde → Voir ton argent  
🎁 /1xbet daily → Bonus de 200$ par jour  
🎯 /1xbet bet [matchID] [A|N|B] [montant] → Parier  
📋 /1xbet mybets → Tes paris  
🏆 /1xbet top → Classement des joueurs

🅰️ = équipe 1 gagne | 🟰 = nul | 🅱️ = équipe 2 gagne`;

      try {
        const stream = await global.utils.getStreamFromURL(WELCOME_IMAGE);
        return api.sendMessage({ body, attachment: stream }, threadID, messageID);
      } catch (e) {
        return api.sendMessage(body, threadID, messageID);
      }
    }

    // --- Solde ---
    if (sub === "solde")
      return api.sendMessage(`💰 ${user.name}, ton solde est de ${user.money}$`, threadID, messageID);

    // --- Bonus quotidien ---
    if (sub === "daily") {
      const now = Date.now();
      if (now - (user.lastDaily || 0) < 24 * 60 * 60 * 1000) {
        const remain = Math.ceil((24 * 60 * 60 * 1000 - (now - user.lastDaily)) / 1000 / 60 / 60);
        return api.sendMessage(`🕒 Tu as déjà réclamé ton bonus. Reviens dans ${remain}h.`, threadID, messageID);
      }
      user.money += DAILY_AMOUNT;
      user.lastDaily = now;
      saveData(data);
      return api.sendMessage(`✅ ${user.name}, tu as reçu ${DAILY_AMOUNT}$ ! Nouveau solde : ${user.money}$`, threadID, messageID);
    }

    // --- Matchs disponibles ---
    if (sub === "matches") {
      if (matches.length < 5) {
        for (let i = 0; i < 5; i++) {
          const [A, B] = randomTeams();
          const odds = computeOdds(A, B);
          matches.push({
            id: matches.length + 1,
            teamA: A,
            teamB: B,
            odds,
            status: "open",
            bets: [],
            resolveAt: Date.now() + 30000
          });
        }
        saveMatches();
      }

      const list = matches
        .map(
          (m) => `🏁 **Match ${m.id}**
⚽ ${m.teamA.name} 🆚 ${m.teamB.name}
💪 Force : ${m.teamA.strength} - ${m.teamB.strength}
📈 Côtes : 🅰️ ${m.odds.A} | 🟰 ${m.odds.N} | 🅱️ ${m.odds.B}
📅 Statut : ${m.status.toUpperCase()}`
        )
        .join("\n\n");

      return api.sendMessage(`📋 **Matchs disponibles :**\n\n${list}`, threadID, messageID);
    }

    // --- Pari ---
    if (sub === "bet") {
      const matchID = parseInt(args[1]);
      const choice = args[2]?.toUpperCase();
      const amount = parseInt(args[3]);

      if (!matchID || !choice || !amount)
        return api.sendMessage(`⚠️ Format invalide.\n💡 Exemple : /1xbet bet 2 A 100`, threadID, messageID);

      const match = matches.find((m) => m.id === matchID);
      if (!match) return api.sendMessage(`❌ Aucun match avec l’ID ${matchID}`, threadID, messageID);
      if (match.status !== "open") return api.sendMessage(`🚫 Ce match est déjà fermé.`, threadID, messageID);
      if (!["A", "B", "N"].includes(choice)) return api.sendMessage(`⚠️ Choix invalide. Utilise A, B ou N.`, threadID, messageID);
      if (amount < MIN_BET) return api.sendMessage(`💵 Mise minimale : ${MIN_BET}$`, threadID, messageID);
      if (user.money < amount) return api.sendMessage(`❌ Solde insuffisant.`, threadID, messageID);

      user.money -= amount;
      match.bets.push({ user: senderID, choice, amount, odds: match.odds[choice], threadID });
      user.bets.push({ matchID, choice, amount, status: "pending" });
      saveData(data);
      saveMatches();

      api.sendMessage(
        `✅ Pari enregistré sur **${match.teamA.name} vs ${match.teamB.name}**
🧾 Mise : ${amount}$ | Choix : ${choice}
⌛ Résultat disponible dans 30 secondes...`,
        threadID,
        messageID
      );

      setTimeout(() => {
        match.status = "closed";
        match.result = resolveMatch(match);
        match.score = randomScore(match.result);
        saveMatches();

        match.bets.forEach((b) => {
          const u = data[b.user];
          if (!u) return;

          const betRecord = u.bets.find((x) => x.matchID === match.id);
          if (b.choice === match.result) {
            const gain = Math.floor(b.amount * b.odds);
            u.money += gain;
            betRecord.status = "win";
            api.sendMessage(
              `🎉 ${u.name}, tu as **gagné ${gain}$** !\n📊 Score final : ${match.teamA.name} ${match.score} ${match.teamB.name}`,
              b.threadID
            );
          } else {
            betRecord.status = "lose";
            api.sendMessage(
              `💥 ${u.name}, tu as perdu ton pari sur **${match.teamA.name} 🆚 ${match.teamB.name}** 😢\n📊 Score final : ${match.teamA.name} ${match.score} ${match.teamB.name}`,
              b.threadID
            );
          }
        });

        saveData(data);
      }, 30000);
    }

    // --- Mes paris ---
    if (sub === "mybets") {
      if (!user.bets || user.bets.length === 0)
        return api.sendMessage("📭 Tu n’as encore fait aucun pari.", threadID, messageID);

      const betList = user.bets
        .slice(-10)
        .map(
          (b) =>
            `🎯 Match ${b.matchID} → Choix: ${b.choice}\n💵 Mise: ${b.amount}$ | 🏁 Statut: ${
              b.status === "pending" ? "⏳ En attente" : b.status === "win" ? "✅ Gagné" : "❌ Perdu"
            }`
        )
        .join("\n\n");

      return api.sendMessage(`📋 **Tes 10 derniers paris :**\n\n${betList}`, threadID, messageID);
    }

    // --- Classement ---
    if (sub === "top") {
      const sorted = Object.entries(data)
        .map(([id, d]) => ({ name: d.name, money: d.money }))
        .sort((a, b) => b.money - a.money)
        .slice(0, 10);

      const msg = sorted
        .map((u, i) => `${i + 1}. 🥇 ${u.name} — ${u.money}$`)
        .join("\n");

      return api.sendMessage(`🏆 **Top 10 des plus riches joueurs :**\n\n${msg}`, threadID, messageID);
    }
  }
};
