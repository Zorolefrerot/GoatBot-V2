const fs   = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'city-data.js');

// Charger (ou créer) la base de données
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(
    dataPath,
    'module.exports = { cities: {}, market: { prices: {}, lastUpdate: 0 } };',
    'utf-8'
  );
}
let db = require('./city-data.js'); // { cities: {...}, market: {...} }

// ---------- outils persistance ----------
const save = () =>
  fs.writeFileSync(
    dataPath,
    'module.exports = ' + JSON.stringify(db, null, 2),
    'utf-8'
  );

// ---------- définitions bâtiments ----------
const BUILD = {
  house:     { cost: { wood: 50,  stone: 20,  gold:  100 }, pop: 4, inc: { gold: 0   } },
  farm:      { cost: { wood: 60,  stone: 30,  gold:  150 }, pop: 2, inc: { gold: 10, wood: 30 } },
  mine:      { cost: { wood: 80,  stone: 40,  gold:  200 }, pop: 3, inc: { gold: 15, stone: 25 } },
  factory:   { cost: { wood:120,  stone: 60,  gold:  400 }, pop: 5, inc: { gold: 60, steel: 10 } },
  bank:      { cost: { wood:150,  stone: 80,  gold:  800 }, pop: 2, inc: { gold:120 } },
  school:    { cost: { wood: 90,  stone: 40,  gold:  300 }, pop: 0, inc: { gold: 30 } },
  transport: { cost: { wood: 70,  stone: 30,  gold:  250 }, pop: 0, inc: { gold: 20 } },
  barracks:  { cost: { wood:100,  stone: 50,  gold:  500 }, pop: 0, inc: { soldiers: 20 } }
};

// ---------- marché dynamique ----------
const PRICE_RANGE = { wood: [5, 12], stone: [8, 15], steel: [20, 35] };
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
function updateMarket() {
  const now = Date.now();
  if (now - db.market.lastUpdate < 86_400_000) return; // 1 jour
  db.market.prices = {
    wood:  rand(...PRICE_RANGE.wood),
    stone: rand(...PRICE_RANGE.stone),
    steel: rand(...PRICE_RANGE.steel)
  };
  db.market.lastUpdate = now;
  save();
}

// ---------- création ----------
function initCity(uid, name, owner) {
  db.cities[uid] = {
    name,
    ownerName: owner,
    level: 1,
    pop: 20,
    wood: 120,
    stone: 120,
    steel: 0,
    gold: 500,
    b: {},          // bâtiments
    soldiers: 0,
    score: 0,
    lastCollect: 0,
    lastAttack: 0,
    notif: []
  };
  save();
  return `🏙️ Ville « ${name} » fondée avec succès !`;
}

// ---------- helpers ----------
const canPay = (city, cost) =>
  city.wood  >= cost.wood &&
  city.stone >= cost.stone &&
  city.gold  >= cost.gold;

// ---------- gestion ressource / collecte ----------
function collect(uid) {
  const city = db.cities[uid];
  if (!city) return '❌ Crée d’abord ta ville.';

  const now = Date.now();
  if (now - city.lastCollect < 60_000) return '🕒 Patiente 1 minute entre deux collectes.';
  city.lastCollect = now;

  let g = city.pop * 2,
    w = 0,
    s = 0,
    st = 0,
    newSoldiers = 0;

  for (const [type, nb] of Object.entries(city.b)) {
    const inc = BUILD[type].inc;
    g  += (inc.gold     || 0) * nb;
    w  += (inc.wood     || 0) * nb;
    s  += (inc.stone    || 0) * nb;
    st += (inc.steel    || 0) * nb;
    newSoldiers += (inc.soldiers || 0) * nb;
  }

  city.gold     += g;
  city.wood     += w;
  city.stone    += s;
  city.steel    += st;
  city.soldiers += newSoldiers;

  // événement négatif (5 % × level)
  if (Math.random() < 0.05 * city.level) {
    const loss = Math.floor(city.gold * 0.1) + 50;
    city.gold = Math.max(0, city.gold - loss);
    city.notif.push(`⚠️ Vol détecté : -${loss} $`);
  }

  save();
  return `💰 +${g}$ | 🌳 +${w} | 🪨 +${s} | ⚙️ +${st} | 🗡️ +${newSoldiers} soldats`;
}

// ---------- construction ----------
function build(uid, type) {
  const city = db.cities[uid];
  if (!city) return '❌ Crée d’abord ta ville.';
  const def = BUILD[type];
  if (!def) return '🏗️ Bâtiments : ' + Object.keys(BUILD).join(', ');
  if (!canPay(city, def.cost)) return '💸 Ressources insuffisantes.';
  city.wood  -= def.cost.wood;
  city.stone -= def.cost.stone;
  city.gold  -= def.cost.gold;
  city.b[type] = (city.b[type] || 0) + 1;
  city.pop += def.pop;
  if (def.inc.soldiers) city.soldiers += def.inc.soldiers;
  save();
  return `✅ ${type} construit !`;
}

// ---------- upgrade ----------
function upgrade(uid) {
  const city = db.cities[uid];
  if (!city) return '❌ Crée une ville.';
  const cost = city.level * 1000;
  if (city.gold < cost) return `❌ Il faut ${cost}$ pour passer au niveau ${city.level + 1}.`;
  city.gold -= cost;
  city.level += 1;
  city.pop += 10;
  save();
  return `⏫ Niveau ${city.level} atteint !`;
}

// ---------- armée ----------
function army(uid) {
  const city = db.cities[uid];
  return city ? `🗡️ Armée : ${city.soldiers} soldats` : '❌ Pas de ville.';
}

