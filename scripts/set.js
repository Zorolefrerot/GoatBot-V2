// ----------------- scripts/cmds/set.js  (v1.1) -----------------
//  Transfert d’or, ressources, population ou armée entre villes
//  • Sécurise target.notif et .res pour éviter les erreurs

const fs   = require('fs');
const path = require('path');
const dbFile = path.join(__dirname, 'city-data.js');

let db = { cities:{} };
if (fs.existsSync(dbFile)) db = require(dbFile);
const save = () =>
  fs.writeFileSync(dbFile, 'module.exports = ' + JSON.stringify(db, null, 2));

const RES = ['wood','stone','iron','copper','coal','goldOre'];
const chooseCityByName = n =>
  Object.values(db.cities).find(c=>c.name.toLowerCase()===n.toLowerCase());

module.exports = {
  config:{
    name:'set',
    version:'1.1',
    author:'𝗠𝗲𝗿𝗱𝗶 𝗠𝗮𝗱𝗶𝗺𝗯𝗮',
    category:'game',
    shortDescription:'Transfert entre villes'
  },

  onStart({args,event,message}){
    const uid=event.senderID;
    const sender=db.cities[uid];
    if(!sender) return message.reply('Crée d\'abord ta ville : @city create <nom>');

    if(args.length<3)
      return message.reply(
        'Usage : /set <NomVille> <type> <quantité>\n'+
        'Type : gold | pop | army | '+RES.join(' | ')
      );

    const qty=parseInt(args[args.length-1],10);
    if(isNaN(qty)||qty<=0) return message.reply('Quantité ?');

    const type=args[args.length-2].toLowerCase();
    const cityName=args.slice(0,args.length-2).join(' ');
    const target=chooseCityByName(cityName);

    if(!target)          return message.reply('Ville cible introuvable');
    if(target===sender)  return message.reply('Transfert vers toi-même interdit');

    /* --- sécurisation pour vieilles villes --- */
    if(!Array.isArray(target.notif)) target.notif=[];
    if(!sender.res) sender.res=Object.fromEntries(RES.map(r=>[r,0]));
    if(!target.res) target.res=Object.fromEntries(RES.map(r=>[r,0]));

    /* ---------- GOLD ---------- */
    if(type==='gold'){
      if(sender.gold<qty) return message.reply('Pas assez d\'or');
      sender.gold-=qty; target.gold=(target.gold||0)+qty;
      target.notif.push(`💸 ${sender.name} t'a envoyé ${qty}$`);
      save();
      return message.reply(`Transfert : ${qty}$ → ${target.name}`);
    }

    /* ---------- POPULATION ---------- */
    if(type==='pop' || type==='population'){
      if(sender.pop<qty) return message.reply('Pas assez de population');
      sender.pop-=qty; target.pop=(target.pop||0)+qty;
      target.notif.push(`👥 ${sender.name} t'a envoyé ${qty} habitants`);
      save();
      return message.reply(`Transfert : ${qty} pop → ${target.name}`);
    }

    /* ---------- ARMÉE ---------- */
    if(type==='army'){
      if(sender.army<qty) return message.reply('Pas assez d\'armée');
      sender.army-=qty; target.army=(target.army||0)+qty;
      target.notif.push(`🪖 ${sender.name} t'a envoyé ${qty} unités armées`);
      save();
      return message.reply(`Transfert : ${qty} armée → ${target.name}`);
    }

    /* ---------- RESSOURCES ---------- */
    if(RES.includes(type)){
      if(sender.res[type]<qty) return message.reply(`Pas assez de ${type}`);
      sender.res[type]-=qty;
      target.res[type]=(target.res[type]||0)+qty;
      target.notif.push(`📦 ${sender.name} t'a envoyé ${qty} ${type}`);
      save();
      return message.reply(`Transfert : ${qty} ${type} → ${target.name}`);
    }

    return message.reply(
      'Type inconnu. Types : gold | pop | army | '+RES.join(' | ')
    );
  }
};
