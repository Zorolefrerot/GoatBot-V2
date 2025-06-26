
const characters = [
  {
    name: "Naruto",
    power: 50,
    b: "Rasengan",
    x: "Multi Clones + Rasenshuriken"
  },
  {
    name: "Naruto (Ermite)",
    power: 60,
    b: "Rasengan Géant",
    x: "Mode Ermite + Fûton Rasen Shuriken"
  },
  {
    name: "Naruto (Rikudo)",
    power: 70,
    b: "Orbe Truth Seeker",
    x: "Bijuu Mode RasenShuriken"
  },
  {
    name: "Sasuke",
    power: 55,
    b: "Chidori",
    x: "Kirin"
  },
  {
    name: "Sasuke (Taka)",
    power: 65,
    b: "Chidori Nagashi",
    x: "Susano'o"
  },
  {
    name: "Sasuke (Rinnegan)",
    power: 70,
    b: "Amaterasu",
    x: "Indra's Arrow"
  },
  {
    name: "Kakashi",
    power: 60,
    b: "Raikiri",
    x: "Kamui"
  },
  {
    name: "Minato",
    power: 65,
    b: "Hiraishin Rasengan",
    x: "Mode Kyubi + Technique du dieu volant"
  },
  {
    name: "Hashirama",
    power: 70,
    b: "Forêt Naissante",
    x: "Art Sennin - Mille Mains"
  },
  {
    name: "Tobirama",
    power: 60,
    b: "Suiton - Mur d'eau",
    x: "Edo Tensei"
  },
  {
    name: "Tsunade",
    power: 60,
    b: "Coup Surpuissant",
    x: "Sceau - Byakugô"
  },
  {
    name: "Hiruzen",
    power: 65,
    b: "Techniques des 5 éléments",
    x: "Shinigami Seal"
  },
  {
    name: "Pain (Tendo)",
    power: 68,
    b: "Shinra Tensei",
    x: "Chibaku Tensei"
  },
  {
    name: "Konan",
    power: 55,
    b: "Danse de Papier",
    x: "Mer de papiers explosifs"
  },
  {
    name: "Nagato",
    power: 68,
    b: "Absorption de chakra",
    x: "Réanimation universelle"
  },
  {
    name: "Deidara",
    power: 60,
    b: "Argile explosive C2",
    x: "Auto-destruction C0"
  },
  {
    name: "Kakuzu",
    power: 60,
    b: "Futon - Zankokuhā",
    x: "Cœurs enchaînés"
  },
  {
    name: "Hidan",
    power: 50,
    b: "Attaque Rituel",
    x: "Rituel Jashin"
  },
  {
    name: "Sasori",
    power: 58,
    b: "Marionnettes",
    x: "Armée des 100"
  },
  {
    name: "Itachi",
    power: 70,
    b: "Tsukuyomi",
    x: "Amaterasu + Susano'o"
  },
  {
    name: "Kizame",
    power: 62,
    b: "Requin géant",
    x: "Fusion avec Samehada"
  },
  {
    name: "Orochimaru",
    power: 65,
    b: "Serpents",
    x: "Mode Sage Blanc"
  },
  {
    name: "Asuma",
    power: 55,
    b: "Lames de chakra",
    x: "Mode furie"
  },
  {
    name: "Gai",
    power: 70,
    b: "Feu de la jeunesse",
    x: "8e porte - Nuit de la mort"
  },
  {
    name: "Kurenai",
    power: 45,
    b: "Genjutsu",
    x: "Piège Floral"
  },
  {
    name: "Gaara",
    power: 68,
    b: "Sable mouvant",
    x: "Armure + Sable funéraire"
  },
  {
    name: "Temari",
    power: 58,
    b: "Vent Tranchant",
    x: "Danse de la faucille"
  },
  {
    name: "Kankuro",
    power: 56,
    b: "Poupée Karasu",
    x: "Piège des trois marionnettes"
  },
  {
    name: "Hinata",
    power: 52,
    b: "Paume du Hakke",
    x: "Protection des 64 coups"
  },
  {
    name: "Neji",
    power: 60,
    b: "Hakke Rokujuuyon Shou",
    x: "Rotation du Byakugan"
  },
  {
    name: "Lee",
    power: 65,
    b: "Lotus recto",
    x: "6e porte - Paon du midi"
  },
  {
    name: "Shikamaru",
    power: 60,
    b: "Ombre manipulatrice",
    x: "Piège stratégique total"
  },
  {
    name: "Sakura",
    power: 60,
    b: "Coup Supersonique",
    x: "Sceau Byakugô déchaîné"
  },
  {
    name: "Madara",
    power: 75,
    b: "Susano'o",
    x: "Limbo + Météores"
  },
  {
    name: "Obito",
    power: 70,
    b: "Kamui",
    x: "Juubi Mode"
  },
  {
    name: "Zetsu",
    power: 40,
    b: "Attaque furtive",
    x: "Infection de corps"
  },
  {
    name: "Kaguya",
    power: 78,
    b: "Portail dimensionnel",
    x: "Os cendrés + Expansion divine"
  },
  {
    name: "Ay",
    power: 66,
    b: "Coup Raikage",
    x: "Mode Foudre"
  },
  {
    name: "Mei",
    power: 60,
    b: "Acide bouillant",
    x: "Vapeur destructrice"
  },
  {
    name: "Onoki",
    power: 65,
    b: "Technique de légèreté",
    x: "Jinton : Dématérialisation"
  },
  {
    name: "Bee",
    power: 68,
    b: "Lames à 8 sabres",
    x: "Mode Hachibi"
  },
  {
    name: "Boruto",
    power: 60,
    b: "Rasengan Invisible",
    x: "Karma activé + Jougan"
  }
];

