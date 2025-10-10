module.exports = {
  // -------------------- Attaque normale --------------------
  attack: function(attacker, damage, target) {
    const phrases = [
      `${attacker} fonce sur ${target} avec toute sa force, frappant violemment son adversaire et lui infligeant ${damage} PV !`,
      `${attacker} attaque ${target} de toutes ses forces, les coups s’enchaînent rapidement et ${target} encaisse ${damage} PV !`,
      `${attacker} bondit dans les airs et frappe ${target} avec précision, causant ${damage} PV !`,
      `${attacker} utilise une attaque rapide sur ${target}, provoquant ${damage} PV de dégâts !`,
      `${attacker} concentre son énergie et frappe ${target}, infligeant ${damage} PV !`,
      `${attacker} enchaîne une série de coups sur ${target}, qui vacille et perd ${damage} PV !`,
      `${attacker} attaque en visant les points faibles de ${target}, provoquant ${damage} PV de dégâts !`,
      `${attacker} frappe avec puissance ${target}, qui recule sous l’impact et subit ${damage} PV !`,
      `${attacker} utilise sa rapidité pour surprendre ${target} et lui infliger ${damage} PV !`,
      `${attacker} effectue une attaque stratégique sur ${target}, causant ${damage} PV !`
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  },

  // -------------------- Technique ultime --------------------
  ultimate: function(attacker, damage, target) {
    const phrases = [
      `💥 ${attacker} libère son attaque ultime sur ${target} ! Une explosion de puissance incroyable ! ${damage} PV de dégâts !`,
      `⚡ Une attaque dévastatrice ! ${attacker} frappe ${target} avec une force phénoménale (${damage} PV) !`,
      `${attacker} concentre toute son énergie pour une attaque ultime sur ${target}, causant ${damage} PV !`,
      `🌟 ${attacker} déchaîne sa puissance cachée et frappe ${target} ! ${damage} PV de dégâts infligés !`,
      `🔥 Explosion spectaculaire ! ${attacker} attaque ${target} avec une puissance incroyable (${damage} PV) !`,
      `💫 Attaque ultime ! ${attacker} fait vibrer le terrain et frappe ${target}, infligeant ${damage} PV !`,
      `${attacker} utilise une technique suprême sur ${target}, causant ${damage} PV et le laissant étourdi !`,
      `💥 Déferlante de puissance ! ${attacker} frappe ${target}, infligeant ${damage} PV de dégâts fulgurants !`,
      `${attacker} concentre toute son énergie et frappe ${target} avec une force titanesque ! ${damage} PV perdus !`,
      `⚡ Attaque finale ! ${attacker} projette une vague de puissance sur ${target}, infligeant ${damage} PV !`
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  },

  // -------------------- Technique spéciale / soin --------------------
  special: function(pokemon, effect) {
    const phrases = [
      `${pokemon} se concentre et libère une énergie curative, regagnant ${effect} PV !`,
      `${pokemon} utilise sa technique spéciale et restaure ${effect} PV, prêt pour le prochain combat !`,
      `✨ ${pokemon} déploie un bouclier d’énergie, se régénérant de ${effect} PV !`,
      `${pokemon} se ressaisit et retrouve ${effect} PV grâce à sa technique spéciale !`,
      `${pokemon} utilise un soin rapide et regagne ${effect} PV, reprenant confiance !`,
      `💫 ${pokemon} invoque une énergie apaisante et récupère ${effect} PV !`,
      `${pokemon} se concentre et transforme l’énergie environnante en ${effect} PV de soin !`,
      `${pokemon} se protège et restaure ${effect} PV pour continuer le combat !`,
      `${pokemon} utilise un souffle curatif et regagne ${effect} PV !`,
      `${pokemon} déploie sa technique spéciale et récupère ${effect} PV, prêt à attaquer à nouveau !`
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  },

  // -------------------- Changement de Pokémon --------------------
  changePokemon: function(player, newPokemon) {
    const phrases = [
      `🔄 ${player} décide de changer de Pokémon et envoie ${newPokemon} sur le terrain !`,
      `${player} remplace son Pokémon par ${newPokemon}, prêt à continuer le combat !`,
      `⚡ Changement stratégique ! ${player} fait entrer ${newPokemon} pour prendre l’avantage !`,
      `${player} choisit ${newPokemon} pour affronter l’adversaire avec une nouvelle énergie !`,
      `🌟 ${player} change de Pokémon ! ${newPokemon} entre en scène, prêt à attaquer !`,
      `${player} envoie ${newPokemon} et ajuste sa stratégie pour contrer l’adversaire !`,
      `💥 ${player} change de Pokémon et fait entrer ${newPokemon} sur le terrain !`,
      `${player} fait appel à ${newPokemon} pour prendre l’avantage tactique !`,
      `🔄 Nouveau Pokémon en action ! ${newPokemon} est maintenant actif pour ${player} !`,
      `${player} remplace son combattant et envoie ${newPokemon}, prêt pour le duel !`
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }
};
