const fs = require("fs");
const path = require("path");
const dataPath = path.join(__dirname, "city-data.js");
if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, "module.exports = { cities: {}, market: { prices: {}, lastUpdate: 0 } };");
let db = require("./city-data.js");         // { cities: {uid: {...}}, market: {prices,lastUpdate}}

const BUILD = {
  house:      { cost:{wood:50, stone:20, gold:100},   pop:4,  inc:{gold:0}},
  farm:       { cost:{wood:60, stone:30, gold:150},   pop:2,  inc:{gold:10, wood:30}},
  mine:       { cost:{wood:80, stone:40, gold:200},   pop:3,  inc:{gold:15, stone:25}},
  factory:    { cost:{wood:120,stone:60, gold:400},   pop:5,  inc:{gold:60, steel:10}},
  bank:       { cost:{wood:150,stone:80, gold:800},   pop:2,  inc:{gold:120}},
  school:     { cost:{wood:90, stone:40, gold:300},   pop:0,  inc:{gold:30}},
  transport:  { cost:{wood:70, stone:30, gold:250},   pop:0,  inc:{gold:20}},
  barracks:   { cost:{wood:100,stone:50, gold:500},   pop:0,  inc:{soldiers:20}}
};

const PRICE_RANGE = { wood:[5,12], stone:[8,15], steel:[20,35] };

function save(){ fs.writeFileSync(dataPath, "module.exports = " + JSON.stringify(db, null, 2)); }

function initCity(uid, name, ownerName){
  db.cities[uid] = {
    name, ownerName,
    level:1,pop:20,
    wood:120,stone:120,steel:0,gold:500,
    b:{}, soldiers:0,
    lastCollect:0,
    lastAttack:0,
    notif:[]
  };
  save();
  return `🏙️ Ville ${name} fondée !`;
}

function stats(c){ const bLines=Object.entries(c.b).map(([k,v])=>`${k}×${v}`).join(", ")||"Aucun";
  return `🏙️ ${c.name} (Lvl ${c.level})\\n👤 Propriétaire : ${c.ownerName}\\n👥 Pop : ${c.pop} | 🗡️ Soldats : ${c.soldiers}\\n💰 Gold : ${c.gold}\\n🌳 ${c.wood} bois | 🪨 ${c.stone} pierre | ⚙️ ${c.steel} acier\\n🏗️ Bâtiments : ${bLines}`;
}

function can(uid, cost){
  const c=db.cities[uid]; return c.wood>=cost.wood&&c.stone>=cost.stone&&c.gold>=cost.gold;
}