// Étape suivante : Intégration dans le module.exports avec les choix, combat, interface visuelle, effets, stats, restrictions... veux-tu que je continue dans ce même fichier ou en créer un autre pour diviser les étapes (ex: select.js, fight.js) ?

const gameState = {};

module.exports = { config: { name: "naruto-storm", aliases: ["nstorm"], version: "1.0", author: "Merdi Madimba", role: 0, category: "game", shortDescription: "Jeu de combat Naruto multijoueur", longDescription: "Simule un combat entre deux joueurs avec les personnages de Naruto", guide: { en: "{p}naruto-storm" } },

onStart: async function ({ message, event }) { const threadID = event.threadID;

if (gameState[threadID]) {
  return message.reply("⛔ Une partie est déjà en cours dans ce groupe. Terminez-la avant d'en commencer une nouvelle.");
}

gameState[threadID] = {
  step: "waiting_start",
  players: {},
  turn: null,
  p1Character: null,
  p2Character: null,
  p1HP: 100,
  p2HP: 100
};

return message.reply({
  body: `⚡ Bienvenue dans NARUTO-STORM ! \nEnvoyez !start pour commencer le duel.`,
  attachment: await global.utils.getStreamFromURL("https://ibb.co/PZ3z4W8j.png")
});

},

onChat: async function ({ event, message }) { const threadID = event.threadID; const userID = event.senderID; const body = event.body.toLowerCase();

if (!gameState[threadID]) return;
const state = gameState[threadID];

if (state.step === "waiting_start" && body === "!start") {
  state.step = "choose_p1";
  state.players.p1 = userID;
  return message.reply("🧙 Joueur 1, tapez !P1 pour choisir votre personnage.");
}

if (state.step === "choose_p1" && body === "!p1" && userID === state.players.p1) {
  state.step = "choose_p2";
  return message.reply("🧝 Joueur 2, tapez !P2 pour choisir votre personnage.");
}

if (state.step === "choose_p2" && body === "!p2") {
  state.players.p2 = userID;
  state.step = "choose_characters";
  return message.reply("🎯 Choisissez vos personnages. Tapez le numéro (ex: 1 pour Naruto, 2 pour Sasuke...)\n" +
    characters.map((char, i) => `${i + 1}. ${char.name}`).join("\n"));
}

if (state.step === "choose_characters" && !state.p1Character) {
  const index = parseInt(body) - 1;
  if (!characters[index]) return message.reply("Numéro invalide. Essayez encore.");
  state.p1Character = characters[index];
  return message.reply(`✅ Joueur 1 a choisi ${state.p1Character.name}. Joueur 2, tapez un numéro pour choisir votre personnage.`);
}

if (state.step === "choose_characters" && state.p1Character && !state.p2Character && userID === state.players.p2) {
  const index = parseInt(body) - 1;
  if (!characters[index]) return message.reply("Numéro invalide. Essayez encore.");
  state.p2Character = characters[index];
  state.turn = "p1";
  state.step = "battle";
  return message.reply(`⚔️ Le combat commence entre ${state.p1Character.name} et ${state.p2Character.name} !\nEnvoyez !a (coup), !b (chakra) ou !x (technique ultime)`);
}

// Gestion des attaques
if (state.step === "battle") {
  if ((state.turn === "p1" && userID !== state.players.p1) || (state.turn === "p2" && userID !== state.players.p2)) {
    return;
  }

  const attacker = state.turn === "p1" ? state.p1Character : state.p2Character;
  const defender = state.turn === "p1" ? state.p2Character : state.p1Character;
  const hpKey = state.turn === "p1" ? "p2HP" : "p1HP";

  let damage = 0;
  let tech = "👐 coup";

  if (body === "!a") {
    damage = Math.floor(Math.random() * 6 + 5);
  } else if (body === "!b") {
    damage = Math.floor(Math.random() * 6 + 15);
    tech = `💥 ${attacker.basic}`;
  } else if (body === "!x") {
    const chance = Math.random();
    if (chance > 0.5) {
      damage = Math.floor(Math.random() * 16 + 30);
      tech = `🔥 ${attacker.ultimate}`;
    } else {
      return message.reply("⛔ Technique ultime échouée !");
    }
  } else {
    return message.reply("❓Commande invalide. Tapez !a, !b ou !x");
  }

  state[hpKey] -= damage;
  const attackerName = attacker.name;
  const targetName = defender.name;
  const hp1 = state.p1HP;
  const hp2 = state.p2HP;

  const result = `🎮 ${attackerName} utilise ${tech} et inflige ${damage}% de dégâts à ${targetName} !\n\n💖 Vie de ${state.p1Character.name}: ${hp1}%\n💔 Vie de ${state.p2Character.name}: ${hp2}%`;
  state.turn = state.turn === "p1" ? "p2" : "p1";

  if (hp1 <= 0 || hp2 <= 0) {
    delete gameState[threadID];
    const winner = hp1 <= 0 ? state.p2Character.name : state.p1Character.name;
    return message.reply(`🏁 Fin du combat ! Victoire de ${winner} ! 🏆`);
  }

  return message.reply(result);
}

} };

                       
