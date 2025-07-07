// fc25.js – auteur : 𝗠𝗲𝗿𝗱𝗶 𝗠𝗮𝗱𝗶𝗺𝗯𝗮
const fs = require('fs');
const path = require('path');

const TEAMS = JSON.parse(fs.readFileSync(path.join(__dirname, 'fc25.json'), 'utf8'));

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = a => a[rand(0, a.length - 1)];
const delay = ms => new Promise(r => setTimeout(r, ms));
const bold = s => s.split('').map(c => {
  const x = c.charCodeAt(0);
  if (x >= 65 && x <= 90) return String.fromCodePoint(0x1D5D4 + (x - 65));
  if (x >= 97 && x <= 122) return String.fromCodePoint(0x1D5EE + (x - 97));
  return c;
}).join('');

const sessions = new Map();
const H_ACT = 6, MAX_SUB = 3;

function journalist() {
  return '🎙️ ' + pick([
    'Quelle ambiance !',
    'Match serré…',
    'Les tribunes s’enflamment !',
    'Action de ouf !',
    'Le coach harangue ses joueurs'
  ]);
}

function act(a, d, s) {
  const t = pick(['passe', 'tacle', 'tir', 'cf', 'pen']);
  const A = pick(a.on);
  const D = pick(d.on);
  switch (t) {
    case 'passe': return `🔄 ${a.flag} ${A} combine avec ${pick(a.on.filter(x => x !== A))}`;
    case 'tacle': return Math.random() < 0.5 ? `🥾 ${d.flag} ${D} tacle et récupère !` : `🥾 ${d.flag} ${D} tacle manqué.`;
    case 'cf': return Math.random() < 0.3 ? (s[a.ct]++, `🎯 ${a.flag} COUP FRANC ! ${A} en lucarne ⚽️`) : `🎯 ${a.flag} Coup franc au-dessus.`;
    case 'pen': return Math.random() < 0.75 ? (s[a.ct]++, `🅿️ ${a.flag} Penalty transformé par ${A}`) : `🅿️ ${a.flag} ${A} rate son penalty.`;
    default: return Math.random() < 0.35 ? (s[a.ct]++, `⚽️ BUT ! ${a.flag} ${A} crucifie ${D}`) : `🚀 ${a.flag} ${A} frappe hors-cadre.`;
  }
}

const score = t => {
  const [p1, p2] = Object.values(t.pl);
  return `${p1.flag} ${p1.ct} ${t.sc[p1.ct]} – ${t.sc[p2.ct]} ${p2.flag} ${p2.ct}`;
};

module.exports = {
  config: {
    name: 'fc25',
    version: '2.4',
    author: '𝗠𝗲𝗿𝗱𝗶 𝗠𝗮𝗱𝗶𝗺𝗯𝗮',
    category: 'game',
    shortDescription: 'Match de foot FC 25'
  },

  async onStart({ args, event, message }) {
    const id = event.threadID;
    const uid = event.senderID;
    const cmd = (args[0] || 'start').toLowerCase();

    if (cmd === 'start') {
      if (sessions.has(id)) return message.reply(bold('Match déjà en cours'));
      const opp = (args[1] || '').replace(/@/, '') || 'AI';
      sessions.set(id, {
        st: 'pick',
        sc: {},
        wait: new Set(),
        pl: {
          P1: { id: uid, tag: event.senderID, ct: null, flag: '', on: [], bench: [], sub: 0 },
          P2: { id: opp, tag: args[1] || 'IA', ct: null, flag: '', on: [], bench: [], sub: 0 }
        }
      });
      const txt = '🏟️ ' + bold('FC 25 – Bienvenue !') + '\nChoisissez vos pays :  !P1 <code>  /  !P2 <code>\nCodes : ' + Object.keys(TEAMS).join(', ');
      message.reply(txt);
      return;
    }

    if (cmd === 'p1' || cmd === 'p2') {
      const s = sessions.get(id);
      if (!s || s.st !== 'pick') return;
      const slot = cmd.toUpperCase();
      const p = s.pl[slot];
      if (p.id !== uid) return;
      const code = args[1];
      if (!TEAMS[code]) return message.reply(bold('Code inconnu'));
      Object.assign(p, {
        ct: TEAMS[code].name,
        flag: code,
        on: TEAMS[code].players.slice(0, 11),
        bench: TEAMS[code].players.slice(11)
      });
      s.sc[p.ct] = 0;
      message.reply(`✅ ${slot} → ${code} ${p.ct}`);
      if (s.pl.P1.ct && s.pl.P2.ct) {
        s.st = 'lineup';
        message.reply('📝 ' + bold('Titulaires P1') + '\n' + s.pl.P1.on.join(', ') + '\n📝 ' + bold('Titulaires P2') + '\n' + s.pl.P2.on.join(', ') + '\n→  @fc25 sub OUT IN   |   @fc25 ready');
      }
      return;
    }

    if (cmd === 'sub') {
      const s = sessions.get(id);
      if (!s || !['lineup', 'H1', 'H2'].includes(s.st)) return;
      const [out, inP] = [args[1], args[2]];
      const p = Object.values(s.pl).find(x => x.id === uid);
      if (!p) return;
      if (p.sub >= MAX_SUB) return message.reply(bold('Limite subs'));
      if (!p.on.includes(out) || !p.bench.includes(inP)) return message.reply(bold('Nom invalide'));
      p.on = p.on.map(n => n === out ? inP : n);
      p.bench = p.bench.map(n => n === inP ? out : n);
      p.sub++;
      message.reply(`🔄 ${p.flag} ${out} ⇢ ${inP}  (${p.sub}/${MAX_SUB})`);
      return;
    }

    if (cmd === 'ready') {
      const s = sessions.get(id);
      if (!s || !['lineup', 'pause'].includes(s.st)) return;
      s.wait.add(uid);
      if (s.wait.size >= (s.pl.P2.id === 'AI' ? 1 : 2)) {
        s.wait.clear();
        if (s.st === 'lineup') { s.st = 'H1'; match(id, message, 1); }
        else { s.st = 'H2'; match(id, message, 2); }
      } else message.reply('✔️ ' + bold('Prêt.'));
    }
  }
};

async function match(id, msg, half) {
  const s = sessions.get(id);
  let n = 0;
  msg.reply('▶️ ' + bold(half === 1 ? 'Coup d’envoi' : 'Reprise'));
  while (n < H_ACT) {
    const atk = n % 2 === 0 ? s.pl.P1 : s.pl.P2;
    const def = n % 2 === 0 ? s.pl.P2 : s.pl.P1;
    await msg.reply(act(atk, def, s.sc));
    if (Math.random() < 0.3) await msg.reply(journalist());
    n++;
    await delay(3200);
  }
  if (half === 1) {
    s.st = 'pause';
    msg.reply('⏸️ ' + bold('MI-TEMPS') + '\n' + score(s) + '\n@fc25 ready');
  } else {
    msg.reply('🏁 ' + bold('FIN') + '\n' + score(s));
    sessions.delete(id);
  }
}