function rand(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

function updateMarket(){
  const now=Date.now(); if(now-db.market.lastUpdate<86_400_000) return;
  db.market.prices = {
    wood: rand(...PRICE_RANGE.wood),
    stone: rand(...PRICE_RANGE.stone),
    steel: rand(...PRICE_RANGE.steel)
  };
  db.market.lastUpdate=now; save();
}

function collect(uid){
  const c=db.cities[uid]; const now=Date.now();
  if(now-c.lastCollect<60_000) return "🕒 Patiente 1 minute entre deux collectes.";
  c.lastCollect=now;

  let g= c.pop*2, w=0,s=0,st=0,sold=0;
  for(const [k,n] of Object.entries(c.b)){
    const inc=BUILD[k].inc;
    g += (inc.gold||0)*n;
    w += (inc.wood||0)*n;
    s += (inc.stone||0)*n;
    st+= (inc.steel||0)*n;
    sold += (inc.soldiers||0)*n;
  }
  c.gold+=g; c.wood+=w; c.stone+=s; c.steel+=st; c.soldiers+=sold;

  // events (5 % × niveau)
  if(Math.random()<0.05*c.level){
    const loss=Math.floor(c.gold*0.1)+50;
    c.gold=Math.max(0,c.gold-loss);
    c.notif.push(`⚠️ Vol ! ${loss}$ perdus.`);
  }
  save();
  return `💰 +${g}$ | 🌳 +${w} | 🪨 +${s} | ⚙️ +${st} | 🗡️ +${sold} soldats`;
}

function build(uid,type){
  const c=db.cities[uid]; const def=BUILD[type];
  if(!def) return "❌ Bâtiment inconnu.";
  if(!can(uid, def.cost)) return "❌ Ressources insuffisantes.";
  c.wood-=def.cost.wood; c.stone-=def.cost.stone; c.gold-=def.cost.gold;
  c.b[type]=(c.b[type]||0)+1;
  c.pop+=def.pop; if(def.inc.soldiers) c.soldiers+=def.inc.soldiers;
  save(); return `🏗️ ${type} construit !`;
}

function upgrade(uid){
  const c=db.cities[uid]; const cost=c.level*1000;
  if(c.gold<cost) return `❌ Besoin de ${cost}$ pour lvl ${c.level+1}.`;
  c.gold-=cost; c.level++; c.pop+=10; save();
  return `⏫ Ville niv.${c.level}`;
}

function leaderboard(){
  const arr=Object.values(db.cities).sort((a,b)=>b.gold-a.gold).slice(0,10);
  return "🏆 Top 10 richesses\\n"+arr.map((c,i)=>`${i+1}. ${c.name} – ${c.gold}$`).join("\\n");
}

function army(uid){ const c=db.cities[uid]; return `🗡️ Armée : ${c.soldiers} soldats.`;}

function attack(attUid,targetName){
  const att=db.cities[attUid]; if(!att) return "❌ Ville introuvable.";
  const now=Date.now(); if(now-att.lastAttack<3_600_000) return "🕒 Une attaque / heure.";
  const entries=Object.entries(db.cities).filter(([,v])=>v.name.toLowerCase()===targetName.toLowerCase());
  if(!entries.length) return "❌ Cible inexistante.";
  const [defUid,def]=entries[0];
  if(defUid===attUid) return "❌ Pas d'attaque sur toi-même.";
  if(att.soldiers<1) return "❌ Pas d'armée.";
  att.lastAttack=now;

  // combat
  const attForce=att.soldiers*(1+Math.random()*0.2);
  const defForce=def.soldiers*(1+Math.random()*0.2);
  let msg=\"\";

  if(attForce>=defForce){ // victoire
    const steal=Math.floor(def.gold*0.15);
    def.gold-=steal; att.gold+=steal;
    msg=`🏴‍☠️ Victoire ! Tu voles ${steal}$.`;
    def.notif.push(`⚔️ ${att.name} a attaqué ta ville et a volé ${steal}$.`);
  }else{ // défaite
    const loss=Math.floor(att.soldiers*0.1)+5;
    att.soldiers=Math.max(0,att.soldiers-loss);
    msg=`💀 Défaite. Tu perds ${loss} soldats.`;
    def.notif.push(`⚔️ ${att.name} a échoué à t'attaquer. Tu défends brillamment.`);
  }
  save(); return msg;
}

function notifications(uid){
  const c=db.cities[uid]; if(!c) return \"❌ Pas de ville.\";
  const notes=c.notif.splice(0,c.notif.length); save();
  if(!notes.length) return \"🔔 Aucune notification.\";
  return \"🔔 Notifications :\\n\"+notes.map((n,i)=>`${i+1}. ${n}`).join(\"\\n\");
}

function marketView(){
  updateMarket();
  const p=db.market.prices;
  return `🏪 Marché du jour\\n🌳 Bois : ${p.wood}$\\n🪨 Pierre : ${p.stone}$\\n⚙️ Acier : ${p.steel}$`;
}

function buy(uid,res,q){
  updateMarket(); q=parseInt(q);
  const p=db.market.prices[res]; if(!p) return \"❌ Ressource.\";
  const c=db.cities[uid]; const cost=p*q;
  if(c.gold<cost) return \"❌ Pas assez d'or.\";
  c.gold-=cost; c[res]+=q; save();
  return `✅ Achat : +${q} ${res} pour ${cost}$.`;
}
function sell(uid,res,q){
  updateMarket(); q=parseInt(q);
  const c=db.cities[uid]; if(c[res]<q) return \"❌ Pas assez de ressource.\";
  const gain=db.market.prices[res]*q;
  c[res]-=q; c.gold+=gain; save();
  return `✅ Vente : -${q} ${res}, +${gain}$.`;
}

module.exports = {
  config:{ name:\"city\",version:\"3.0\",author:\"Merdi Madimba & ChatGPT\",category:\"jeu\",shortDescription:\"City-builder multijoueur avec guerre et marché\" },

  onStart({event,args,message}) {
    const uid=event.senderID, nameUser=event.senderName;
    const sub=(args[0]||\"\").toLowerCase();

    if(sub===\"create\") {
      const n=args.slice(1).join(\" \"); if(!n) return message.reply(\"❌ Nom ?\");
      if(db.cities[uid]) return message.reply(\"❌ Tu as déjà une ville.\");
      return message.reply(initCity(uid,n,nameUser));
    }
    if(!db.cities[uid]) return message.reply(\"❌ Crée d'abord ta ville ( @city create <nom> ).\");

    if(sub===\"status\")   return message.reply(stats(db.cities[uid]));
    if(sub===\"collect\")  return message.reply(collect(uid));
    if(sub===\"build\")    return message.reply(build(uid,args[1]));
    if(sub===\"upgrade\")  return message.reply(upgrade(uid));
    if(sub===\"top\")      return message.reply(leaderboard());
    if(sub===\"army\")     return message.reply(army(uid));
    if(sub===\"attack\")   return message.reply(attack(uid,args.slice(1).join(\" \")));
    if(sub===\"notif\")    return message.reply(notifications(uid));

    if(sub===\"market\")   return message.reply(marketView());
    if(sub===\"buy\")      return message.reply(buy(uid,args[1],args[2]));
    if(sub===\"sell\")     return message.reply(sell(uid,args[1],args[2]));

    // help
    return message.reply(`📜 Commandes :
@city create <nom>
@city status
@city collect
@city build <${Object.keys(BUILD).join(\"|\")}>
@city upgrade
@city army
@city attack <NomVille>
@city notif
@city market
@city buy <ress> <qte>
@city sell <ress> <qte>
@city top`);
  }
};
