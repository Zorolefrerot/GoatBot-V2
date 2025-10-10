const { getStreamFromURL } = global.utils;

// PV max par Pokémon
const MAX_PV = 200;

// modules locaux (doivent être dans le même dossier que rp.js)
const POKEMONS = require("pokemon.js");
const VF = require("vf.js");

// image de bienvenue
const WELCOME_IMAGE = "https://i.ibb.co/pj62rsnr/image.jpg";

module.exports = {
  config: {
    name: "RP",
    version: "1.3",
    author: "𝗠𝗘𝗥𝗗𝗜 𝗠𝗔𝗗𝗜𝗠𝗕𝗔 💫",
    role: 0,
    description: "💥 Combat Pokémon entre deux joueurs — actions: A,X,Y,B",
    category: "🎮 Combat",
    guide: "⚡ /RP @Joueur2  → lance le duel (répondre au message par `start`)"
  },

  // start: lancement initial (création du combat + message de bienvenue)
  onStart: async function ({ args, event, api, usersData }) {
    if (!args[0]) return api.sendMessage("⚠️ Veuillez taguer ou donner l'UID du joueur 2 pour commencer le combat.", event.threadID);

    // préparation joueurs
    const p1id = event.senderID;
    const p2id = args[0].replace(/[^0-9]/g, "");
    if (!p2id) return api.sendMessage("❌ UID invalide.", event.threadID);

    const p1name = await usersData.getName(p1id);
    const p2name = await usersData.getName(p2id);

    // clé unique du combat (ordre stable)
    const combatKey = `${p1id}_${p2id}`;

    // initialize combat object
    const combat = {
      key: combatKey,
      players: [
        { id: p1id, name: p1name, pokemons: [], currentIndex: 0 },
        { id: p2id, name: p2name, pokemons: [], currentIndex: 0 }
      ],
      turn: 0, // index du joueur courant (0 ou 1)
      phase: "waiting", // waiting -> choose -> fight -> finished
      createdAt: Date.now(),
      log: []
    };

    // save globally
    global.GoatBot.RPCombat = global.GoatBot.RPCombat || new Map();
    global.GoatBot.RPCombat.set(combatKey, combat);

    // welcome message (avec image si possible)
    const body =
`⚡🔥 **Bienvenue au Combat Pokémon !** 🔥⚡
─────────────────────────────
🎮 Joueurs : ${p1name} VS ${p2name}
🎯 Chaque Pokémon a ${MAX_PV} PV.
💡 Pour débuter le choix des Pokémon, **réponds à ce message** avec : \`start\`
─────────────────────────────`;

    let attachment;
    try {
      attachment = await getStreamFromURL(WELCOME_IMAGE);
    } catch {
      attachment = null;
    }

    try {
      const info = await api.sendMessage(attachment ? { body, attachment } : body, event.threadID);
      // enregistre le message du bot pour capter le "start"
      global.GoatBot.onReply = global.GoatBot.onReply || new Map();
      global.GoatBot.onReply.set(info.messageID, {
        commandName: "RP",
        type: "awaitStart",
        combatKey
      });
    } catch (err) {
      // fallback : envoi simple
      await api.sendMessage(body, event.threadID);
    }
  },

  // onReply : sera appelé par le framework quand un utilisateur répond à un message du bot
  onReply: async function ({ api, event, Reply, args, usersData }) {
    try {
      if (!Reply || !Reply.type) return; // pas notre mapping

      const combatKey = Reply.combatKey;
      if (!combatKey) return;

      global.GoatBot.RPCombat = global.GoatBot.RPCombat || new Map();
      const combat = global.GoatBot.RPCombat.get(combatKey);
      if (!combat) return api.sendMessage("❌ Combat introuvable ou expiré.", event.threadID);

      // helper pour récupérer joueur / adversaire
      const getPlayerIndex = (uid) => (combat.players[0].id === uid ? 0 : combat.players[1].id === uid ? 1 : -1);
      const playerIndex = getPlayerIndex(event.senderID);
      if (playerIndex === -1) return api.sendMessage("❌ Tu ne fais pas partie de ce combat.", event.threadID);
      const player = combat.players[playerIndex];
      const opponent = combat.players[1 - playerIndex];

      // --- A/ START: démarrer la phase de choix
      if (Reply.type === "awaitStart") {
        // n'importe lequel des deux peut lancer par réponse "start"
        const body = (event.body || args.join(" ") || "").trim().toLowerCase();
        if (body !== "start") return api.sendMessage("ℹ️ Réponds par `start` pour débuter le choix des Pokémon.", event.threadID);

        // passe en phase de choix et demande au joueur 0 de choisir
        combat.phase = "choose";
        combat.turn = 0; // joueur 0 commence le choix
        const chooser = combat.players[combat.turn];

        // créer texte listant les pokemons (indexés)
        const listText = POKEMONS.map((p, i) => `${i + 1}. ${p.name} (${Array.isArray(p.type) ? p.type.join(", ") : p.type})`).join("\n");
        const prompt =
`📜 **Liste des Pokémon disponibles :**
${listText}
─────────────────────────────
🎯 ${chooser.name}, choisis **3 Pokémon** en répondant à CE message avec : \`+choose 1,2,3\`
(Exemple : +choose 1,5,12)`;

        const info = await api.sendMessage(prompt, event.threadID);
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "RP",
          type: "choose",
          combatKey,
          expectedPlayer: chooser.id
        });
        return;
      }

      // --- B/ CHOOSE : recevoir le choix de 3 pokémon (réponse au message de la liste)
      if (Reply.type === "choose") {
        // vérifier que la bonne personne répond
        if (Reply.expectedPlayer && Reply.expectedPlayer !== event.senderID) {
          return api.sendMessage("❌ Ce n'est pas à toi de choisir maintenant.", event.threadID);
        }

        // parse choix
        const text = (event.body || args.join(" ") || "").replace(/\+choose|\s+/ig, "").trim();
        const parts = text.split(",").map(s => parseInt(s)).filter(n => Number.isInteger(n) && n >= 1 && n <= POKEMONS.length);
        if (parts.length !== 3) return api.sendMessage("⚠️ Tu dois choisir *exactement* 3 numéros valides séparés par des virgules (ex: +choose 1,2,3).", event.threadID);

        // enregistrer choix du joueur
        const playerIdx = getPlayerIndex(event.senderID);
        combat.players[playerIdx].pokemons = parts.map(i => {
          const base = POKEMONS[i - 1];
          return {
            name: base.name,
            type: base.type,
            techniques: base.techniques || base.techniques || {},
            pv: MAX_PV,
            ultimateUsed: false
          };
        });
        combat.players[playerIdx].currentIndex = 0;

        await api.sendMessage(`✅ ${combat.players[playerIdx].name} a choisi : ${combat.players[playerIdx].pokemons.map(p => p.name).join(", ")}`, event.threadID);

        // si l'autre n'a pas encore choisi → demander à l'autre
        const otherIdx = 1 - playerIdx;
        if (!combat.players[otherIdx].pokemons.length) {
          combat.turn = otherIdx;
          const chooser = combat.players[otherIdx];
          const info = await api.sendMessage(`🎯 ${chooser.name}, à toi de choisir tes 3 Pokémon maintenant. Réponds avec : \`+choose 1,2,3\``, event.threadID);
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "RP",
            type: "choose",
            combatKey,
            expectedPlayer: chooser.id
          });
          return;
        }

        // si les deux ont choisi → démarrer le combat
        if (combat.players[0].pokemons.length && combat.players[1].pokemons.length) {
          combat.phase = "fight";
          combat.turn = 0; // joueur 0 commence le combat
          return startRound(api, event.threadID, combatKey);
        }
        return;
      }

      // --- C/ ACTION : on reçoit l'action du joueur courant (A/X/Y/B)
      if (Reply.type === "action") {
        // vérifier player autorisé
        if (Reply.expectedPlayer && Reply.expectedPlayer !== event.senderID) {
          return api.sendMessage("❌ Ce n'est pas à toi de jouer maintenant.", event.threadID);
        }
        const text = (event.body || args.join(" ") || "").trim().toUpperCase();
        return handleAction(api, event.threadID, combatKey, text, event.senderID);
      }

      // --- D/ CHANGEPKM : réponse au prompt de changement de pokémon
      if (Reply.type === "changePokemon") {
        if (Reply.expectedPlayer && Reply.expectedPlayer !== event.senderID) {
          return api.sendMessage("❌ Ce n'est pas à toi de changer maintenant.", event.threadID);
        }
        const num = parseInt((event.body || args.join(" ") || "").trim());
        if (!Number.isInteger(num) || num < 1 || num > 3) return api.sendMessage("⚠️ Choix invalide. Réponds avec 1, 2 ou 3.", event.threadID);

        const playerIdx = getPlayerIndex(event.senderID);
        const playerObj = combat.players[playerIdx];
        const chosen = playerObj.pokemons[num - 1];
        if (!chosen || chosen.pv <= 0) return api.sendMessage("❌ Pokémon invalide ou KO.", event.threadID);

        playerObj.currentIndex = num - 1;
        await api.sendMessage(`🔄 ${playerObj.name} envoie ${chosen.name} au combat !`, event.threadID);
        // après changement, continuer le round : l'action du joueur est consommée => passe au tour adversaire
        combat.turn = 1 - playerIdx;
        return startRound(api, event.threadID, combatKey);
      }

      // else: ignore
    } catch (err) {
      logError(err);
      return api.sendMessage("❌ Une erreur est survenue lors du traitement.", event.threadID);
    }
  }
};

