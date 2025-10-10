const fs = require("fs");
const path = require("path");
const { getStreamFromURL } = global.utils;

const MAX_PV = 200;

// --- Fichiers JSON ---
const POKEMON_FILE = path.join(__dirname, "pokemon.json");
const VF_FILE = path.join(__dirname, "vf.json");

let POKEMONS = [];
let VF = {};
try { POKEMONS = JSON.parse(fs.readFileSync(POKEMON_FILE, "utf8")); } catch(e) { console.error("Erreur pokemon.json", e); }
try { VF = JSON.parse(fs.readFileSync(VF_FILE, "utf8")); } catch(e) { console.error("Erreur vf.json", e); }

// --- Image de bienvenue ---
const WELCOME_IMAGE = "https://i.ibb.co/pj62rsnr/image.jpg";

// --- Global maps ---
global.GoatBot = global.GoatBot || {};
global.GoatBot.RPCombat = global.GoatBot.RPCombat || new Map();
global.GoatBot.onReply = global.GoatBot.onReply || new Map();

// --- Helpers ---
function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function randomVF(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function logError(e){ try{ console.error(e); } catch{} }

module.exports = {
  config: {
    name: "RP",
    version: "1.7",
    author: "𝗠𝗘𝗥𝗗𝗜 𝗠𝗔𝗗𝗜𝗠𝗕𝗔 💫",
    role: 0,
    description: "💥 Combat Pokémon entre deux joueurs — actions: A,X,Y,B",
    category: "🎮 Combat",
    guide: "⚡ /RP @Joueur2 → lance le duel (répondre par `start`)"
  },

  // --- DÉBUT DU COMBAT ---
  onStart: async function({ args, event, api, usersData }) {
    try {
      if(!args[0]) return api.sendMessage("⚠️ Tag ou UID du joueur 2 manquant.", event.threadID);

      const p1id = event.senderID;
      const p2id = args[0].replace(/[^0-9]/g,"");
      if(!p2id || p2id===p1id) return api.sendMessage("❌ UID invalide ou identique.", event.threadID);

      const p1name = await usersData.getName(p1id).catch(()=>`Joueur-${p1id}`);
      const p2name = await usersData.getName(p2id).catch(()=>`Joueur-${p2id}`);
      const combatKey = `${p1id}_${p2id}`;

      const combat = {
        key: combatKey,
        players:[
          { id:p1id, name:p1name, pokemons:[], currentIndex:0 },
          { id:p2id, name:p2name, pokemons:[], currentIndex:0 }
        ],
        turn:0,
        phase:"waiting",
        createdAt:Date.now(),
        log:[]
      };

      global.GoatBot.RPCombat.set(combatKey, combat);

      const body = `⚡🔥 **Bienvenue au Combat Pokémon !** 🔥⚡
─────────────────────────────
🎮 Joueurs : ${p1name} VS ${p2name}
🎯 Chaque Pokémon a ${MAX_PV} PV.
💡 Réponds à CE message avec : \`start\` pour commencer.
─────────────────────────────`;

      let attachment = null;
      try{ attachment = await getStreamFromURL(WELCOME_IMAGE); } catch{}

      const info = attachment
        ? await api.sendMessage({ body, attachment }, event.threadID)
        : await api.sendMessage(body, event.threadID);

      global.GoatBot.onReply.set(info.messageID,{
        commandName:"RP",
        type:"awaitStart",
        combatKey
      });
    } catch(e){ logError(e); }
  },

  // --- GESTION DES RÉPONSES ---
  onReply: async function({ api, event, Reply, args, usersData }) {
    try {
      if(!Reply || !Reply.type) return;
      const combatKey = Reply.combatKey;
      if(!combatKey) return;

      const combat = global.GoatBot.RPCombat.get(combatKey);
      if(!combat) return api.sendMessage("❌ Combat introuvable.", event.threadID);

      const getPlayerIndex = uid => combat.players[0].id===uid?0:combat.players[1].id===uid?1:-1;
      const playerIndex = getPlayerIndex(event.senderID);
      if(playerIndex===-1) return api.sendMessage("❌ Tu ne fais pas partie de ce combat.", event.threadID);

      const player = combat.players[playerIndex];
      const opponent = combat.players[1-playerIndex];

      // --- PHASE START ---
      if(Reply.type==="awaitStart"){
        const text = (event.body || args.join(" ") || "").trim().toLowerCase();
        if(text!=="start") return api.sendMessage("ℹ️ Réponds par `start` pour débuter le choix des Pokémon.", event.threadID);

        combat.phase="choose"; combat.turn=0;
        const chooser = combat.players[0];
        const listText = POKEMONS.map((p,i)=>`${i+1}. ${p.name} (${Array.isArray(p.type)?p.type.join(","):p.type})`).join("\n");
        const prompt=`📜 Liste des Pokémon :\n${listText}\n─────────────────────────────\n🎯 ${chooser.name}, choisis 3 Pokémon en répondant : \`+choose 1,2,3\``;
        const info = await api.sendMessage(prompt,event.threadID);
        global.GoatBot.onReply.set(info.messageID,{commandName:"RP",type:"choose",combatKey,expectedPlayer:chooser.id});
        return;
      }

      // --- PHASE CHOOSE ---
      if(Reply.type==="choose"){
        if(Reply.expectedPlayer && Reply.expectedPlayer!==event.senderID)
          return api.sendMessage("❌ Ce n'est pas ton tour de choisir.", event.threadID);

        const raw = (event.body||args.join(" ")||"").replace(/\+choose/ig,"").trim();
        const parts = Array.from(new Set(raw.split(",").map(n=>parseInt(n.trim()))))
          .filter(n=>!isNaN(n) && n>=1 && n<=POKEMONS.length);
        if(parts.length!==3) return api.sendMessage("⚠️ Choisis exactement 3 Pokémon valides.", event.threadID);

        player.pokemons=parts.map(i=>{
          const base=POKEMONS[i-1];
          return {
            name: base.name,
            type: base.type,
            techniques: base.techniques,
            pv: MAX_PV,
            ultimateUsed:false
          };
        });
        player.currentIndex=0;
        await api.sendMessage(`✅ ${player.name} a choisi : ${player.pokemons.map(p=>p.name).join(", ")}`,event.threadID);

        const otherIdx=1-playerIndex;
        if(!combat.players[otherIdx].pokemons.length){
          const chooser=combat.players[otherIdx];
          const info=await api.sendMessage(`🎯 ${chooser.name}, choisis 3 Pokémon avec \`+choose 1,2,3\``,event.threadID);
          global.GoatBot.onReply.set(info.messageID,{commandName:"RP",type:"choose",combatKey,expectedPlayer:chooser.id});
          return;
        }

        // tous ont choisi → combat
        combat.phase="fight"; combat.turn=0;
        return startRound(api,event.threadID,combatKey);
      }

      // --- PHASE ACTION ---
      if(Reply.type==="action"){
        if(Reply.expectedPlayer && Reply.expectedPlayer!==event.senderID)
          return api.sendMessage("❌ Ce n'est pas à toi de jouer maintenant.", event.threadID);
        const text=(event.body||args.join(" ")||"").trim().toUpperCase();
        return handleAction(api,event.threadID,combatKey,text,event.senderID);
      }

      // --- PHASE CHANGE POKEMON ---
      if(Reply.type==="changePokemon"){
        if(Reply.expectedPlayer && Reply.expectedPlayer!==event.senderID)
          return api.sendMessage("❌ Ce n'est pas à toi de changer maintenant.", event.threadID);

        const num=parseInt((event.body||args.join(" ")||"").trim());
        if(isNaN(num)||num<1||num>3) return api.sendMessage("⚠️ Choix invalide (1,2,3).",event.threadID);

        const chosen = player.pokemons[num-1];
        if(!chosen || chosen.pv<=0) return api.sendMessage("❌ Pokémon invalide ou KO.",event.threadID);

        player.currentIndex=num-1;
        await api.sendMessage(`🔄 ${player.name} envoie ${chosen.name} au combat !`,event.threadID);
        combat.turn=1-playerIndex;
        return startRound(api,event.threadID,combatKey);
      }

    } catch(e){ logError(e); api.sendMessage("❌ Une erreur est survenue.", event.threadID); }
  }
};

/* ---------- FONCTIONS DE COMBAT ---------- */
async function startRound(api,threadID,combatKey){
  const combat=global.GoatBot.RPCombat.get(combatKey);
  if(!combat) return api.sendMessage("❌ Combat introuvable.",threadID);

  const alive0 = combat.players[0].pokemons.filter(p=>p.pv>0).length;
  const alive1 = combat.players[1].pokemons.filter(p=>p.pv>0).length;
  if(alive0===0 || alive1===0){
    const winner = alive0>0?combat.players[0].name:combat.players[1].name;
    await api.sendMessage(`🏆 Fin du combat — ${winner} remporte la victoire !`,threadID);
    global.GoatBot.RPCombat.delete(combatKey);
    return;
  }

  const pIdx = combat.turn;
  const player = combat.players[pIdx];
  const opponent = combat.players[1-pIdx];
  const pCurr = player.pokemons[player.currentIndex];
  const oCurr = opponent.pokemons[opponent.currentIndex];

  const status=`🔥 Tour de ${player.name} (réponds à CE message)
─────────────────────────────
🧾 ${player.name} — ${pCurr.name} — PV: ${pCurr.pv}/${MAX_PV}
🆚
🧾 ${opponent.name} — ${oCurr.name} — PV: ${oCurr.pv}/${MAX_PV}
─────────────────────────────
Actions :
• \`A\` — Attaque normale
• \`X\` — Attaque ultime (1× par Pokémon)
• \`Y\` — Technique spéciale
• \`B\` — Changer de Pokémon
─────────────────────────────
💡 Réponds à ce message avec A, X, Y ou B pour agir !`;

  const info = await api.sendMessage(status, threadID);
  global.GoatBot.onReply.set(info.messageID,{
    commandName:"RP",
    type:"action",
    combatKey,
    expectedPlayer: player.id
  });
}

async function handleAction(api, threadID, combatKey, text, senderID){
  const combat = global.GoatBot.RPCombat.get(combatKey);
  if(!combat) return api.sendMessage("❌ Combat introuvable.", threadID);

  const pIdx = combat.players[0].id===senderID?0:1;
  const player = combat.players[pIdx];
  const opponent = combat.players[1-pIdx];
  const pCurr = player.pokemons[player.currentIndex];
  const oCurr = opponent.pokemons[opponent.currentIndex];

  if(!pCurr || pCurr.pv<=0) return api.sendMessage("❌ Ton Pokémon actif est KO.", threadID);

  try {
    if(text==="A"){
      const dmg=randInt(10,30);
      oCurr.pv=Math.max(0,oCurr.pv-dmg);
      const phrase=randomVF(VF.attack)
        .replace("{attacker}", pCurr.name)
        .replace("{target}", oCurr.name)
        .replace("{move}", pCurr.techniques.attack)
        .replace("{damage}", dmg);
      await api.sendMessage(`⚔️ ${phrase}\n💖 PV ${oCurr.name}: ${oCurr.pv}/${MAX_PV}`, threadID);

    } else if(text==="X"){
      if(pCurr.ultimateUsed) return api.sendMessage("❌ Cette attaque ultime a déjà été utilisée !", threadID);
      const dmg=randInt(30,80);
      oCurr.pv=Math.max(0,oCurr.pv-dmg); pCurr.ultimateUsed=true;
      const phrase=randomVF(VF.ultimate)
        .replace("{attacker}", pCurr.name)
        .replace("{target}", oCurr.name)
        .replace("{move}", pCurr.techniques.ultimate)
        .replace("{damage}", dmg);
      await api.sendMessage(`💥 ${phrase}\n💖 PV ${oCurr.name}: ${oCurr.pv}/${MAX_PV}`, threadID);

    } else if(text==="Y"){
      const heal=randInt(10,40);
      pCurr.pv=Math.min(MAX_PV,pCurr.pv+heal);
      const phrase=randomVF(VF.special)
        .replace("{attacker}", pCurr.name)
        .replace("{heal}", heal);
      await api.sendMessage(`✨ ${phrase}\n💖 PV ${pCurr.name}: ${pCurr.pv}/${MAX_PV}`, threadID);

    } else if(text==="B"){
      // Changement Pokémon
      const alivePokemons = player.pokemons.map((p,i)=>({p,i})).filter(x=>x.p.pv>0 && i!==player.currentIndex);
      if(alivePokemons.length===0) return api.sendMessage("⚠️ Aucun autre Pokémon disponible pour changer.", threadID);

      const choices = alivePokemons.map(x=>`${x.i+1}. ${x.p.name}`).join(", ");
      const info = await api.sendMessage(`🔄 ${player.name}, choisis un Pokémon pour remplacer ${pCurr.name} :\n${choices}\nRéponds par le numéro du Pokémon.`, threadID);
      global.GoatBot.onReply.set(info.messageID,{
        commandName:"RP",
        type:"changePokemon",
        combatKey,
        expectedPlayer: player.id
      });
      return;
    } else {
      return api.sendMessage("⚠️ Réponse invalide. Utilise A, X, Y ou B.", threadID);
    }

    // --- Vérification KO ---
    if(oCurr.pv<=0){
      const phraseKO=randomVF(VF.ko).replace("{pokemon}", oCurr.name).replace("{attacker}", pCurr.name);
      await api.sendMessage(`💀 ${phraseKO}`, threadID);

      const aliveOpponent = opponent.pokemons.filter(p=>p.pv>0);
      if(aliveOpponent.length===0){
        await api.sendMessage(`🏆 ${player.name} remporte le combat !`, threadID);
        global.GoatBot.RPCombat.delete(combatKey);
        return;
      } else {
        // Choix nouveau Pokémon automatique pour l'adversaire
        const nextIdx = opponent.pokemons.findIndex(p=>p.pv>0);
        opponent.currentIndex = nextIdx;
        await api.sendMessage(`🔄 ${opponent.name} envoie ${opponent.pokemons[nextIdx].name} au combat !`, threadID);
      }
    }

    // --- Passage au tour suivant ---
    combat.turn = 1 - combat.turn;
    return startRound(api, threadID, combatKey);

  } catch(e){ logError(e); api.sendMessage("❌ Une erreur est survenue durant l'action.", threadID); }
}
