 /******************************************************************/
/*  FC-25  ─  Football interactif (A B X Y)   Auteur : Merdi M.   */
/*  Place-le dans  scripts/cmds/fc25.js                          */
/*  Requiert  fc25.json  (clés = emojis, valeurs = 15 joueurs)   */
/******************************************************************/

const fs   = require('fs');
const path = require('path');
const TEAMS = require(path.join(__dirname, 'fc25.json'));

const INTRO_IMG = 'https://i.ibb.co/gZ6bWDjQ/image.jpg';   // <— change si besoin
const HALF_MS   = 5 * 60 * 1000;                          // 5 minutes
const MAX_GOALS = 3;

const SESS = new Map();                                   // sessions par thread

/* Utils --------------------------------------------------------- */
const pick  = arr => arr[Math.floor(Math.random() * arr.length)];
const delay = ms  => new Promise(r => setTimeout(r, ms));
const bold  = t   => t.replace(/[A-Za-z]/g, c =>
  String.fromCodePoint((c <= 'Z' ? 0x1D5D4 : 0x1D5EE) + (c.toUpperCase().charCodeAt(0) - 65)));

const COMMENTS = [
  'Le public est en feu !',
  'Quel suspense dans le stade !',
  'Ça chambre fort sur le banc !',
  'Le coach devient fou !',
  'Silence avant la frappe…',
  'Tactique très audacieuse !'
];
const comment = () => '🎙️ ' + pick(COMMENTS);

const newPlayer = id => ({ id, flag: '', squad: [], score: 0 });
const listCountries = () => Object.keys(TEAMS).join('  ');

const movesAttack = { A: 'passe', B: 'tir', X: 'centre', Y: 'longue passe' };
const movesDefense= { A: 'pressing', B: 'tacle', X: 'tirage maillot', Y: 'interception' };

/* Texte action -------------------------------------------------- */
function doAttack(mv, team) {
  const p = pick(team.squad);
  let txt = `⚡ ${team.flag} ${p} ${movesAttack[mv]}.`;
  let goal = false;
  let keep = true;
  if (mv === 'B') {
    if (Math.random() < 0.35) {
      txt += `  ${bold('BUT !')} ⚽`;
      team.score += 1;
      goal = true;
    } else {
      txt += '  C’est à côté.';
      keep = false;
    }
  }
  if (mv === 'Y') keep = Math.random() < 0.7; // longue passe plus risquée
  return { txt, keep, goal };
}

function doDefense(mv, team) {
  const p = pick(team.squad);
  let success = Math.random() < (mv === 'B' ? 0.6 : 0.5);
  let txt = `🛡️ ${team.flag} ${p} tente ${movesDefense[mv]}. `;
  txt += success ? 'Ballon récupéré !' : 'Sans effet.';
  return { txt, success };
}

function scoreLine(s) {
  const { p1, p2 } = s.players;
  return `${p1.flag} ${p1.score} – ${p2.score} ${p2.flag}`;
}

