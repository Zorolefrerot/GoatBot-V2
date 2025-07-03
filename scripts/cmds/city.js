const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, 'city-data.js');

/* ----------- Chargement / Sauvegarde ----------- */
let db = { cities: {}, market: { prices: {}, lastUpdate: 0 } };
if (fs.existsSync(dbPath)) db = require(dbPath);
const save = () =>
  fs.writeFileSync(dbPath, 'module.exports = ' + JSON.stringify(db, null, 2));

/* ----------- Bâtiments & coûts ----------- */
const BUILD_COST = {
  maison: 500,
  banque: 1500,
  usine: 1200,
  école: 1000,
  marché: 800,
  armée: 2000,
  musée: 2500,       // NOUVEAU
  hôpital: 3000,     // NOUVEAU
  centrale: 4000     // NOUVEAU (centrale électrique)
};
const BUILD_INCOME = {
  musée:   150,
  hôpital: 200,
  centrale: 300
};

/* ----------- Marché dynamique ----------- */
const RANGE = { bois: [5, 10], pierre: [8, 15], acier: [20, 35] };

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function refreshMarket() {
  const oneDay = 86_400_000;
  if (Date.now() - db.market.lastUpdate < oneDay) return;        // déjà du jour
  db.market.prices = {
    bois:   rand(...RANGE.bois),
    pierre: rand(...RANGE.pierre),
    acier:  rand(...RANGE.acier)
  };
  db.market.lastUpdate = Date.now();
  save();
}

/* ----------- Helper statut ----------- */
function statusMsg(c) {
  const b = c.buildings;
  return `
🏙️  ${c.name} (Lvl ${c.level})
👑  Maire : ${c.mayor}
💰  Argent : ${c.money}$
👥  Population : ${c.pop}
🪖  Armée : ${c.army}
🏗️  Bâtiments :
   • Maison   : ${b.maison}
   • Banque   : ${b.banque}
   • Usine    : ${b.usine}
   • École    : ${b.école}
   • Marché   : ${b.marché}
   • Caserne  : ${b.armée}
   • Musée    : ${b.musée}
   • Hôpital  : ${b.hôpital}
   • Centrale : ${b.centrale}
`.trim();
}

/* ----------- Commande principale ----------- */
module.exports = {
  config: {
    name: 'city',
    version: '3.1',
    author: 'Merdi Madimba & ChatGPT',
    category: 'game',
    shortDescription: 'City-builder multijoueur avec marché dynamique'
  },

  onStart({ args, event, message }) {
    const uid  = event.senderID;
    const sub  = (args[0] || '').toLowerCase();
    const city = db.cities[uid];

    /* ----- create ----- */
    if (sub === 'create') {
      if (city) return message.reply('❌ Tu as déjà une ville.');
      const name = args.slice(1).join(' ');
      if (!name) return message.reply('❗ Donne un nom.');
      db.cities[uid] = {
        name, mayor: event.senderName,
        money: 5000, pop: 50, level: 1, army: 0,
        res: { bois: 100, pierre: 100, acier: 20 },
        buildings: { maison: 2, banque: 1, usine: 1, école: 1, marché: 0, armée: 0,
                     musée:0, hôpital:0, centrale:0 }
      };
      save();
      return message.reply(`🏙️ Ville « ${name} » créée !`);
    }

    /* aucune ville ? */
    if (!city) return message.reply('❌ Crée d’abord ta ville (@city create).');

    /* ----- status ----- */
    if (sub === 'status') return message.reply(statusMsg(city));

    /* ----- build ----- */
    if (sub === 'build') {
      const type = args[1];
      if (!BUILD_COST[type])
        return message.reply('🏗️ Types : ' + Object.keys(BUILD_COST).join(', '));
      if (city.money < BUILD_COST[type])
        return message.reply('💸 Pas assez d\'argent.');
      city.money -= BUILD_COST[type];
      city.buildings[type] = (city.buildings[type] || 0) + 1;
      if (type === 'maison') city.pop += 20;
      if (type === 'armée')  city.army += 1;
      save();
      return message.reply(`✅ ${type} construit.`);
    }

    /* ----- market ----- */
    if (sub === 'market') {
      refreshMarket();
      const p = db.market.prices;
      return message.reply(
        `🏪 Marché du jour\n🌳 Bois : ${p.bois}$\n🪨 Pierre : ${p.pierre}$\n⚙️ Acier : ${p.acier}$`
      );
    }

    /* ----- buy / sell ----- */
    if (sub === 'buy' || sub === 'sell') {
      refreshMarket();
      const res = args[1];
      const qty = parseInt(args[2]);
      if (!['bois', 'pierre', 'acier'].includes(res) || isNaN(qty) || qty <= 0)
        return message.reply('❗ 𝗙𝗼𝗿𝗺𝗮𝘁 : @city buy <bois|pierre|acier> <quantité>');
      const price = db.market.prices[res] * qty;

      if (sub === 'buy') {
        if (city.money < price) return message.reply('💰 𝗣𝗮𝘀 𝗮𝘀𝘀𝗲𝗮 𝗱\'𝗮𝗿𝗴𝗲𝗻𝘁.');
        city.money -= price;
        city.res[res] = (city.res[res] || 0) + qty;
        save();
        return message.reply(`✅ 𝗔𝗰𝗵𝗮𝘁 : +${qty} ${res} pour ${price}$.`);
      } else {
        if ((city.res[res] || 0) < qty) return message.reply('❌ 𝗣𝗮𝘀 𝗮𝘀𝘀𝗲𝘇 𝗿𝗲𝘀𝘀𝗼𝘂𝗿𝗰𝗲𝘀.');
        city.res[res] -= qty;
        city.money += price;
        save();
        return message.reply(`✅ 𝗩𝗲𝗻𝘁𝗲 : -${qty} ${res}, +${price}$.`);
      }
    }

    /* ----- collect (revenus passifs) ----- */
    if (sub === 'collect') {
      const now = Date.now();
      if (!city.lastCollect) city.lastCollect = 0;
      if (now - city.lastCollect < 60_000)
        return message.reply('🕒 𝗣𝗮𝘁𝗶𝗲𝗻𝘁𝗲 1 𝗺𝗶𝗻𝘂𝘁𝗲 𝗲𝗻𝘁𝗿𝗲 𝗱𝗲𝘂𝘅 𝗰𝗼𝗹𝗹𝗲𝗰𝘁𝗲.');
      city.lastCollect = now;

      // revenus des bâtiments spéciaux
      let income = city.pop * 2;
      for (const b of ['musée', 'hôpital', 'centrale']) {
        income += (BUILD_INCOME[b] || 0) * city.buildings[b];
      }
      city.money += income;
      save();
      return message.reply(`💰 𝗖𝗼𝗹𝗹𝗲𝗰𝘁𝗲 : +${income}$.`);
    }

    /* ----- leaderboard ----- */
    if (sub === 'leaderboard') {
      const top = Object.values(db.cities)
        .sort((a, b) => b.money - a.money)
        .slice(0, 5)
        .map((c, i) => `${i + 1}. ${c.name} – ${c.money}$`)
        .join('\n');
      return message.reply('🏆 𝗧𝗢𝗣 5 𝗕𝗘𝗦𝗧 𝗖𝗜𝗧𝗬 :\n' + top);
    }

    /* ----- help ----- */
    return message.reply(`
📜 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗘𝗦 :
@city status
@city build <${Object.keys(BUILD_COST).join('|')}>
@city collect
@city market
@city buy <ress> <qte>
@city sell <ress> <qte>
@city leaderboard
`.trim());
  }
};
