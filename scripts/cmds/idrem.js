// idrem.js — Répondeur contextuel avec mémoire temporaire
// Auteur : Merdi Madimba
// -------------------------------------------------------------
// Admin :   /idrem on    |   /idrem off
// Fonctionnement :
//   • charge idrem.json   { triggers:{cat:[phrases]}, random:[..], activeGroups:[] }
//   • Mémoire (RAM) par groupe : { lastCat, lastIndex }
//   • Algo :
//       1. heure / date → répond.
//       2. cherche catégorie dont un mot‑clé apparaît (clé = nom catégorie).
//       3. sinon poursuit la dernière catégorie enregistrée (pour rester dans le sujet).
//       4. sinon phrase aléatoire.
//       5. évite de répéter deux fois la même phrase de suite.
// -------------------------------------------------------------

const fs   = require("fs");
const path = require("path");
const DB   = require(path.join(__dirname, "idrem.json"));
const save = () => fs.writeFileSync(path.join(__dirname, "idrem.json"), JSON.stringify(DB, null, 2));

const mem = new Map();   // mémorisation par threadID : { lastCat:string , lastIndex:number }

const pick = a => a[Math.floor(Math.random()*a.length)];
const timeFR = () => new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});
const dateFR = () => new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"});

module.exports = {
  config:{name:"idrem",version:"5.0",author:"Merdi Madimba",category:"fun",shortDescription:"Chatbot contextuel"},

  onStart({args,event,message,threadsData}){
    const sub=(args[0]||"").toLowerCase();
    const tid=event.threadID;
    const admins=threadsData.get(tid,"adminIDs")?.map(a=>a.id)||[];
    if(!admins.includes(event.senderID)) return message.reply("⛔ Admin uniquement.");

    if(sub==="on"){
      if(!DB.activeGroups.includes(tid)){DB.activeGroups.push(tid);save();return message.reply("✅ IDREM activé.");}
      return message.reply("ℹ️ Déjà actif.");
    }
    if(sub==="off"){
      const i=DB.activeGroups.indexOf(tid);
      if(i!==-1){DB.activeGroups.splice(i,1);save();mem.delete(tid);return message.reply("🚫 IDREM désactivé.");}
      return message.reply("ℹ️ Déjà inactif.");
    }
    message.reply("Usage : /idrem on | off");
  },

  onChat({event,message}){
    const tid=event.threadID;
    if(!DB.activeGroups.includes(tid)) return;

    const txt=(event.body||"").toLowerCase();
    if(!txt) return;

    // heure / date
    if(/\b(heure|time|clock)\b/.test(txt)) return send(tid,`🕒 Il est ${timeFR()}`);
    if(/\b(date|jour|today)\b/.test(txt))  return send(tid,`📅 Nous sommes le ${dateFR()}`);

    // rechercher catégorie correspondante (nom catégorie présent dans le message)
    const keys=Object.keys(DB.triggers);
    let catFound=null;
    for(const k of keys){ if(txt.includes(k)) { catFound=k; break; } }

    // si aucune, reprendre le sujet précédent
    if(!catFound) catFound=mem.get(tid)?.lastCat;

    // choisir phrase
    let phrase;
    if(catFound && DB.triggers[catFound]?.length){
      const arr=DB.triggers[catFound];
      let idx=Math.floor(Math.random()*arr.length);
      const lastIdx=mem.get(tid)?.lastIndex;
      if(catFound===mem.get(tid)?.lastCat && idx===lastIdx) idx=(idx+1)%arr.length; // éviter doublon
      phrase=arr[idx];
      mem.set(tid,{lastCat:catFound,lastIndex:idx});
    } else {
      phrase=pick(DB.random);
      mem.set(tid,{lastCat:null,lastIndex:-1});
    }
    send(tid,phrase);

    function send(id,body){ message.reply(body); }
  }
};
                                                      
