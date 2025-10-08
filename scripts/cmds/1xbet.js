const fs = require("fs");
const path = require("path");

// --- Fichiers ---
const dataFile = path.join(__dirname,"1xbet-data.json");
const matchesFile = path.join(__dirname,"1xbet-matches.json");
const teamsFile = path.join(__dirname,"teams.json");

// --- Initialisation ---
if(!fs.existsSync(dataFile)) fs.writeFileSync(dataFile,JSON.stringify({}));
if(!fs.existsSync(matchesFile)) fs.writeFileSync(matchesFile,JSON.stringify([]));

function loadData(){ return JSON.parse(fs.readFileSync(dataFile)); }
function saveData(data){ fs.writeFileSync(dataFile,JSON.stringify(data,null,2)); }

let matches = [];
try{ matches = JSON.parse(fs.readFileSync(matchesFile)); } catch(e){ matches=[]; }
function saveMatches(){ fs.writeFileSync(matchesFile,JSON.stringify(matches,null,2)); }

const teams = JSON.parse(fs.readFileSync(teamsFile));

// --- Constantes ---
const MIN_BET = 20;
const DAILY_AMOUNT = 200;
const WELCOME_IMAGE = "http://goatbiin.onrender.com/GBhPN2QYD.png";

// --- Outils ---
function randomTeams(){
  const idx1 = Math.floor(Math.random()*teams.length);
  let idx2;
  do{ idx2 = Math.floor(Math.random()*teams.length); }while(idx2===idx1);
  return [teams[idx1],teams[idx2]];
}

function computeOdds(teamA,teamB){
  const drawBase = 0.12;
  const total = teamA.strength + teamB.strength;
  const probA = teamA.strength/total*(1-drawBase);
  const probB = teamB.strength/total*(1-drawBase);
  const probN = drawBase;
  const rA = 0.9 + Math.random()*0.3;
  const rB = 0.9 + Math.random()*0.3;
  const rN = 0.95 + Math.random()*0.2;
  return {
    A:Number((1/probA*rA).toFixed(2)),
    N:Number((1/probN*rN).toFixed(2)),
    B:Number((1/probB*rB).toFixed(2))
  };
}

function resolveMatch(match){
  const r = Math.random();
  const total = match.teamA.strength + match.teamB.strength;
  const drawBase = 0.12;
  const probA = match.teamA.strength/total*(1-drawBase);
  const probB = match.teamB.strength/total*(1-drawBase);
  const probN = drawBase;

  if(r<probN) return "N";
  if(r<probN+probA) return "A";
  return "B";
}

