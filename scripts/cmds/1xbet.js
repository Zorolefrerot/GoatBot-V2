const fs = require("fs");
const path = require("path");

// --- Fichiers ---
const dataFile = path.join(__dirname,"1xbet-data.json");
const matchesFile = path.join(__dirname,"1xbet-matches.json");
const teamsFile = path.join(__dirname,"teams.json");

// --- Init fichiers ---
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
const WELCOME_IMAGE = "http://goatbiin.onrender.com/GBhPN2QYD.png"; // Image bienvenue
const ADMIN_IDS = ["1234567890"]; // remplace par ton UID

// --- Helper ---
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

// --- Tirage match ---
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

function distributeWinnings(match,api){
  const data = loadData();
  for(const b of match.bets){
    if(!data[b.user]) continue;
    if(b.choice===match.result){
      const gain = Math.floor(b.amount*b.odds);
      data[b.user].money = (data[b.user].money||0)+gain;
      api.sendMessage(`🎉 ${data[b.user].name} gagne ${gain}$ sur ${match.teamA.name} vs ${match.teamB.name} !`,b.threadID);
    }else{
      api.sendMessage(`💥 ${data[b.user].name} perd ${b.amount}$ sur ${match.teamA.name} vs ${match.teamB.name}`,b.threadID);
    }
  }
  saveData(data);
}

// --- Command ---
module.exports={
  config:{
    name:"1xbet",
    aliases:["betmatch","1x"],
    version:"3.0",
    author:"Merdi Madimba",
    role:0,
    description:"Simulation paris football",
    category:"🎮 Jeux"
  },

  onStart: async function({api,event,args}){
    const { threadID, senderID, messageID } = event;
    const data = loadData();
    if(!data[senderID]) data[senderID]={ money:0,lastDaily:0,name:"Joueur" };
    const user = data[senderID];
    const sub = args[0]?args[0].toLowerCase():null;

    if(!sub){
      const body = `⚽️🎰 Bienvenue sur 1XBET !

💵 Commandes :
/1xbet solde -> voir solde
/1xbet daily -> recevoir 200$ toutes les 24h
/1xbet matches -> voir matchs disponibles
/1xbet bet [matchID] [A|N|B] [montant] -> parier
/1xbet mybets -> tes paris
/1xbet top -> top 10 par solde
`;
      try{ const stream = await global.utils.getStreamFromURL(WELCOME_IMAGE);
        return api.sendMessage({body,attachment:stream},threadID,messageID);
      }catch(e){ return api.sendMessage(body,threadID,messageID);}
    }

    // --- Solde ---
    if(sub==="solde") return api.sendMessage(`💰 ${user.name}, ton solde est ${user.money}$`,threadID,messageID);

    // --- Daily ---
    if(sub==="daily"){
      const now = Date.now();
      if(now-(user.lastDaily||0)<24*60*60*1000){
        const remain = Math.ceil((24*60*60*1000-(now-user.lastDaily))/1000/60/60);
        return api.sendMessage(`🕒 Déjà pris. Reviens dans ${remain}h`,threadID,messageID);
      }
      user.money+=(DAILY_AMOUNT);
      user.lastDaily=now;
      saveData(data);
      return api.sendMessage(`✅ Bonus quotidien ${DAILY_AMOUNT}$ reçu ! Nouveau solde : ${user.money}$`,threadID,messageID);
    }

    // --- Matches ---
    if(sub==="matches"){
      if(matches.length<5){ // créer 5 nouveaux matchs aléatoires
        for(let i=0;i<5;i++){
          const [A,B]=randomTeams();
          matches.push({id:matches.length+1,teamA:A,teamB:B,status:"open",bets:[],resolveAt:Date.now()+60*1000});
        }
        saveMatches();
      }
      const lines = matches.map(m=>{
        const odds = computeOdds(m.teamA,m.teamB);
        return `⚽ ${m.id}. ${m.teamA.name} vs ${m.teamB.name} — ${m.status.toUpperCase()}\n🅰️${odds.A}  🟰${odds.N}  🅱️${odds.B}`;
      });
      return api.sendMessage(`🏟️ Matchs disponibles :\n${lines.join("\n\n")}`,threadID,messageID);
    }
  }
};