/* Module -------------------------------------------------------- */
module.exports = {
  config: {
    name: 'fc25',
    version: '5.1',
    author: 'Merdi Madimba',
    category: 'game',
    shortDescription: 'Football interactif avec @A @B @X @Y'
  },

  async onStart({ args, event, message }) {
    const tid = event.threadID;
    const uid = event.senderID;
    const body = args.join(' ').trim();
    const cmd  = body.split(' ')[0].toLowerCase();
    const ses  = SESS.get(tid);

    /* Accueil ---------------------------------------------------- */
    if (!cmd) {
      const intro = bold('FC-25  –  /fc25 start pour jouer');
      try {
        const img = await global.utils.getStreamFromURL(INTRO_IMG);
        return message.reply({ body: intro, attachment: img });
      } catch {
        return message.reply(intro);
      }
    }

    /* Pas deux matchs à la fois --------------------------------- */
    if (cmd === 'start' && ses)
      return message.reply('⏳ Un match est déjà en cours dans ce groupe.');

    /* Création session ------------------------------------------ */
    if (cmd === 'start') {
      SESS.set(tid, {
        step: 'mode',
        mode: null,
        players: { p1: newPlayer(uid), p2: null },
        turn: 'p1',
        poss: 'p1',
        half: 0,
        halfEnd: 0,
        ready: {}
      });
      return message.reply(
        '🎮 Choisis le mode :\n' +
        '→ `fc25 mode ai`   (contre le bot)\n' +
        '→ `fc25 mode pvp`  (deux joueurs)'
      );
    }
    if (!ses) return;   // plus bas : session obligatoire

    /* Choix mode ------------------------------------------------- */
    if (cmd === 'mode' && ses.step === 'mode') {
      const m = (args[1] || '').toLowerCase();
      if (!['ai', 'pvp'].includes(m)) return message.reply('mode ai  |  mode pvp');
      ses.mode = m;
      if (m === 'ai') {
        ses.players.p2 = newPlayer('AI');
        ses.step = 'pickP1';
        return message.reply('Choisis ton pays (emoji) :\n' + listCountries());
      }
      ses.step = 'waitP2';
      return message.reply('🙋 Joueur 2 tape `fc25 join` pour rejoindre.');
    }

    /* Join PvP --------------------------------------------------- */
    if (cmd === 'join' && ses.step === 'waitP2') {
      if (uid === ses.players.p1.id) return message.reply('Tu es déjà P1.');
      ses.players.p2 = newPlayer(uid);
      ses.step = 'pickP1';
      return message.reply('P1, choisis ton pays :\n' + listCountries());
    }

    /* Sélection d’équipe ---------------------------------------- */
    if ((cmd === 'p1' || cmd === 'p2') && ['pickP1', 'pickP2'].includes(ses.step)) {
      const slot = cmd;                   // 'p1' ou 'p2'
      const pl   = ses.players[slot];
      if (pl.id !== uid && pl.id !== 'AI') return;
      const emoji = args[1];
      if (!TEAMS[emoji]) return message.reply('Emoji invalide.\n' + listCountries());
      pl.flag  = emoji;
      pl.squad = [...TEAMS[emoji]];

      if (ses.step === 'pickP1') {
        // IA : choix aléatoire différent
        if (ses.mode === 'ai') {
          const bot = pick(Object.keys(TEAMS).filter(e => e !== emoji));
          Object.assign(ses.players.p2, { flag: bot, squad: [...TEAMS[bot]] });
          ses.step = 'kickAI';
          return message.reply(
            `🤖 Le bot a choisi ${bot}.\n` +
            'Tape `fc25 next` pour le coup d’envoi.'
          );
        }
        // PvP : passer à P2
        ses.step = 'pickP2';
        return message.reply('P2, ton emoji :\n' + listCountries());
      }

      // Dernier choix terminé
      ses.step = 'ready';
      return message.reply('Les deux joueurs tapent `fc25 ready` pour démarrer.');
    }

    /* Ready PvP -------------------------------------------------- */
    if (cmd === 'ready' && ses.step === 'ready') {
      ses.ready[uid] = true;
      if (ses.ready[ses.players.p1.id] && ses.ready[ses.players.p2.id]) {
        return kickoff(ses, message, 'pvp');
      }
      return message.reply('En attente de l’autre joueur…');
    }

    /* Next AI ---------------------------------------------------- */
    if (cmd === 'next' && ses.step === 'kickAI') {
      return kickoff(ses, message, 'ai');
    }

    /* Mouvements ------------------------------------------------- */
    if (/^@?[abxy]$/i.test(body) && ses.step === 'play') {
      const mv = body.replace('@', '').toUpperCase();
      const actor = ses.turn === 'p1' ? ses.players.p1 : ses.players.p2;
      const opp   = ses.turn === 'p1' ? ses.players.p2 : ses.players.p1;
      if (actor.id !== uid && actor.id !== 'AI') return;     // pas son tour

      let txt = '', changePoss = false;

      if (ses.poss === ses.turn) { // ATTACK
        const res = doAttack(mv, actor);
        txt = res.txt;
        if (res.goal) {
          message.reply(txt + '\n📢 Score : ' + scoreLine(ses));
          if (actor.score >= MAX_GOALS) return endMatch(message, ses);
        } else {
          changePoss = !res.keep;
        }
      } else {                    // DEFENSE
        const res = doDefense(mv, actor);
        txt = res.txt;
        if (res.success) changePoss = true;
      }

      message.reply(txt + '\n' + comment());

      if (changePoss) ses.poss = ses.poss === 'p1' ? 'p2' : 'p1';

      // Mi-temps ou fin par timer
      if (Date.now() >= ses.halfEnd) {
        if (ses.half === 1) {
          ses.step = 'pause';
          return message.reply(
            '⏸️ Mi-temps !\n' +
            (ses.mode === 'ai' ? '`fc25 next`' : '`fc25 ready`')
          );
        }
        return endMatch(message, ses);
      }

      // Changer de tour
      ses.turn = ses.turn === 'p1' ? 'p2' : 'p1';

      // Tour de l’IA automatique
      if (ses.mode === 'ai' && ses.turn === 'p2') {
        await delay(2000);
        const aiMv = pick(['A', 'B', 'X', 'Y']);
        const aiMsg = ses.poss === 'p2' ? doAttack(aiMv, ses.players.p2)
                                        : doDefense(aiMv, ses.players.p2);
        message.reply(aiMsg.txt + '\n' + comment());
        if (aiMsg.goal) {
          message.reply('📢 Score : ' + scoreLine(ses));
          if (ses.players.p2.score >= MAX_GOALS) return endMatch(message, ses);
        }
        if (aiMsg.success) ses.poss = 'p2';
        ses.turn = 'p1';
      }
      return;
    }

    /* Reprise seconde mi-temps ---------------------------------- */
    if (
      (cmd === 'next' && ses.mode === 'ai' || cmd === 'ready' && ses.mode === 'pvp') &&
      ses.step === 'pause'
    ) {
      if (ses.mode === 'pvp') {
        ses.ready2 = ses.ready2 || {};
        ses.ready2[uid] = true;
        if (!ses.ready2[ses.players.p1.id] || !ses.ready2[ses.players.p2.id])
          return message.reply('En attente…');
      }
      ses.step = 'play';
      ses.half = 2;
      ses.halfEnd = Date.now() + HALF_MS;
      ses.turn = 'p1';
      return message.reply('🔁 Reprise !  P1 →  @A  @B  @X  @Y');
    }

    message.reply('Commande inconnue ou hors phase.');
  }
};

/* Helpers -------------------------------------------------------- */
function kickoff(s, msg, mode) {
  s.step = 'play';
  s.half = 1;
  s.halfEnd = Date.now() + HALF_MS;
  s.turn = 'p1';
  s.poss = 'p1';
  msg.reply(
    '⚽ Coup d’envoi !\n' +
    bold('@A') + ' passe / pressing   ' +
    bold('@B') + ' tir / tacle   ' +
    bold('@X') + ' centre / tirage maillot   ' +
    bold('@Y') + ' longue passe / interception\n' +
    (mode === 'ai' ? 'À toi de jouer !' : 'P1 commence.')
  );
}

function endMatch(msg, s) {
  msg.reply('🏁 Fin du match !  ' + scoreLine(s));
  SESS.delete(msg.threadID);
  }