// --- Commande principale ---
module.exports = {
  config:{
    name:"1xbet",
    aliases:["bet","betmatch"],
    version:"3.5",
    author:"Merdi Madimba",
    role:0,
    description:"Simulation de paris sur les matchs ⚽",
    category:"🎮 Jeux"
  },

  onStart: async function({api,event,args}){
    const { threadID, senderID, messageID } = event;
    const data = loadData();
    if(!data[senderID]) data[senderID] = { money:0, lastDaily:0, name:"Joueur" };
    const user = data[senderID];
    const sub = args[0] ? args[0].toLowerCase() : null;

    // --- Menu d’accueil ---
    if(!sub){
      const body = `🏟️ **BIENVENUE SUR 1XBET** ⚽💸

🎮 **Commandes disponibles :**
📊 /1xbet matches → Voir les matchs du jour  
💰 /1xbet solde → Voir ton argent  
🎁 /1xbet daily → Bonus de 200$ par jour  
🎯 /1xbet bet [matchID] [A|N|B] [montant] → Parier  
📋 /1xbet mybets → Tes paris en cours  
🏆 /1xbet top → Classement des riches joueurs  

🅰️ = équipe 1 gagne | 🟰 = nul | 🅱️ = équipe 2 gagne`;

      try{
        const stream = await global.utils.getStreamFromURL(WELCOME_IMAGE);
        return api.sendMessage({body,attachment:stream},threadID,messageID);
      }catch(e){ return api.sendMessage(body,threadID,messageID); }
    }

    // --- Solde ---
    if(sub==="solde") return api.sendMessage(`💰 ${user.name}, ton solde est de ${user.money}$`,threadID,messageID);

    // --- Daily bonus ---
    if(sub==="daily"){
      const now = Date.now();
      if(now-(user.lastDaily||0)<24*60*60*1000){
        const remain = Math.ceil((24*60*60*1000-(now-user.lastDaily))/1000/60/60);
        return api.sendMessage(`🕒 Tu as déjà réclamé ton bonus. Reviens dans ${remain}h.`,threadID,messageID);
      }
      user.money+=DAILY_AMOUNT;
      user.lastDaily=now;
      saveData(data);
      return api.sendMessage(`✅ ${user.name}, tu as reçu ${DAILY_AMOUNT}$ ! Nouveau solde : ${user.money}$`,threadID,messageID);
    }

    // --- Matchs disponibles ---
    if(sub==="matches"){
      if(matches.length<5){
        for(let i=0;i<5;i++){
          const [A,B]=randomTeams();
          const odds = computeOdds(A,B);
          matches.push({
            id:matches.length+1,
            teamA:A,
            teamB:B,
            odds,
            status:"open",
            bets:[],
            resolveAt:Date.now()+30000
          });
        }
        saveMatches();
      }

      const list = matches.map(m=>`🏁 **Match ${m.id}**
⚽ ${m.teamA.name} 🆚 ${m.teamB.name}
💪 Force : ${m.teamA.strength} - ${m.teamB.strength}
📈 Côtes → 🅰️ ${m.odds.A} | 🟰 ${m.odds.N} | 🅱️ ${m.odds.B}
📅 Statut : ${m.status.toUpperCase()}`).join("\n\n");

      return api.sendMessage(`📋 **Matchs disponibles :**\n\n${list}`,threadID,messageID);
    }

    // --- Pari ---
    if(sub==="bet"){
      const matchID = parseInt(args[1]);
      const choice = args[2]?.toUpperCase();
      const amount = parseInt(args[3]);

      if(!matchID || !choice || !amount)
        return api.sendMessage(`⚠️ Format invalide.\nExemple : /1xbet bet 2 A 100`,threadID,messageID);

      const match = matches.find(m=>m.id===matchID);
      if(!match) return api.sendMessage(`❌ Aucun match avec l’ID ${matchID}`,threadID,messageID);
      if(match.status!=="open") return api.sendMessage(`🚫 Ce match est déjà fermé.`,threadID,messageID);
      if(!["A","B","N"].includes(choice)) return api.sendMessage(`⚠️ Choix invalide. Utilise A, B ou N.`,threadID,messageID);
      if(amount<MIN_BET) return api.sendMessage(`💵 Mise minimale : ${MIN_BET}$`,threadID,messageID);
      if(user.money<amount) return api.sendMessage(`❌ Solde insuffisant.`,threadID,messageID);

      user.money-=amount;
      match.bets.push({user:senderID,choice,amount,odds:match.odds[choice],threadID});
      saveData(data);
      saveMatches();

      api.sendMessage(`✅ Pari enregistré sur **${match.teamA.name} vs ${match.teamB.name}**\n🧾 Mise : ${amount}$ | Choix : ${choice}\n⌛ Attends 30 secondes pour le résultat...`,threadID,messageID);

      setTimeout(()=>{
        match.status="closed";
        match.result = resolveMatch(match);
        saveMatches();

        const userBet = match.bets.find(b=>b.user===senderID);
        if(!userBet) return;

        if(userBet.choice===match.result){
          const gain = Math.floor(userBet.amount*userBet.odds);
          user.money+=gain;
          saveData(data);
          return api.sendMessage(`🎉 ${user.name}, tu as **gagné ${gain}$** sur ${match.teamA.name} 🆚 ${match.teamB.name} ! 🏆`,threadID);
        }else{
          return api.sendMessage(`💥 ${user.name}, tu as perdu ton pari sur ${match.teamA.name} 🆚 ${match.teamB.name}. 😢`,threadID);
        }
      },30000);
    }
  }
};
