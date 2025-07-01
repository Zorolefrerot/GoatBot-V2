const fs = require("fs");
const path = require("path");

// Chemin vers le fichier de questions dans le dossier script/cmds
const questions = require("./exherbo-questions.js");

const candidats = new Map(); // UID -> état de l’examen

module.exports = {
  config: {
    name: "exherbo",
    version: "1.1",
    author: "Merdi Madimba",
    description: "Examen complet sur 5 rubriques",
    category: "📚 Examen",
    guide: {
      en: "/exherbo add <uid>\n/exherbo\n/exherbo end"
    }
  },

  onStart: async function ({ args, message, event }) {
    const { threadID, senderID } = event;
    const adminID = "100065927401614"; // Ton UID ici

    if (args[0] === "add") {
      if (!args[1]) return message.reply("⚠️ Donne un UID.");
      const uid = args[1];
      if (!candidats.has(uid)) {
        candidats.set(uid, {
          uid,
          nom: "",
          étape: 0,
          score: 0,
          réponses: [],
          terminé: false
        });
        return message.reply(`✅ Candidat UID ${uid} ajouté.`);
      } else {
        return message.reply("ℹ️ Candidat déjà enregistré.");
      }
    }

    if (args[0] === "end") {
      if (senderID !== adminID) return;
      if (candidats.size === 0) return message.reply("📭 Aucun candidat.");

      let resultats = "📊 Résultats Exherbo :\n\n";
      for (const [_, data] of candidats) {
        const pourcent = Math.round((data.score / 25) * 100);
        resultats += `👤 UID ${data.uid} : ${pourcent}%\n`;
      }
      return message.reply(resultats);
    }

    // Lancer une rubrique
    if (senderID !== adminID) return;

    const candidat = [...candidats.values()].find(c => !c.terminé);
    if (!candidat) return message.reply("🎓 Tous les examens sont terminés.");

    const sendRubrique = (titre, questionsTab) => {
      const selected = questionsTab.sort(() => 0.5 - Math.random()).slice(0, 5);
      candidat.enCours = {
        questions: selected,
        bonnes: selected.map(q => q.answer),
        reçues: [],
        timer: null
      };

      const bloc = selected
        .map((q, i) => `@${i + 1}. ${q.question}\n${q.options.join("\n")}`)
        .join("\n\n");

      message.reply(`📚 Rubrique : ${titre}\n\n${bloc}`);

      // Délai de 30 secondes
      candidat.enCours.timer = setTimeout(() => {
        message.reply("⏱️ Temps écoulé pour cette rubrique.");
        candidat.étape++;
        if (candidat.étape >= 5) candidat.terminé = true;
      }, 30000);
    };

    // Envoyer la bonne rubrique
    const étapes = ["culture", "math", "id", "civique", "personnelle"];
    const current = étapes[candidat.étape];
    if (!current) return message.reply("✅ Examen terminé pour tous.");

    if (current === "id") {
      const selected = questions.id.sort(() => 0.5 - Math.random()).slice(0, 5);
      candidat.enCours = {
        images: selected,
        index: 0,
        bonnes: selected.map(q => q.answer),
        score: 0
      };

      message.send({ body: `🖼️ Rubrique ID : image 1`, attachment: await global.utils.getStreamFromURL(selected[0].image) });
      return;
    }

    sendRubrique(current, questions[current]);
  },

  onChat: async function ({ event, message }) {
    const { body, senderID, threadID } = event;
    if (!body || !body.startsWith("@")) return;

    const candidat = candidats.get(senderID);
    if (!candidat || !candidat.enCours || candidat.terminé) return;

    const lignes = body.trim().split("\n").map(l => l.trim());
    let bonnes = 0;

    lignes.forEach(ligne => {
      const match = ligne.match(/^@(\d+)\.\s*([A-D])$/i);
      if (match) {
        const index = parseInt(match[1], 10) - 1;
        const rep = match[2].toUpperCase();
        if (rep === candidat.enCours.bonnes[index]) bonnes++;
      }
    });

    candidat.score += bonnes;
    clearTimeout(candidat.enCours.timer);
    candidat.enCours = null;
    candidat.étape++;

    if (candidat.étape >= 5) {
      candidat.terminé = true;
      return message.reply("✅ Rubriques complétées. Résultats après `/exherbo end`.");
    } else {
      return message.reply(`✅ Réponses enregistrées. Admin : tape /exherbo pour continuer.`);
    }
  },

  onReply: async function ({ event, message }) {
    // Tu peux ajouter ici la gestion ID image si tu veux les réponses avec @ aussi
  }
};
