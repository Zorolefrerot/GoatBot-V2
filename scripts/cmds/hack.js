 module.exports = {
  config: {
    name: "hack",
    version: "2.0",
    author: "Merdi Madimba",
    role: 2,
    shortDescription: "Simuler un piratage très réaliste",
    longDescription: "Simule le piratage d’un utilisateur par UID avec nom réel, séquence de messages et fin humoristique.",
    category: "fun",
    guide: "{pn} [uid]"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const uid = args[0];

    if (!uid || isNaN(uid)) {
      return api.sendMessage("❌ Veuillez fournir un UID valide.\nExemple : !hack 100087654321", threadID, messageID);
    }

    let name = "inconnu";
    try {
      const info = await api.getUserInfo(uid);
      name = info[uid]?.name || "inconnu";
    } catch (e) {
      return api.sendMessage("❌ UID introuvable ou erreur lors de la récupération des infos.", threadID, messageID);
    }

    const steps = [
      `🟢 Lancement du piratage sur ${name} (UID: ${uid})...`,
      `🔗 Connexion aux serveurs de Meta...`,
      `🧠 Extraction des cookies de session...`,
      `🔓 Mot de passe décodé : *********`,
      `📁 Accès aux messages privés et discussions supprimées...`,
      `📸 Téléchargement des images cachées dans la galerie secrète...`,
      `📡 Traçage de l'adresse IP : 197.***.***.***`,
      `🔍 Analyse des amis proches et des relations suspectes...`,
      `📬 Lecture de 137 messages récents...`,
      `💣 Virus injecté dans la mémoire cache du compte Facebook...`,
      `📤 Export des données dans un serveur protégé (.onion)...`,
      `🧬 Clonage de l’identité numérique en cours...`,
      `📲 Obtention du numéro lié au compte : +2** *** *** ***`,
      `📦 Paquet de données complet reçu avec succès ✅`,
      `📨 Les identifiants, mot de passe et numéro de ${name} ont été envoyés dans le privé de Merdi Madimba.`,
      `☠️ Mission accomplie. ${name} est maintenant sous notre contrôle 😈`
    ];

    let index = 0;

    const sendStep = () => {
      if (index < steps.length) {
        api.sendMessage(steps[index], threadID, () => {
          index++;
          setTimeout(sendStep, 3000); // délai de 3 secondes
        });
      }
    };

    sendStep();
  }
};
