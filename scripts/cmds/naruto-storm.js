
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

const activeBattles = new Map();

module.exports = { config: { name: "naruto-storm", aliases: ["nstorm"], version: "1.0", author: "Merdi Madimba", countDown: 5, role: 0, shortDescription: "Combat Naruto multijoueur", longDescription: "Simule un combat Naruto avec choix de personnages et techniques", category: "🎮 Jeu", guide: "{p}naruto-storm" },

onStart: async function ({ message, event }) { const threadID = event.threadID; if (activeBattles.has(threadID)) return message.reply("⚔️ Un combat est déjà en cours dans ce groupe !");

activeBattles.set(threadID, {
  status: "waiting",
  players: {},
  turn: null,
  health: {},
});

return message.reply({
  body: `👊 Bienvenue dans Naruto-Storm !

Envoyez !start pour commencer le combat.`, attachment: await global.utils.getStreamFromURL("https://i.ibb.co/9TwN6J1/naruto-storm-start.jpg") }); },

onChat: async function ({ event, message }) { const threadID = event.threadID; const userID = event.senderID; const body = event.body?.toLowerCase();

const battle = activeBattles.get(threadID);
if (!battle) return;

if (body === "!start" && battle.status === "waiting") {
  battle.status = "chooseP1";
  return message.reply("👤 Joueur 1, écrivez !P1 pour choisir votre personnage.");
}

if (body === "!p1" && battle.status === "chooseP1") {
  battle.players.p1 = userID;
  battle.status = "chooseP2";
  return message.reply("👤 Joueur 2, écrivez !P2 pour choisir votre personnage.");
}

if (body === "!p2" && battle.status === "chooseP2") {
  if (userID === battle.players.p1)
    return message.reply("❌ Le joueur 2 doit être différent du joueur 1.");
  battle.players.p2 = userID;
  battle.status = "selectCharacterP1";
  return message.reply("👾 Joueur 1, choisissez votre personnage avec le numéro (1, 2, 3...) :\n" +
    characters.map((c, i) => `${i + 1}. ${c.name}`).join("\n"));
}

if (battle.status === "selectCharacterP1" && userID === battle.players.p1) {
  const index = parseInt(body) - 1;
  if (isNaN(index) || !characters[index]) return;
  battle.characterP1 = characters[index];
  battle.status = "selectCharacterP2";
  return message.reply(`✅ Joueur 1 a choisi ${characters[index].name}\n👾 Joueur 2, choisissez votre personnage avec le numéro:`);
}

if (battle.status === "selectCharacterP2" && userID === battle.players.p2) {
  const index = parseInt(body) - 1;
  if (isNaN(index) || !characters[index]) return;
  battle.characterP2 = characters[index];
  battle.status = "fight";
  battle.health[battle.players.p1] = 100;
  battle.health[battle.players.p2] = 100;
  battle.turn = battle.players.p1;

  return message.reply(`🥷 Le combat commence entre ${battle.characterP1.name} et ${battle.characterP2.name} !\nChaque joueur commence avec 100% de vie.\n${getTurnPrompt(battle.turn)}`);
}

if (battle.status === "fight") {
  const player = battle.turn;
  if (userID !== player) return;

  if (!body.startsWith("!a") && !body.startsWith("!b") && !body.startsWith("!x")) return;

  let damage = 0;
  const char = userID === battle.players.p1 ? battle.characterP1 : battle.characterP2;
  if (body === "!a") {
    damage = Math.floor(Math.random() * 6) + 5; // 5-10
  } else if (body === "!b") {
    damage = Math.random() < 0.75 ? Math.floor(Math.random() * 6) + 15 : 0; // 15-20
    if (damage === 0) return message.reply("❌ La technique B a échoué !");
  } else if (body === "!x") {
    damage = Math.random() < 0.5 ? Math.floor(Math.random() * 16) + 30 : 0; // 30-45
    if (damage === 0) return message.reply("❌ La technique ultime a échoué !");
  }

  const target = userID === battle.players.p1 ? battle.players.p2 : battle.players.p1;
  battle.health[target] -= damage;
  if (battle.health[target] < 0) battle.health[target] = 0;

  let msg = `💥 ${char.name} a attaqué avec ${body.toUpperCase()} et infligé ${damage}% de dégâts !\n`;
  msg += `❤️ Vie de ${battle.characterP1.name}: ${battle.health[battle.players.p1]}%\n`;
  msg += `❤️ Vie de ${battle.characterP2.name}: ${battle.health[battle.players.p2]}%`;

  if (battle.health[target] <= 0) {
    msg += `\n🎉 ${char.name} a gagné le combat !`;
    activeBattles.delete(threadID);
  } else {
    battle.turn = target;
    msg += `\n🔁 C'est maintenant le tour de ${getTurnName(battle.turn, battle)}.`;
  }

  return message.reply(msg);
}

} };

function getTurnPrompt(id) { return 🎮 ${id === "p1" ? "Joueur 1" : "Joueur 2"}, utilisez !a (coup de poing), !b (technique chakra), ou !x (technique ultime).; }

function getTurnName(id, battle) { return id === battle.players.p1 ? battle.characterP1.name : battle.characterP2.name; }

