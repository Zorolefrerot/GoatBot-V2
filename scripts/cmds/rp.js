const { getStreamsFromAttachment, log } = global.utils;
const fs = require("fs");
const path = require("path");

// Import Pokémon et phrases depuis le même dossier
const POKEMONS = require("pokemon.js"); // pas besoin de ./ si dans le même dossier
const VF = require("vf.js"); // phrases interactives

const MAX_PV = 200;

module.exports = {
  config: {
    name: "RP",
    version: "1.2",
    author: "𝗠𝗘𝗥𝗗𝗜 𝗠𝗔𝗗𝗜𝗠𝗕𝗔 💫",
    role: 0,
    description: "💥 Combat Pokémon entre deux joueurs avec choix de technique (A,X,Y,B)",
    category: "🎮 Combat",
    guide: "⚡ Utilisation : /RP @Joueur2 ou /RP <UID_Joueur2>"
  },

  onStart: async function({ args, event, message, usersData, api }) {
    if (!args[0]) return message.reply("⚠️ Veuillez taguer ou donner l'UID du joueur 2 pour commencer le combat.");

    const player1 = {
      id: event.senderID,
      name: await usersData.getName(event.senderID),
      pokemons: [],
      currentPokemon: null
    };

    const player2ID = args[0].replace(/[^0-9]/g, "");
    const player2Name = await usersData.getName(player2ID);
    const player2 = {
      id: player2ID,
      name: player2Name,
      pokemons: [],
      currentPokemon: null
    };

    const welcomeMsg = {
      body: `⚡🔥 **Bienvenue au Combat Pokémon !** 🔥⚡
─────────────────────────────
🎮 Joueurs : ${player1.name} VS ${player2.name}
🎯 Chaque Pokémon a ${MAX_PV} PV
💡 Pour débuter le choix des Pokémon, écrivez \`start\`
─────────────────────────────`,
      attachment: await getStreamsFromAttachment([{
        type: "photo",
        url: "https://i.ibb.co/pj62rsnr/image.jpg"
      }])
    };

    await api.sendMessage(welcomeMsg, event.threadID);

    const combat = {
      players: [player1, player2],
      turn: 0,
      active: false,
      choosing: false,
      log: []
    };

    global.GoatBot.RPCombat = global.GoatBot.RPCombat || new Map();
    global.GoatBot.RPCombat.set(`${player1.id}_${player2.id}`, combat);
  },

  onReply: async function({ args, event, message, usersData, api }) {
    const combatKey = Array.from(global.GoatBot.RPCombat.keys()).find(key => key.includes(event.senderID));
    if (!combatKey) return;
    const combat = global.GoatBot.RPCombat.get(combatKey);
    const player = combat.players.find(p => p.id === event.senderID);
    const opponent = combat.players.find(p => p.id !== event.senderID);

    // Début du choix
    if (!combat.active && args[0].toLowerCase() === "start") {
      combat.active = true;
      combat.choosing = true;
      combat.turn = 0;
      const currentPlayer = combat.players[combat.turn];

      return message.reply(
        `📜 **Liste des Pokémon disponibles :**\n` +
        `${POKEMONS.map((p, i) => `${i + 1}. ${p.name} (${p.type.join(", ")})`).join("\n")}\n\n` +
        `🎯 ${currentPlayer.name}, choisissez vos 3 Pokémon en envoyant :\n\`+choose 1,2,3\``
      );
    }

    // Choix des Pokémon
    if (combat.choosing) {
      const indexes = args.join(" ").split(",").map(n => parseInt(n.trim()) - 1);
      if (indexes.length !== 3) return message.reply("⚠️ Vous devez choisir exactement 3 Pokémon en envoyant leurs numéros !");

      player.pokemons = indexes.map(i => ({
        ...POKEMONS[i],
        pv: MAX_PV,
        ultimateUsed: false
      }));
      player.currentPokemon = player.pokemons[0];
      message.reply(`✅ ${player.name} a choisi : ${player.pokemons.map(p => p.name).join(", ")}`);

      if (combat.turn === 0) {
        combat.turn = 1;
        const nextPlayer = combat.players[combat.turn];
        return message.reply(
          `🎯 ${nextPlayer.name}, choisissez vos 3 Pokémon en envoyant :\n\`+choose 1,2,3\``
        );
      } else {
        combat.choosing = false;
        combat.turn = 0;
        return api.sendMessage(
          `🔥 **Le combat commence !** 🔥\n${combat.players[0].name} vs ${combat.players[1].name}\n` +
          `Premier Pokémon actif : ${combat.players[0].currentPokemon.name} VS ${combat.players[1].currentPokemon.name}\n` +
          `💡 Actions : A (attaque), X (attaque ultime), Y (technique spéciale), B (changer de Pokémon)`,
          event.threadID
        );
      }
    }

    // Combat
    if (!combat.active || combat.choosing) return;

    const action = args[0].toUpperCase();
    const currentPoke = player.currentPokemon;

    if (!["A", "X", "Y", "B"].includes(action)) return message.reply("⚠️ Action invalide. Utilisez A, X, Y ou B.");

    // Attaque normale
    if (action === "A") {
      const damage = Math.floor(Math.random() * 20) + 10;
      opponent.currentPokemon.pv -= damage;
      const phrase = VF.attack(player.currentPokemon.name, damage, opponent.currentPokemon.name);
      combat.log.push(phrase);
      message.reply(`⚔️ ${phrase}\n💖 PV de ${opponent.currentPokemon.name} : ${opponent.currentPokemon.pv}/200`);
    }

    // Technique ultime
    if (action === "X") {
      if (currentPoke.ultimateUsed) return message.reply("❌ Cette technique ultime a déjà été utilisée !");
      const damage = Math.floor(Math.random() * 50) + 30;
      opponent.currentPokemon.pv -= damage;
      currentPoke.ultimateUsed = true;
      const phrase = VF.ultimate(player.currentPokemon.name, damage, opponent.currentPokemon.name);
      combat.log.push(phrase);
      message.reply(`💥 ${phrase}\n💖 PV de ${opponent.currentPokemon.name} : ${opponent.currentPokemon.pv}/200`);
    }

    // Technique spéciale
    if (action === "Y") {
      const effect = Math.floor(Math.random() * 30) + 10;
      currentPoke.pv += effect;
      if (currentPoke.pv > MAX_PV) currentPoke.pv = MAX_PV;
      const phrase = VF.special(player.currentPokemon.name, effect);
      combat.log.push(phrase);
      message.reply(`🛡️ ${phrase}\n💖 PV de ${currentPoke.name} : ${currentPoke.pv}/200`);
    }

    // Changer de Pokémon
    if (action === "B") {
      message.reply(`⚡ Choisissez le numéro du Pokémon à envoyer (1, 2 ou 3) :`);
      global.GoatBot.onReply.set(event.messageID, {
        commandName: "RP",
        type: "changePokemon",
        playerID: player.id
      });
      return;
    }

    // Vérification KO
    if (opponent.currentPokemon.pv <= 0) {
      message.reply(`💥 ${opponent.currentPokemon.name} est KO !`);
      const remaining = opponent.pokemons.filter(p => p.pv > 0);
      if (remaining.length === 0) {
        combat.active = false;
        return message.reply(`🏆 ${player.name} a gagné le combat !`);
      } else {
        opponent.currentPokemon = remaining[0];
        message.reply(`⚡ ${opponent.name} envoie ${opponent.currentPokemon.name} au combat !`);
      }
    }

    combat.turn = combat.turn === 0 ? 1 : 0;
  },

  onChangePokemon: async function({ args, event, message }) {
    const change = parseInt(args[0].trim()) - 1;
    const combatKey = Array.from(global.GoatBot.RPCombat.keys()).find(key => key.includes(event.senderID));
    if (!combatKey) return;
    const combat = global.GoatBot.RPCombat.get(combatKey);
    const player = combat.players.find(p => p.id === event.senderID);

    if (!player.pokemons[change] || player.pokemons[change].pv <= 0) 
      return message.reply("❌ Pokémon invalide ou KO !");
    
    player.currentPokemon = player.pokemons[change];
    message.reply(`🔄 ${player.name} a changé de Pokémon ! Nouveau Pokémon actif : ${player.currentPokemon.name}`);
  }
};