// ---------- attaque ----------
function attack(attUid, targetName) {
  const attacker = db.cities[attUid];
  if (!attacker) return '❌ Crée ta ville.';
  const now = Date.now();
  if (now - attacker.lastAttack < 3_600_000) return '🕒 Une attaque par heure maximum.';
  const target = Object.entries(db.cities).find(
    ([, v]) => v.name.toLowerCase() === targetName.toLowerCase()
  );
  if (!target) return '❌ Ville cible introuvable.';
  const [defUid, defender] = target;
  if (defUid === attUid) return '❌ Pas d’auto-attaque.';

  if (attacker.soldiers < 1) return '💂‍♂️ Ton armée est trop faible.';
  attacker.lastAttack = now;

  const attForce = attacker.soldiers * (1 + Math.random() * 0.2);
  const defForce = defender.soldiers * (1 + Math.random() * 0.2);
  let msg;

  if (attForce >= defForce) {
    const steal = Math.floor(defender.gold * 0.15);
    defender.gold = Math.max(0, defender.gold - steal);
    attacker.gold += steal;
    attacker.score += 1;
    defender.score = Math.max(0, defender.score - 1);
    defender.notif.push(`⚔️ ${attacker.name} t'a volé ${steal}$ !`);
    msg = `🏴‍☠️ Victoire ! Tu voles ${steal}$.`;
  } else {
    const loss = Math.floor(attacker.soldiers * 0.1) + 5;
    attacker.soldiers = Math.max(0, attacker.soldiers - loss);
    attacker.score = Math.max(0, attacker.score - 1);
    defender.notif.push(`⚔️ ${attacker.name} a échoué à t'attaquer.`);
    msg = `💀 Défaite. Tu perds ${loss} soldats.`;
  }
  save();
  return msg;
}

// ---------- notifications ----------
function notifications(uid) {
  const city = db.cities[uid];
  if (!city) return '❌ Pas de ville.';
  if (!city.notif.length) return '🔔 Aucune notification.';
  const list = city.notif.join('\n');
  city.notif = [];
  save();
  return `🔔 Notifications :\n${list}`;
}

// ---------- marché ----------
function marketView() {
  updateMarket();
  const p = db.market.prices;
  return `🏪 Marché du jour
🌳 Bois  : ${p.wood}$
🪨 Pierre: ${p.stone}$
⚙️ Acier : ${p.steel}$`;
}

function buy(uid, res, qte) {
  updateMarket();
  const price = db.market.prices[res];
  if (!price) return '❌ Ressource inconnue.';
  const q = parseInt(qte, 10);
  if (isNaN(q) || q <= 0) return '❌ Quantité invalide.';
  const city = db.cities[uid];
  const cost = price * q;
  if (city.gold < cost) return '💸 Pas assez d\'or.';
  city.gold -= cost;
  city[res] += q;
  save();
  return `✅ Achat : +${q} ${res} pour ${cost}$.`;
}

function sell(uid, res, qte) {
  updateMarket();
  const price = db.market.prices[res];
  if (!price) return '❌ Ressource inconnue.';
  const q = parseInt(qte, 10);
  if (isNaN(q) || q <= 0) return '❌ Quantité invalide.';
  const city = db.cities[uid];
  if (city[res] < q) return `❌ Pas assez de ${res}.`;
  const gain = price * q;
  city[res] -= q;
  city.gold += gain;
  save();
  return `✅ Vente : -${q} ${res}, +${gain}$.`;
}

// ---------- classement ----------
function leaderboard() {
  const top = Object.values(db.cities)
    .sort((a, b) => b.gold - a.gold)
    .slice(0, 10)
    .map((c, i) => `${i + 1}. ${c.name} – ${c.gold}$`);
  return '🏆 Top 10 richesses\n' + top.join('\n');
}

// ---------- export commande ----------
module.exports = {
  config: {
    name: 'city',
    version: '3.0',
    author: 'Merdi Madimba & ChatGPT',
    category: 'game',
    shortDescription: 'City-builder multijoueur (attaque + marché)'
  },

  onStart({ event, args, message }) {
    const uid  = event.senderID;
    const name = event.senderName;
    const sub  = (args[0] || '').toLowerCase();

    if (sub === 'create') {
      const cityName = args.slice(1).join(' ');
      if (!cityName) return message.reply('❌ Donne un nom à ta ville.');
      if (db.cities[uid]) return message.reply('❌ Tu as déjà une ville.');
      return message.reply(initCity(uid, cityName, name));
    }

    if (!db.cities[uid]) return message.reply('❌ Crée d\'abord ta ville avec @city create <nom>.');

    switch (sub) {
      case 'status':   return message.reply(stats(db.cities[uid]));
      case 'collect':  return message.reply(collect(uid));
      case 'build':    return message.reply(build(uid, args[1]));
      case 'upgrade':  return message.reply(upgrade(uid));
      case 'army':     return message.reply(army(uid));
      case 'attack':   return message.reply(attack(uid, args.slice(1).join(' ')));
      case 'notif':    return message.reply(notifications(uid));
      case 'market':   return message.reply(marketView());
      case 'buy':      return message.reply(buy(uid, args[1], args[2]));
      case 'sell':     return message.reply(sell(uid, args[1], args[2]));
      case 'top':      return message.reply(leaderboard());
      default:
        return message.reply(
          `📜 Commandes :
@city create <nom>
@city status
@city collect
@city build <${Object.keys(BUILD).join('|')}>
@city upgrade
@city army
@city attack <NomVille>
@city notif
@city market
@city buy <ress> <qte>
@city sell <ress> <qte>
@city top`
        );
    }
  }
};