/* ---------- fonctions auxiliaires ---------- */

async function startRound(api, threadID, combatKey) {
  // envoie le prompt du tour courant et enregistre mapping 'action'
  const combat = global.GoatBot.RPCombat.get(combatKey);
  if (!combat) return api.sendMessage("❌ Combat introuvable.", threadID);

  // vérifie fin
  const alive0 = combat.players[0].pokemons.filter(p => p.pv > 0).length;
  const alive1 = combat.players[1].pokemons.filter(p => p.pv > 0).length;
  if (alive0 === 0 || alive1 === 0) {
    const winner = alive0 > 0 ? combat.players[0].name : combat.players[1].name;
    await api.sendMessage(`🏆 Fin du combat — ${winner} remporte la victoire !`, threadID);
    global.GoatBot.RPCombat.delete(combatKey);
    return;
  }

  const pIdx = combat.turn;
  const player = combat.players[pIdx];
  const opponent = combat.players[1 - pIdx];
  const pCurr = player.pokemons[player.currentIndex];
  const oCurr = opponent.pokemons[opponent.currentIndex];

  const status =
`🔥 Tour de ${player.name} (réponds à CE message)
─────────────────────────────
🧾 ${player.name} — ${pCurr.name} — PV: ${pCurr.pv}/${MAX_PV}
🆚
🧾 ${opponent.name} — ${oCurr.name} — PV: ${oCurr.pv}/${MAX_PV}
─────────────────────────────
Actions :
• \`A\` — Attaque normale
• \`X\` — Attaque ultime (1× par Pokémon)
• \`Y\` — Technique spéciale (soin / boost)
• \`B\` — Changer de Pokémon (répondre ensuite par 1,2 ou 3)
Choose!`;

  const info = await api.sendMessage(status, threadID);
  global.GoatBot.onReply.set(info.messageID, {
    commandName: "RP",
    type: "action",
    combatKey,
    expectedPlayer: player.id
  });
}

async function handleAction(api, threadID, combatKey, text, senderID) {
  const combat = global.GoatBot.RPCombat.get(combatKey);
  if (!combat) return api.sendMessage("❌ Combat introuvable.", threadID);

  const pIdx = combat.players[0].id === senderID ? 0 : 1;
  const player = combat.players[pIdx];
  const opponent = combat.players[1 - pIdx];
  const pCurr = player.pokemons[player.currentIndex];
  const oCurr = opponent.pokemons[opponent.currentIndex];

  // validate alive
  if (!pCurr || pCurr.pv <= 0) return api.sendMessage("❌ Ton Pokémon actif est KO. Change-le.", threadID);

  // action handler
  if (text === "A") {
    const dmg = randInt(10, 30);
    oCurr.pv -= dmg;
    const phrase = VF.attack(pCurr.name, dmg, oCurr.name);
    await api.sendMessage(`⚔️ ${phrase}\n💖 PV ${oCurr.name}: ${Math.max(0, oCurr.pv)}/${MAX_PV}`, threadID);
  } else if (text === "X") {
    if (pCurr.ultimateUsed) return api.sendMessage("❌ Cette attaque ultime a déjà été utilisée par ce Pokémon !", threadID);
    const dmg = randInt(30, 80);
    oCurr.pv -= dmg;
    pCurr.ultimateUsed = true;
    const phrase = VF.ultimate(pCurr.name, dmg, oCurr.name);
    await api.sendMessage(`💥 ${phrase}\n💖 PV ${oCurr.name}: ${Math.max(0, oCurr.pv)}/${MAX_PV}`, threadID);
  } else if (text === "Y") {
    const heal = randInt(10, 40);
    pCurr.pv = Math.min(MAX_PV, pCurr.pv + heal);
    const phrase = VF.special(pCurr.name, heal);
    await api.sendMessage(`🛡️ ${phrase}\n💖 PV ${pCurr.name}: ${pCurr.pv}/${MAX_PV}`, threadID);
  } else if (text === "B") {
    // prompt change
    const prompt = `⚡ Réponds à CE message avec le numéro du Pokémon à envoyer (1,2,3).`;
    const info = await api.sendMessage(prompt, threadID);
    global.GoatBot.onReply.set(info.messageID, {
      commandName: "RP",
      type: "changePokemon",
      combatKey,
      expectedPlayer: senderID
    });
    return;
  } else {
    return api.sendMessage("⚠️ Action invalide. Utilise A, X, Y ou B.", threadID);
  }

  // après action, vérifier KO du pokemon adverse
  if (oCurr.pv <= 0) {
    await api.sendMessage(`💥 ${oCurr.name} est KO !`, threadID);
    const remaining = opponent.pokemons.filter(p => p.pv > 0);
    if (remaining.length === 0) {
      await api.sendMessage(`🏆 ${player.name} a gagné le combat !`, threadID);
      global.GoatBot.RPCombat.delete(combatKey);
      return;
    } else {
      // auto-send next available pokemon
      opponent.currentIndex = opponent.pokemons.findIndex(p => p.pv > 0);
      await api.sendMessage(`⚡ ${opponent.name} envoie ${opponent.pokemons[opponent.currentIndex].name} au combat !`, threadID);
    }
  }

  // switch turn and start next round prompt
  combat.turn = 1 - combat.turn;
  return startRound(api, threadID, combatKey);
}

/* helpers */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function logError(e) {
  try { console.error(e); } catch {}
                                      }
