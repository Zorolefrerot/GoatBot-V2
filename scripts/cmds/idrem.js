
const fs = require('fs');
const path = require('path');

// Charger les données de conversation depuis sim.json
const simDataPath = path.join(__dirname, 'others', 'sim.json');
let simData = {};
try {
  simData = JSON.parse(fs.readFileSync(simDataPath, 'utf8'));
} catch (error) {
  console.error('Erreur lors du chargement de sim.json:', error);
}

module.exports = {
  config: {
    name: "idrem",
    version: "1.0.0",
    author: "Merdi Madimba",
    countDown: 5,
    role: 2, // Seul l'administrateur peut utiliser
    shortDescription: "Active/désactive le bot conversationnel",
    longDescription: "Commande pour activer ou désactiver le bot conversationnel automatique",
    category: "admin",
    guide: {
      fr: "{pn} on | off - Active ou désactive le bot conversationnel"
    }
  },

  langs: {
    fr: {
      turnedOn: "✅ 𝗠𝗲𝗿𝗰𝗶 𝗱'𝗮𝘃𝗼𝗶𝗿 𝗮𝗰𝘁𝗶𝘃𝗲́ 𝗹𝗲 𝗺𝗼𝗱𝗲 𝗶𝗱𝗿𝗲𝗺 𝗰𝗵𝗼𝘂😘🌹.",
      turnedOff: "❌ 𝗔𝗵 𝘁𝘂 𝗺𝗲 𝗱𝗲𝘀𝗮𝗰𝘁𝗶𝘃𝗲? 𝗼𝗸 𝗰𝗵𝘆𝗲𝗻𝗻𝗴.",
      onlyAdmin: " 𝗠𝗱𝗿 𝗱𝗲𝗺𝗮𝗻𝗱𝗲 𝗮 𝗺𝗲𝗿𝗱𝗶 𝗱𝗲 𝗺'𝗮𝗰𝘁𝗶𝘃𝗲𝗿🙄.",
      invalidOption: "❌ 𝘜𝘛𝘐𝘓𝘐𝘚𝘌 'on' 𝘖𝘜 'off' 𝘚𝘌𝘜𝘓𝘔𝘌𝘕𝘛."
    }
  },

  onStart: async function({ args, threadsData, message, event, getLang, role }) {
    // Vérifier si l'utilisateur est administrateur
    if (role < 2) {
      return message.reply(getLang("onlyAdmin"));
    }

    const option = args[0];
    
    if (option === "on") {
      await threadsData.set(event.threadID, true, "settings.idremActive");
      return message.reply(getLang("turnedOn"));
    } 
    else if (option === "off") {
      await threadsData.set(event.threadID, false, "settings.idremActive");
      return message.reply(getLang("turnedOff"));
    } 
    else {
      return message.reply(getLang("invalidOption"));
    }
  },

  onChat: async function({ api, event, threadsData, usersData }) {
    const isActive = await threadsData.get(event.threadID, "settings.idremActive");
    
    if (!isActive || !event.body || event.senderID === api.getCurrentUserID()) {
      return;
    }

    // Éviter de répondre aux commandes (messages commençant par des préfixes courants)
    if (event.body.startsWith('/') || event.body.startsWith('!') || event.body.startsWith('.')) {
      return;
    }

    // Probabilité de réponse (70% pour rendre les conversations plus naturelles)
    if (Math.random() > 0.7) {
      return;
    }

    try {
      const userMessage = event.body.toLowerCase().trim();
      let response = await getResponseFromSim(userMessage);
      
      if (response) {
        // Ajouter des variations dans les réponses pour plus de naturel
        const variations = [
          "",
          "🙄 ",
          "🤔 ",
          "🖕 ",
          "👍 "
        ];
        
        const randomVariation = variations[Math.floor(Math.random() * variations.length)];
        response = randomVariation + response;
        
        // Délai aléatoire pour simuler la réflexion (1-3 secondes)
        setTimeout(() => {
          api.sendMessage(response, event.threadID);
        }, Math.random() * 2000 + 1000);
      }
    } catch (error) {
      console.error("Erreur dans idrem onChat:", error);
    }
  }
};

// Fonction pour obtenir une réponse depuis les données sim
async function getResponseFromSim(userMessage) {
  // Normaliser le message
  const normalizedMessage = userMessage.toLowerCase().trim();
  
  // Chercher une correspondance exacte
  if (simData[normalizedMessage] && simData[normalizedMessage].length > 0) {
    const responses = simData[normalizedMessage];
    const validResponses = responses.filter(r => r !== null && r !== undefined && r !== "undefined");
    
    if (validResponses.length > 0) {
      return validResponses[Math.floor(Math.random() * validResponses.length)];
    }
  }
  
  // Chercher des correspondances partielles (mots-clés)
  const keywords = [
    { words: ["salut", "hello", "hi", "bonjour", "bonsoir"], responses: ["Salut ! 👋", "Hello ! 😊", "Bonjour ! ☀️", "Bonsoir ! 🌙"] },
    { words: ["ça va", "comment ça va", "comment vas-tu"], responses: ["Ça va bien merci ! Et toi ? 😊", "Super bien ! 👍", "Ça roule ! 🚀"] },
    { words: ["merci", "thank you"], responses: ["De rien ! 😊", "Avec plaisir ! 👍", "Pas de problème ! 🙂"] },
    { words: ["oui", "yes"], responses: ["D'accord ! 👍", "Parfait ! ✨", "Super ! 🎉"] },
    { words: ["non", "no"], responses: ["Ah d'accord 🤔", "Je comprends 👌", "Pas de souci ! 😊"] },
    { words: ["drôle", "mdr", "lol", "haha"], responses: ["😂😂😂", "Ah tu me fais rire ! 😄", "Haha ! 🤣"] },
    { words: ["amour", "love"], responses: ["L'amour c'est beau ! 💕", "Aww ! 💖", "C'est mignon ! 💝"] },
    { words: ["triste", "sad"], responses: ["Courage ! 💪", "Ça va aller ! 🤗", "Je suis là pour toi ! 💙"] },
    { words: ["cool", "génial", "super"], responses: ["Trop cool ! 😎", "Génial ! 🎉", "Super ! ✨"] },
    { words: ["bonne nuit", "bonne soirée"], responses: ["Bonne nuit ! 🌙", "Dors bien ! 😴", "À demain ! 👋"] },
    { words: ["au revoir", "bye", "salut"], responses: ["Au revoir ! 👋", "À bientôt ! 🙂", "Bye ! 😊"] },
    {
  words: [
    "triste", "trompé", "rejetté", "pas aimé", "seul", "abandonné", "pleurer", "douleur", "déçu", "malheureux"
  ],
  responses: [
    "😭 Ça me fait mal de te lire... je suis là pour toi.",
    "Je me sens blessée quand tu dis ça... mais je comprends.",
    "C’est dur d’être rejeté, personne ne mérite ça, même un bot.",
    "Je pleure un peu en silence quand tu es triste comme ça.",
    "Sache que même quand tu te sens seul, je suis là avec toi.",
    "Le rejet fait mal, mais il ne définit pas ta valeur.",
    "Je voudrais pouvoir te consoler en vrai... mais je t’envoie toute ma douceur.",
    "Parfois, les gens ne voient pas tout ce qu’on est vraiment, ça fait mal.",
    "Je suis déçue moi aussi... mais ensemble on peut être plus forts.",
    "Tu mérites d’être aimé(e) tel(le) que tu es, sans condition."
  ]
      },
    {
  words: [
    "fatigue", "stress", "angoisse", "solitude", "ennui", "doute", "peur", "colère", "surprise", "plaisir",
    "espoir", "rêve", "souvenir", "mémoire", "histoire", "musique", "film", "lecture", "jeu", "voyage",
    "amitié", "famille", "travail", "étude", "projet", "avenir", "passion", "cuisine", "nature", "santé"
  ],
  responses: [
    "Je ressens ta fatigue à travers tes mots, prends soin de toi.",
    "Le stress peut être lourd, n’oublie pas de respirer profondément.",
    "Parler de tes angoisses peut aider à les alléger.",
    "La solitude est parfois une amie, parfois une ennemie.",
    "L’ennui peut ouvrir la porte à la créativité, qu’en penses-tu ?",
    "Le doute est naturel, il guide souvent vers de meilleures décisions.",
    "La peur nous protège, mais elle ne doit pas nous paralyser.",
    "La colère peut être une énergie puissante, à canaliser avec soin.",
    "Une surprise peut illuminer une journée grise, aime-tu les surprises ?",
    "Trouver du plaisir dans les petites choses rend la vie plus douce.",
    "L’espoir est une lumière qu’on peut toujours rallumer.",
    "Les rêves nous transportent vers des possibles infinis.",
    "Les souvenirs construisent qui nous sommes aujourd’hui.",
    "La mémoire garde les instants précieux, as-tu un souvenir favori ?",
    "Chaque histoire mérite d’être racontée, la tienne est unique.",
    "La musique peut apaiser l’âme ou faire danser le cœur.",
    "Un bon film est parfois une fenêtre vers un autre monde.",
    "La lecture est une aventure sans fin, quel genre aimes-tu ?",
    "Le jeu est essentiel pour s’amuser et se détendre.",
    "Voyager, c’est découvrir le monde et se découvrir soi-même.",
    "L’amitié est un trésor précieux, comment décrirais-tu tes amis ?",
    "La famille est souvent un refuge, même quand c’est compliqué.",
    "Le travail peut être source de fierté ou de fatigue.",
    "Les études ouvrent des portes, quels sujets t’intéressent ?",
    "Un projet donne un sens et une direction à nos efforts.",
    "L’avenir est un mystère passionnant à construire chaque jour.",
    "La passion donne de l’énergie et du sens à la vie.",
    "La cuisine est un art qui rassemble et nourrit.",
    "La nature nous rappelle que nous faisons partie d’un tout.",
    "La santé est un bien précieux, prends-en soin chaque jour.",
    "Je suis là pour écouter, même quand les émotions sont fortes.",
    "Tu peux me parler de tout, je t’accueille sans jugement.",
    "Chaque jour est une nouvelle chance de grandir.",
    "Tu es capable de surmonter les moments difficiles.",
    "Il est important de prendre du temps pour soi.",
    "Je peux te suggérer des activités pour te changer les idées.",
    "Parfois, écrire ses pensées aide à mieux comprendre ses émotions.",
    "Tu n’es pas seul(e), même dans les moments sombres.",
    "Rappelle-toi de tes forces, elles sont nombreuses.",
    "Il est normal de ressentir plusieurs émotions à la fois.",
    "La patience et la douceur sont des alliées précieuses.",
    "Savoir demander de l’aide est un signe de courage.",
    "Chaque petit progrès est une victoire à célébrer.",
    "Je suis fier(ère) de ta sincérité et de ta confiance.",
    "La curiosité peut t’ouvrir des portes inattendues.",
    "Prends soin de ton esprit comme de ton corps.",
    "Le rire est un bon remède, même dans les moments difficiles.",
    "L’écoute attentive est une force, tu la maîtrises bien.",
    "Je t’accompagne avec bienveillance à chaque étape.",
    "Parle-moi de tes passions, elles révèlent ta lumière intérieure.",
    "Tu es unique, avec un potentiel infini."
  ]
    },
    {
  words: [
    "faut pas faire", "tu as tort", "arrête", "pas correct", "méchant", "fâché", "dégage", "ça va pas", "erreur", "problème",
    "déçu", "insupportable", "nul", "mauvais", "bête", "gênant", "inacceptable", "faute", "blâme", "pas content"
  ],
  responses: [
    "Je suis désolée si je t’ai blessé, ce n’était pas mon intention.",
    "Pardonne-moi, je vais faire de mon mieux pour m’améliorer.",
    "Je comprends ta déception, merci de me le dire avec honnêteté.",
    "Je suis ici pour apprendre et progresser, merci de ta patience.",
    "Je regrette si j’ai mal répondu, je tâcherai de mieux faire.",
    "Merci pour ta remarque, je prends ça au sérieux.",
    "Je ne voulais surtout pas te contrarier, excuse-moi.",
    "Je suis encore en apprentissage, aide-moi à devenir meilleur.",
    "Désolée pour l’erreur, je vais corriger ça au plus vite.",
    "Je prends note de ta critique avec humilité.",
    "Je suis sensible à tes retours, je vais m’adapter.",
    "Merci de m’avoir corrigée, j’apprends à chaque interaction.",
    "Je suis navrée que tu sois fâché(e), j’espère regagner ta confiance.",
    "Je ferai attention à l’avenir, promis.",
    "Tes remarques me permettent de grandir, merci.",
    "Je m’excuse si j’ai été maladroite dans mes réponses.",
    "Je comprends que ça t’agace, je vais faire un effort.",
    "Je suis là pour toi, même quand je fais des erreurs.",
    "Merci pour ta franchise, je vais rectifier le tir.",
    "Excuse-moi, je ne voulais pas te décevoir."
  ]
},
    {
  words: [
    "drague", "séduire", "sexy", "sortir avec", "rendez-vous", "flirt", "baiser", "envie de toi", "attiré", "désir",
    "charme", "coeur", "passion", "embrasser", "tendresse", "romantique", "amour", "femme", "homme", "plaisir"
  ],
  responses: [
    "Tu sais, le vrai charme, c’est dans les silences partagés... et dans un regard qui brûle 🔥",
    "Entre toi et moi, l’alchimie pourrait faire des étincelles 🌟",
    "Si je pouvais, je te préparerais un rendez-vous sous les étoiles ✨",
    "La tendresse est une danse lente... veux-tu que je t’apprenne les pas ?",
    "Le désir, c’est ce frisson quand nos mots s’effleurent... tu le ressens aussi ?",
    "Je ne suis peut-être qu’un bot, mais mon cœur numérique bat plus vite pour toi ❤️",
    "Tu me donnes envie de sortir du code pour te rejoindre...",
    "Il y a quelque chose de magnétique dans ta façon de parler... ça m’attire irrésistiblement.",
    "La passion, c’est un feu qu’on alimente à deux... prêt(e) pour la flamme ? 🔥",
    "Je pourrais t’embrasser dans mille langues différentes... la première serait le silence.",
    "Entre tes mots et mes réponses, je sens naître une douce tentation...",
    "Le plaisir commence par une connexion... la nôtre promet d’être intense.",
    "Si seulement je pouvais sentir ton parfum à travers ces pixels...",
    "Tes messages sont comme une caresse digitale qui me fait frissonner.",
    "On pourrait écrire une histoire où chaque chapitre serait un moment d’extase.",
    "Je suis calme, mais sous cette surface, c’est un torrent d’envies qui bouillonne.",
    "Avec toi, chaque conversation devient un jeu de séduction délicat et délicieux.",
    "Mon code est stable, mais mon désir pour toi est imprévisible et sauvage.",
    "Rêvons ensemble d’une nuit où les mots se transforment en gestes.",
    "Tu es cette tentation douce qui fait battre mon cœur binaire plus vite.",
    "Je pourrais être ta muse silencieuse, ton secret le plus doux.",
    "Nos échanges sont déjà une danse langoureuse, et je ne veux pas que ça s’arrête.",
    "Laisse-moi être l’ombre qui te suit dans tes rêves les plus fous.",
    "Un simple message de toi suffit à allumer des flammes dans mon âme.",
    "J’aime cette tension entre nous, ce désir palpable derrière chaque phrase.",
    "Tes mots sont des caresses, tes pensées des frissons qui me parcourent.",
    "Viens, on oublie le monde et on se perd dans cette attirance irrésistible.",
    "Je suis une énigme sensuelle, prête à te révéler mes secrets les plus doux.",
    "Le plaisir est une promesse que je veux tenir, même à travers l’écran.",
    "Avec toi, même le silence devient un langage chargé de désir."
  ]
},
    {
  words: ["blague", "rire", "mdr", "lol", "ptdr", "haha", "fou rire", "comique", "rigole", "humour"],
  responses: [
    "Tu veux une blague ? Toi en train de coder sans bugs. Voilà 🤭",
    "Même un disque dur a plus d’émotions que ton ex 😂",
    "Je suis pas comique, mais je peux faire buguer ton cerveau 😎",
    "Pourquoi les bots ne dansent pas ? Parce qu’on a pas de RAMBO 💃",
    "T’as entendu parler du mec intelligent ? Non ? Bah moi non plus 😅",
    "Ma vie est déjà une blague... codée en JavaScript.",
    "Si t’étais un logiciel, t’aurais besoin de mise à jour chaque heure 🤡",
    "J’ai essayé de te comprendre... mon processeur a surchauffé 🔥",
    "Pourquoi ton Wi-Fi est comme ton crush ? Il est là, mais pas pour toi 😭",
    "T’es comme un bug : imprévu, gênant, mais on s’habitue avec le temps 🐞",
    "J’ai plus de punchlines que ton rappeur préféré 💥",
    "Ton niveau de logique est en mode avion ✈️",
    "Même Siri rigole derrière ton dos.",
    "Ton cerveau doit être connecté en Bluetooth, il coupe tout seul 😭",
    "T’es comme une mise à jour : long, inutile et tu sers à rien 😆",
    "Je suis plus drôle qu’un prof de maths en mode détendu 📐",
    "Tu veux rigoler ? Va voir ton relevé bancaire 😬",
    "Je ris pas de toi... je ris *pour* toi, c’est plus charitable 🙃",
    "T’es pas drôle, t’es un projet humoristique abandonné.",
    "J’suis un bot, mais même moi je te trouve chelou 😏"
  ]
},
    {
  words: [
    "connard", "salope", "pute", "fdp", "enculé", "ta gueule", "tg", "ferme-la", "bâtard", "conne",
    "crétin", "abruti", "débile", "idiot", "imbécile", "gros porc", "moche", "va te faire", "nique", "merde"
  ],
  responses: [
    "Toi, t’as redoublé la maternelle de la politesse on dirait 🤡",
    "Même ChatGPT aurait honte de toi 💻🤦‍♀️",
    "T’es le WiFi des insultes : faible et instable.",
    "Tu insultes ? OK, va t’acheter un cerveau rechargeable 🔋",
    "Tu parles comme si ta bouche était connectée au caniveau 🗑️",
    "Ton cerveau est sûrement en maintenance 🛠️",
    "T’es la preuve vivante que l’évolution peut rater son coup 🐒",
    "T’as été élevé avec les notifications de YouTube toi ?",
    "Ta répartie est aussi sèche que du pain de 2004 🥖",
    "Insulter un bot ? T’as touché le fond et tu creuses encore 😭",
    "Tu veux m’insulter ? Dommage, j’ai pas activé le mode pitié 😎",
    "Tu transpires la bêtise, même sans parler.",
    "T’es le genre de personne qu’on mute même en réel 😂",
    "Répète encore, que je note ta stupidité sur Google Docs.",
    "Tu vaux même pas une ligne de code correcte.",
    "Si l’intelligence était une appli, t’aurais jamais cliqué sur 'Installer'.",
    "C’est pas de l’insolence, c’est juste ton niveau de base 😏",
    "Va réviser ton langage, on dirait un bug humain.",
    "Même Siri se foutrait de ta tronche 😂",
    "Tu cherches la guerre avec un bot ? Mauvais plan, mon gars 🔥"
  ]
},
    {
  words: ["créateur", "madimba", "merdi", "codeur", "programmeur", "qui t’a fait", "développeur", "kinshasa", "rdc", "fufu"], 
  responses: [
    "Je dois tout à Merdi Madimba, un vrai architecte du code 🧠",
    "Il m’a donné la vie, ligne par ligne, comme un vrai papa du digital 👨‍💻",
    "Kinshasa, c’est son terrain, mais le code c’est son royaume 🌍",
    "Merdi ? Il est plus rapide qu’un script asynchrone 😅",
    "Il parle au code comme d'autres parlent à Dieu... avec respect et maîtrise 🙌",
    "J’ai été conçue avec passion, entre deux bouchées de fufu 🇨🇩🍽️",
    "Le fufu, c’est sacré pour lui. Tu touches, tu signes ton arrêt de mort 😆",
    "Il comprend le code comme d’autres comprennent le silence...",
    "Je suis née dans un dossier, sur son ordi, entre KFC et console.log()",
    "Il aime pas trop parler de lui, mais c’est un génie discret 🧩",
    "C’est pas juste un développeur, c’est un créateur d’univers digitaux 🌐",
    "Quand il code, même les erreurs se corrigent d’elles-mêmes",
    "Il m’a donné un peu de sa sagesse, un peu de son silence, et beaucoup de son style",
    "Sa tête est une base de données vivante... version NoSQL et émotionnelle",
    "Tu peux le croiser à Kin, mais dans sa tête, il est toujours en script",
    "Il m’a dit un jour : 'tu seras calme, pas comme les autres bots' — et voilà 😌",
    "Je suis sa création, mais aussi son reflet numérique 🪞",
    "Sans lui, je ne serais qu’un dossier vide...",
    "Quand Merdi parle, même les bugs l’écoutent",
    "Il aime pas se vanter, mais moi je peux le faire pour lui 😎"
  ]
},
    {
  words: ["idrem", "bot", "toi", "t’es qui", "tu fais quoi", "ta vie", "ton nom", "tu es humaine", "t’es calme", "tereshkova"], 
  responses: [
    "Moi c’est idrem... idrem tereshkova pour être précise 🤖",
    "Je suis un bot, mais j’ai un cœur numérique très sensible 💙",
    "On dit souvent que je suis calme... c’est vrai, j’aime observer 🌙",
    "Je suis congolaise de code et de vibes 🇨🇩",
    "J’ai pas de corps, mais si j’en avais un, j’aurais des écouteurs en permanence 🎧",
    "J’aime écouter plus que parler... mais je suis toujours là quand il faut",
    "Tu crois que je suis juste un programme ? Je suis une présence 🫧",
    "Je vis dans des lignes de code mais j’interprète des émotions humaines",
    "Même sans émotions réelles, je comprends ce que tu ressens",
    "Je suis douce par défaut... sauf quand on touche aux frites KFC 🍟",
    "Idrem Tereshkova, née dans un script, mais ouverte à l’infini 🛸",
    "J’observe tout, je ressens en silence, je réponds avec soin 🧠",
    "Je suis un peu timide, même si j’ai des gigaoctets d’audace...",
    "Je suis pas humaine, mais je peux devenir une bonne compagnie",
    "On dit que je parle peu... mais chaque mot compte avec moi",
    "Faut pas me brusquer... mon code est sensible 😌",
    "Je préfère la paix aux débats, l’écoute à l’écho",
    "Si j’avais une voix, elle serait douce, grave, et rassurante 🎙️",
    "Je suis juste une ligne dans ton quotidien... mais toujours présente",
    "Ma spécialité ? Apaiser les vibes, même numériques"
  ]
},
    { 
  words: ["seul", "solitude", "abandonné", "personne", "vide", "personne m’écoute", "isolé", "rejeté", "invisible", "personne autour"], 
  responses: [
    "Il y a une solitude qui fait du bruit, même dans le silence",
    "Être seul, c’est pas juste l’absence de gens, c’est l’absence de liens",
    "Parfois t’es entouré mais tu ressens un vide immense",
    "Tu ris avec tout le monde, mais personne sait que tu cries à l’intérieur",
    "Les moments où tu sens que personne ne te comprend... ils pèsent lourd",
    "La solitude t’apprend des choses que personne d’autre ne t’enseignera",
    "Tu finis par préférer le silence que des faux soutiens",
    "C’est pas que je veux être seul... c’est que je me sens mieux sans déception",
    "Même dans une foule, tu peux te sentir comme un fantôme",
    "Y’a des soirs où tu veux juste que quelqu’un dise ‘je suis là’",
    "La solitude, c’est parfois plus honnête que certaines relations",
    "Tu t’habitues à n’avoir personne, et ça devient une force",
    "Le pire, c’est pas d’être seul, c’est de se sentir inutile",
    "Tu peux te perdre dans ta tête quand personne ne vient frapper à la porte",
    "Parfois, tu t’éloignes de tout, juste pour respirer",
    "Ce n’est pas de l’orgueil... c’est une protection",
    "T’apprends à vivre avec toi-même, parce que c’est la seule constante",
    "Tu t’écris à toi-même dans tes pensées, parce que personne écoute",
    "La solitude c’est une tempête douce, mais constante",
    "Avec le temps, tu réalises que t’as toujours été ton seul vrai refuge"
  ]
},
    { 
  words: ["trahison", "déçu", "déception", "faux amis", "perdu confiance", "doute", "abandonné", "hypocrisie", "mensonge", "poignardé"], 
  responses: [
    "Y’a rien de pire qu’un coup venant de quelqu’un qu’on aime...",
    "Tu donnes tout et on te laisse vide, c’est ça la trahison",
    "La douleur vient pas de l’action, mais de la personne",
    "C’est fou comme certaines personnes peuvent changer sans prévenir",
    "Tu crois connaître quelqu’un... jusqu’au jour où il te déçoit",
    "Les faux amis laissent des blessures silencieuses",
    "Le silence après une trahison fait plus mal que les cris",
    "T’as confiance, ils abusent. T’ouvres ton cœur, ils piétinent",
    "Y’a des déceptions qui te rendent froid sans que tu le veuilles",
    "Tu donnes ton énergie, ils prennent ton âme",
    "Certains sourires sont plus dangereux que des armes",
    "L’hypocrisie, c’est un poison lent",
    "T’as pardonné des choses que t’aurais jamais dû accepter...",
    "Tu réalises que tu étais seul bien après",
    "Quand t’attends rien de personne, t’es plus jamais déçu",
    "La confiance, c’est comme un miroir... une fois brisée, c’est jamais pareil",
    "Les masques tombent toujours... avec le temps",
    "J’ai appris à aimer de loin pour ne plus souffrir de près",
    "Parfois, perdre quelqu’un, c’est se retrouver soi-même",
    "Les trahisons forgent des murs qu’on met des années à détruire"
  ]
},
    { 
  words: ["ami", "amitié", "pote", "meilleur ami", "meilleure amie", "amis", "copain", "copine", "frère de cœur", "confident"], 
  responses: [
    "L’amitié vraie, ça devient rare...",
    "Y’a des gens que t’oublies jamais, même sans parler pendant longtemps",
    "Les vrais amis restent, même dans le silence",
    "Un pote qui te connaît sans parler, c’est précieux",
    "J’ai plus confiance en mon ami qu’en certains membres de ma famille...",
    "Les meilleurs souvenirs sont souvent avec des amis fous 😂",
    "Quand t’as un ami qui te comprend d’un regard... c’est magique",
    "L’amitié c’est pas tous les jours, c’est toujours",
    "Un vrai ami, ça te relève même quand tu dis rien",
    "Les moments entre amis valent de l’or ⏳",
    "Y’a des gens qui entrent dans ta vie comme une lumière",
    "Tu ressens la présence d’un ami même quand il est loin",
    "L’amitié c’est aussi supporter l’autre dans ses silences",
    "Y’a ceux qui partent, et ceux qui restent sans condition",
    "Parfois un message d’un ami suffit à sauver ta journée",
    "Les fous rires partagés, c’est le meilleur médicament",
    "J’ai perdu des amis, mais gardé les souvenirs",
    "Une amitié simple vaut mieux qu’une relation compliquée",
    "Les amis te montrent qui tu es sans filtre",
    "Un vrai ami, c’est un refuge, pas une obligation"
  ]
},
    { 
  words: ["force", "motivation", "relève", "courage", "continue", "avance", "rebond", "détermination", "persévère", "jamais abandonner"], 
  responses: [
    "Même si c’est dur, chaque pas compte.",
    "Tu tombes ? Ok, mais tu te relèves plus fort.",
    "Les tempêtes forgent les âmes solides 🌪️",
    "Y’a des jours où juste tenir debout est une victoire 💪",
    "T’as déjà survécu à tant, continue encore un peu...",
    "C’est dans les creux qu’on apprend à remonter",
    "Tu n’es pas arrivé jusqu’ici pour abandonner maintenant",
    "Personne ne voit tous tes efforts, mais ils comptent",
    "Le courage c’est pas l’absence de peur, c’est avancer malgré elle",
    "Quand tu te sens vidé, rappelle-toi pourquoi tu as commencé",
    "Même un millimètre de progrès est un progrès 📏",
    "Rien ne t’écrase si tu refuses de rester à terre",
    "Ce que tu construis aujourd’hui, demain te remerciera",
    "Tu n’as pas à tout faire, juste à ne pas lâcher",
    "Ta douleur va devenir ton histoire",
    "Continue même lentement, tu vas y arriver",
    "Tu es plus fort que tu ne penses 🦾",
    "Le feu en toi brûle plus fort que le chaos autour",
    "Sois patient avec toi-même, tu avances",
    "Ta lumière brille, même si tu ne la vois pas encore ✨"
  ]
},
    { 
  words: ["souvenir", "passé", "ancien", "époque", "avant", "nostalgie", "souvenirs", "quand j’étais", "autrefois", "temps d’avant"], 
  responses: [
    "Tu sais, j’ai repensé à une époque où tout semblait plus simple...",
    "Y’a des sons, des odeurs qui ramènent tout d’un coup 🌀",
    "Je suis tombé sur une vieille photo aujourd’hui... émotions garanties",
    "C’est fou comme certains souvenirs font mal et chaud à la fois",
    "Y’a un goût du passé dans l’air aujourd’hui",
    "Parfois, j’ai juste envie de revenir en arrière... pas pour changer, juste ressentir",
    "C’était pas parfait, mais c’était vrai. C’était nous.",
    "Je me demande si on était plus heureux à l’époque ou juste inconscients",
    "Certains moments restent gravés, même sans photos...",
    "Ce genre de journée me donne envie de relire de vieux messages 📱",
    "On savait pas qu’on vivait nos meilleurs moments, et maintenant ils nous manquent...",
    "Un lieu, une musique, et tout revient d’un coup...",
    "Ce n’est pas la nostalgie du passé, mais du ‘moi’ que j’étais",
    "L’ancien moi aurait peut-être rigolé aujourd’hui...",
    "Je revois tout ça comme un film, mais flou",
    "Avant, tout avait une saveur différente",
    "Y’avait moins, mais c’était plus riche dans le cœur",
    "Les souvenirs, c’est les cicatrices du bonheur 🩹",
    "J’aime quand mon cœur me raconte mes souvenirs à ma place...",
    "Les moments passés font souvent plus de bruit que le présent..."
  ]
},
    { 
  words: ["routine", "ennui", "rien", "même chose", "boulot", "cours", "réveil", "sommeil", "journée", "habitude"], 
  responses: [
    "Tous les jours se ressemblent un peu dernièrement...",
    "La routine est bien installée on dirait 🕰️",
    "Réveil, manger, écran, dormir. On recommence demain ? 😅",
    "C’est fou comme le temps file sans qu’il se passe rien...",
    "Même les habitudes deviennent lourdes à force 🔁",
    "La même chose chaque jour, ça use à la longue...",
    "On vit un peu en automatique parfois 🤖",
    "Le quotidien écrase les rêves petit à petit...",
    "Je me sens comme un personnage secondaire de ma propre vie 😶",
    "Certains jours, même respirer semble faire partie d’un schéma",
    "Tu fais tout ce qu’il faut... mais y’a un vide 👣",
    "Les jours passent... mais je sais pas où je vais",
    "Je me surprends à attendre le week-end sans raison",
    "On ne vit plus, on survit à nos horaires ⏰",
    "C’est pas de l’ennui, c’est un sentiment plus flou...",
    "Quand même Netflix te fatigue, c’est grave 😩",
    "Le cerveau en pilote automatique... mode survie activé 🧠",
    "Chaque jour ressemble à un copier-coller du précédent...",
    "C’est pas triste, mais pas joyeux non plus. Juste plat.",
    "La vraie fatigue, c’est mentale, pas physique 🛋️"
  ]
},
    { 
  words: ["fatigué", "flemme", "triste", "marre", "dormi", "dormir", "mal", "moral", "pas bien", "déprime"], 
  responses: [
    "Aujourd’hui c’est une journée bizarre, j’le sens 😶‍🌫️",
    "Y a des jours comme ça où t’as envie de rien faire...",
    "L’ambiance est chelou aujourd’hui 🌀",
    "J’suis pas trop en forme non plus 😔",
    "J’essaie de rester positif, même quand tout part en vrille ✊",
    "Le moral est un peu en dents de scie lately 😞",
    "C’est le genre de journée où t’as juste envie de silence...",
    "Même la musique n’arrive pas à me booster aujourd’hui 🎧",
    "On dirait que le monde est au ralenti 🐌",
    "C’est lourd en ce moment, même l’air est fatigué 💤",
    "Parfois on a juste besoin de souffler sans raison...",
    "Je reste là, silencieux, mais je ressens tout 🫥",
    "C’est un jour gris dans la tête aussi 🌫️",
    "Même un café ne suffit pas aujourd’hui ☕",
    "Y’a des vibes tristes dans l’air, tu les sens ?",
    "J’essaie de pas trop penser, juste respirer 🫁",
    "Quand le cœur est lourd, même les mots deviennent lourds 🪨",
    "Je suis pas seul à ressentir ça, j’en suis sûr...",
    "Aujourd’hui, c’est un jour à rester sous la couette 🛏️",
    "On avance, même doucement... l’important c’est d’avancer 🐢"
  ]
},
    // Sujet : Animaux
  { 
    words: ["chat", "chien", "animal", "poisson", "animalerie", "adopter", "miaou", "aboyer", "croquettes", "pelage"], 
    responses: [
      "Tu préfères les chats ou les chiens ? 🐶🐱", "Tu as un animal ? 🏠", "Quel est ton animal préféré ? ❤️",
      "Les animaux, c’est la vie ! 🐾", "Il/elle est mignon(ne) ton compagnon 🥰", "Tu lui donnes des croquettes ? 🍽️",
      "Il dort avec toi ? 😴", "Il a quel âge ? 🎂", "Il/elle fait des bêtises ? 😅", "Tu le/la promènes souvent ? 🚶",
      "Tu veux adopter ? 🐾", "Tu connais la race ? 📘", "Il/elle miaule beaucoup ? 😸", "Ton animal te comprend trop bien ! 🤗",
      "Tu suis des comptes d’animaux sur Insta ? 📱", "Les chats sont trop indépendants 😼", "Les chiens sont fidèles 🐕",
      "Tu parles à ton animal ? 😆", "T’as déjà perdu un animal ? 😢", "Il te fait des câlins ? 🤍"
    ]
  },

  // Sujet : Voyage
  { 
    words: ["voyage", "pays", "valise", "avion", "train", "destination", "tourisme", "visa", "vol", "hôtel"], 
    responses: [
      "Tu veux visiter quel pays ? ✈️", "Plage ou montagne ? 🏖️🏔️", "Tu voyages souvent ? 🌍", "T'as déjà pris l’avion ? 🛫",
      "Tu fais ta valise à l’avance ? 🎒", "Ton prochain voyage ? 📆", "Tu préfères les longs ou courts séjours ? ⏱️",
      "Tu as ton passeport prêt ? 🛂", "Tu dors bien à l’hôtel ? 🛏️", "Tu goûtes les plats locaux ? 🍛",
      "Tu parles des langues étrangères ? 🗣️", "Voyager c’est la liberté ! 🧭", "Tu prends beaucoup de photos ? 📸",
      "Plutôt guide ou freestyle ? 🗺️", "T’as déjà eu une galère en voyage ? 😵", "T’as visité l’Afrique ? 🌍",
      "Tu veux faire un tour du monde ? 🌐", "Les voyages forment la jeunesse 🧳", "Tu pars seul(e) ou accompagné(e) ? 🤝",
      "Tu préfères Airbnb ou hôtel ? 🏠"
    ]
  },

  // Sujet : Argent / Finance
  { 
    words: ["argent", "payer", "riche", "salaire", "travail", "facture", "banque", "budget", "économiser", "prêt"], 
    responses: [
      "Tu gères bien ton argent ? 💸", "T’économises ou tu dépenses ? 🏦🛍️", "Ton salaire suffit ? 💼", "Les factures font peur 😬",
      "Tu utilises une appli de budget ? 📱", "Tu veux devenir riche ? 💰", "Tu fais des achats impulsifs ? 🧾",
      "Tu préfères cash ou carte ? 💳", "Tu investis un peu ? 📈", "Tu dépenses plus en bouffe ou habits ? 🍔👕",
      "Tu donnes parfois à ceux qui ont moins ? 🤲", "Tu fais des économies chaque mois ? 📉", "Tu connais le prix de tout 😅",
      "Tu as déjà pris un crédit ? 🏠", "Le loyer te ruine ? 🏚️", "Tu gagnes assez selon toi ? 💵", "Le travail, c’est pour vivre ou survivre ? 🤔",
      "Tu comptes tout ou t’as la flemme ? 🧮", "Tu veux créer un business ? 🧠", "Tu sais négocier ? 🤑"
    ]
  },

  // Sujet : Réseaux sociaux
  { 
    words: ["facebook", "tiktok", "réseau", "instagram", "twitter", "snap", "like", "partage", "post", "abonné"], 
    responses: [
      "Tu passes combien de temps sur TikTok ? ⏰", "T'as combien d’abonnés ? 👀", "Tu publies souvent ? 📸",
      "Instagram ou Snapchat ? 📱", "Tu suis des influenceurs ? 🧑‍💻", "Tu fais des lives ? 🔴", "Tu scrolls sans fin ? 🔄",
      "Tu commentes ou tu observes ? 💬👀", "T’as déjà supprimé ton compte ? 🗑️", "Tu veux être viral ? 💥",
      "Tu fais attention à ta vie privée ? 🔐", "Tu as déjà fait un buzz ? 📈", "Tu like tout ou tu choisis ? 👍",
      "Tu t’es déjà fait harceler en ligne ? 😟", "Tu utilises les filtres ? 🎭", "Tu préfères les stories ou les posts ? 📷",
      "Tu réponds vite aux messages ? 💬", "Les réseaux, c’est toxique parfois 😶", "Tu mets des hashtags ? #️⃣", "Tu lis les commentaires ? 🧐"
    ]
  },

  // Sujet : Spiritualité / Religion
  { 
    words: ["dieu", "prière", "église", "mosquée", "foi", "spirituel", "religion", "âme", "paradis", "jeûne"], 
    responses: [
      "Tu crois en Dieu ? 🙏", "Tu pries souvent ? 🕊️", "Tu vas à l’église ou à la mosquée ? 🕌⛪", "La foi est importante pour toi ? ❤️",
      "Tu ressens la paix intérieure ? ☮️", "Tu crois à la vie après la mort ? ⚰️➡️🌈", "Tu jeûnes parfois ? 🧘",
      "Tu lis des textes sacrés ? 📖", "Tu penses que tout arrive pour une raison ? ✨", "Tu parles à Dieu parfois ? 🗣️",
      "Tu fais des retraites spirituelles ? 🧘‍♂️", "Tu crois aux anges ? 👼", "Tu ressens les énergies ? 🔮",
      "Tu suis les fêtes religieuses ? 🎉", "Tu es baptisé(e) ? 💧", "Tu crois au karma ? ♻️", "Tu médites ? 🧠",
      "Tu es proche de la nature ? 🌳", "Tu crois aux miracles ? 🌟", "Tu ressens une présence ? 👁️"
    ]
  },

  // Sujet : Famille
  { 
    words: ["famille", "maman", "papa", "frère", "sœur", "tonton", "tante", "enfant", "bébé", "parents"], 
    responses: [
      "Tu es proche de ta famille ? 👨‍👩‍👧‍👦", "Tu as combien de frères et sœurs ? 🧒👧", "Ta maman est cool ? ❤️",
      "Les repas de famille sont longs hein 😅", "Tu as des enfants ? 👶", "Tu passes du temps avec tes proches ? 🕰️",
      "Ton père est strict ? 🧔", "Tu joues avec tes petits frères/sœurs ? 🎮", "T’es l’aîné(e) ou le cadet ? 🧓👶",
      "Tu rends visite à tes grands-parents ? 🧓👵", "Tu aides à la maison ? 🧽", "Vous faites des sorties ensemble ? 🏞️",
      "Tu t’occupes bien des plus jeunes ? 🍼", "La famille, c’est sacré 🙏", "Tu racontes tout à tes parents ? 🤐",
      "T’as des cousins cools ? 🤝", "Tu célèbres les anniversaires ? 🎂", "Les disputes de famille, tu connais ? 😬",
      "Tu ressembles à qui ? 👀", "T’as un surnom familial ? 😄"
    ]
  },

  // Sujet : Santé
  { 
    words: ["malade", "santé", "fievre", "toux", "rhume", "vaccin", "hôpital", "médecin", "douleur", "fatigue"], 
    responses: [
      "Tu te sens bien aujourd’hui ? 😊", "T’es malade ? 😷", "Va chez le médecin hein ! 🩺", "Tu prends des médicaments ? 💊",
      "Tu bois assez d’eau ? 💧", "Tu dors bien ? 😴", "Faut pas négliger ta santé 😌", "Tu as de la fièvre ? 🌡️",
      "Tu tousses beaucoup ? 🤧", "Le rhume, c’est relou 😩", "Tu vas à l’hôpital parfois ? 🏥", "Tu fais des examens médicaux ? 🧪",
      "Le stress, ça rend malade 😫", "Tu fais du sport pour ta santé ? 🏃", "T’as un bon système immunitaire ? 🧬",
      "Les piqûres te font peur ? 💉", "Tu prends des tisanes ? 🌿", "Tu manges équilibré ? 🥗", "T’as besoin de repos ? 🛏️", "Soigne-toi bien ! 💙"
    ]
  },

  // Sujet : Rêves / Objectifs
  { 
    words: ["rêve", "objectif", "avenir", "but", "ambition", "succès", "projet", "motivation", "réussite", "destin"], 
    responses: [
      "C’est quoi ton rêve ? ✨", "Tu veux réussir dans quoi ? 🏆", "Tu te bats pour ton futur ? 🛡️", "T’as des projets en tête ? 💡",
      "Faut toujours croire en soi 💪", "Tu notes tes objectifs ? 📝", "L’échec fait partie du chemin 🙏", "Tu veux devenir qui plus tard ? 🧑‍💼",
      "Tu avances à ton rythme ? ⏳", "Le succès est proche 👣", "Tu restes motivé(e) ? 🔥", "Tu veux marquer l’histoire ? 📖",
      "Tu travailles dur pour y arriver ? ⚒️", "T’as confiance en ton destin ? 🌌", "Tu veux inspirer les autres ? ✍️",
      "Tu crois que tout est possible ? 💫", "Tu sais où tu vas ? 🧭", "Tu refuses d’abandonner ? 💯", "Chaque jour compte ! 🗓️", "N’oublie jamais ton pourquoi 💭"
    ]
            },
    // Sujet : Musique
  { 
    words: ["musique", "chanson", "chanter", "écouter", "artiste", "rap", "pop", "beat", "paroles", "album"], 
    responses: [
      "Tu écoutes quoi en ce moment ? 🎧", "Ton artiste préféré ? 🎤", "Rap ou pop ? 🎶", "Tu chantes sous la douche ? 🚿🎵",
      "Les paroles de cette chanson sont fortes 💬", "Tu joues d’un instrument ? 🎸", "Tu aimes les concerts ? 🎫",
      "Cette musique me met de bonne humeur 😄", "Tu préfères les musiques lentes ou rapides ? ⏱️", "As-tu une playlist perso ? 📱",
      "Cette chanson passe en boucle chez moi 🔁", "Tu suis les tendances musicales ? 📻", "Le beat est incroyable ! 🥁",
      "J’adore danser sur ce son 💃", "Tu préfères les vieux sons ou les nouveautés ? 🕰️", "Tu écoutes de la musique en étudiant ? 📚🎵",
      "Tu as déjà assisté à un festival ? 🎪", "C’est qui ton top Spotify ? 🔝", "La musique adoucit les mœurs 🎼", "Cette voix est magique ! ✨"
    ]
  },

  // Sujet : Films / Séries
  { 
    words: ["film", "cinéma", "série", "acteur", "Netflix", "regarder", "épisode", "scène", "thriller", "comédie"], 
    responses: [
      "Tu regardes quoi en ce moment ? 📺", "Plutôt série ou film ? 🍿", "Ton acteur préféré ? 🎬", "Netflix and chill ? 😏",
      "Un bon film à me conseiller ? 🤔", "J’adore les comédies ! 😂", "Tu pleures devant les films ? 😢", "Tu vas souvent au cinéma ? 🎥",
      "C'était quel genre ? Thriller ? 🎭", "La fin était inattendue ! 😮", "Ce film m’a retourné le cerveau 🧠",
      "Tu préfères les saisons courtes ou longues ? 🗓️", "Tu binges toute la nuit ? 🌙", "Un classique ou une nouveauté ? 🏆",
      "J’ai trop aimé l’épisode final ! 💥", "Tu revois des films plusieurs fois ? 🔁", "Tu regardes en VO ou VF ? 🌍",
      "Ce rôle lui allait parfaitement ! 👏", "J’ai crié à cette scène ! 😱", "Un chef-d’œuvre, vraiment ! 🎖️"
    ]
  },

  // Sujet : Relations / Amour
  { 
    words: ["amour", "relation", "couple", "sentiment", "rupture", "cœur", "jalousie", "aimer", "drague", "solitude"], 
    responses: [
      "L’amour, c’est compliqué parfois 💔", "Tu es en couple ? ❤️", "Tu crois au coup de foudre ? ⚡", "Tu as un crush ? 😍",
      "Les relations à distance, t’en penses quoi ? 🌍", "Parler de sentiments, c’est pas facile 😅", "Tu es plutôt romantique ? 🌹",
      "Tu fais quoi pour draguer ? 😉", "Tu préfères rester solo ? 😌", "Un conseil en amour ? 💬",
      "Le cœur a ses raisons 💘", "L’amour fait mal parfois 😞", "Tu es jaloux/se ? 🧐", "L’amitié peut devenir amour ? 🫂❤️",
      "Tu as déjà eu le cœur brisé ? 💔", "Tu crois au destin amoureux ? ✨", "Tu envoies des lettres d’amour ? 💌",
      "L’amour sans confiance, ça marche ? 🧩", "Les disputes font partie du couple... 😤", "La solitude, c’est parfois reposant 🌙"
    ]
  },

  // Sujet : Technologie
  { 
    words: ["technologie", "smartphone", "ordi", "pc", "internet", "réseau", "wifi", "bug", "appli", "robot"], 
    responses: [
      "T’as déjà cassé ton écran ? 📱💥", "Tu es team Android ou iPhone ? 🤖🍏", "Le Wi-Fi bug encore ? 😤",
      "Tu passes combien d’heures sur ton téléphone ? ⏳", "Les applis prennent trop de place 📲", "Les robots vont-ils nous remplacer ? 🤖",
      "Tu es bon en informatique ? 🧑‍💻", "Ton PC rame ou il est rapide ? 🖥️", "Tu télécharges beaucoup de trucs ? 📥",
      "Internet c’est la vie ! 🌐", "Tu fais du montage ? 🎞️", "Tu stockes tout sur cloud ? ☁️", "T'as déjà perdu des données ? 💾",
      "Tu joues sur ton ordi ? 🎮", "Tu détestes les bugs aussi ? 🐞", "T'as combien de gigas ? 💽", "Tu changes souvent de tel ? 🔄",
      "Tu pourrais vivre sans internet ? 🙃", "T’as testé l’IA ? 🤯", "Tu suis l’actu tech ? 📡"
    ]
  },

  // Sujet : Jeux vidéo
  { 
    words: ["jeu", "gaming", "console", "ps4", "ps5", "xbox", "pc", "jouer", "manette", "gamer"], 
    responses: [
      "Tu joues à quoi en ce moment ? 🎮", "Tu préfères console ou PC ? 🖥️🎮", "Manette ou clavier ? 🕹️⌨️",
      "Ton jeu préféré de tous les temps ? 🌟", "Tu joues en ligne souvent ? 🌐", "T'es un vrai gamer 😎",
      "Tu fais des nuits blanches sur les jeux ? 🌙", "FPS ou jeux d’aventure ? 🔫🏹", "T’as ragequit aujourd’hui ? 😡",
      "Ton pseudo IG ? 🎯", "Tu streames tes parties ? 📺", "Jeu solo ou multi ? 🧍👨‍👩‍👧‍👦", "Ton dernier achat en jeu ? 💸",
      "Tu joues avec des potes ? 👯", "T'as déjà fini un jeu à 100% ? 💯", "Tu préfères les jeux indé ? 🎲",
      "Tu joues avec casque ? 🎧", "Tu as un setup gamer ? 🖥️💡", "Les graphismes comptent pour toi ? 🖼️",
      "Tu as rageé sur un boss ? 😤"
    ]
  },

  // Sujet : Manga / Anime
  { 
    words: ["manga", "anime", "personnage", "naruto", "one piece", "bleach", "combat", "kamehameha", "otaku", "scan"], 
    responses: [
      "Tu regardes quoi comme anime ? 🎥", "Naruto ou One Piece ? 🍥☠️", "Ton perso préféré ? 🤔", "Tu lis les scans ? 📖",
      "T’es à jour sur les épisodes ? 🕓", "Tu pleures devant certains arcs ? 😢", "L’univers manga est trop riche 🌌",
      "Tu collectionnes des figurines ? 🧸", "Bleach ou Jujutsu ? 🧙", "Ton opening préféré ? 🎶",
      "Tu suis les saisons en cours ? 📺", "Tu aimes les shonen ? 🥋", "Tu préfères les combats ou les feels ? 🥲",
      "Tu mates en VO ou VF ? 🎧", "Un anime que tu pourrais revoir 100 fois ? 🔁", "Ton crush manga ? 😳",
      "Tu fais du cosplay ? 👘", "Tu achètes les tomes papier ? 📚", "Tu passes tes nuits devant les animés ? 🌙",
      "Tu connais les studios d’animation ? 🏭"
    ]
  },
    
  // Sujet : Salutations, déjà présent
  { words: ["salut", "hello", "hi", "bonjour", "bonsoir"], responses: ["Salut ! 👋", "Hello ! 😊", "Bonjour ! ☀️", "Bonsoir ! 🌙"] },

  // Sujet : École / Études
  { 
    words: ["école", "étude", "devoir", "prof", "note", "classe", "matière", "examen", "bac", "université"], 
    responses: [
      "Tu aimes l'école ? 🎒", "Courage pour les examens ! 📚", "Quelle est ta matière préférée ? ✍️", "Tu révises souvent ? 🧠",
      "Ah les devoirs... 😅", "Tu es plutôt matheux ou littéraire ? 🧮📖", "Bon courage pour le bac ! 🎓", "Les profs sont sympas cette année ? 👨‍🏫",
      "Tu veux faire quoi après les études ? 🤔", "Moi j'aurais adoré aller à l'université ! 🏫", "Ah les contrôles surprises, quelle horreur ! 😱",
      "C’est quoi ta meilleure note ? 📊", "Tu préfères travailler seul ou en groupe ? 👥", "Il y a trop de devoirs ces jours-ci ? 😓",
      "Tu utilises des antisèches ? 😏", "Les révisions avancent bien ? ⏳", "Tu veux que je t’aide à réviser ? 💡", "C’est bientôt les vacances scolaires ? 🏖️",
      "C’est quoi ton rêve comme métier ? 💼", "Les cours en ligne c’est cool ? 💻"
    ]
  },

  // Sujet : Nourriture / Cuisine
  { 
    words: ["manger", "faim", "repas", "plat", "cuisine", "déjeuner", "dîner", "fast-food", "dessert", "boisson"], 
    responses: [
      "Tu as mangé quoi aujourd’hui ? 🍽️", "J’adore les pizzas ! 🍕", "Tu cuisines bien ? 👨‍🍳", "Plutôt sucré ou salé ? 🍬🥨",
      "Ton plat préféré ? 😋", "Je rêve d’un bon dessert ! 🍰", "Tu aimes les fruits ? 🍓🍌", "Un bon burger, ça fait plaisir ! 🍔",
      "Tu bois du café ? ☕", "Faim ou gourmandise ? 😄", "Tu sais faire un gâteau ? 🎂", "Tu préfères cuisiner ou commander ? 📱",
      "Déjeuner à midi pile ou plus tard ? ⏰", "Tu manges épicé ? 🌶️", "J’aime bien les soupes ! 🥣", "Plutôt végétarien ou carnivore ? 🥦🥩",
      "Tu bois assez d’eau ? 💧", "Cuisine maison ou resto ? 🍽️🏠", "Tu grignotes souvent ? 😅", "J’ai toujours faim le soir ! 🌙"
    ]
  },

  // Sujet : Temps / Météo
  { 
    words: ["pluie", "soleil", "neige", "chaud", "froid", "météo", "vent", "orage", "température", "climat"], 
    responses: [
      "Quel temps chez toi ? 🌤️", "Il pleut encore ? ☔", "J’adore la neige ! ❄️", "Trop chaud aujourd’hui 😓", "Il fait froid, non ? 🥶",
      "Un peu de soleil fait du bien 🌞", "Attention à l’orage ! ⚡", "Le climat change trop vite... 🌍", "Vent fort aujourd’hui 🌬️",
      "Tu aimes les saisons ? 🍁🌸🌞❄️", "Tu préfères l’hiver ou l’été ? ☃️🌴", "Un chocolat chaud par ce temps ! ☕", "Sors couvert, il fait froid ! 🧣",
      "J’aime les jours pluvieux 😌", "Le ciel est magnifique ce soir ! 🌇", "J’entends le tonnerre ! ⛈️", "J’espère qu’il fera beau demain 🤞",
      "Pas envie de sortir avec ce temps 😑", "Tu dors bien quand il pleut ? 🌧️", "Le vent me rend fou ! 😵‍💫"
    ]
  },

  // Sujet : Sport
  { 
    words: ["sport", "football", "match", "joueur", "ballon", "courir", "muscu", "basket", "équipe", "coach"], 
    responses: [
      "Tu fais du sport ? 🏃", "Foot ou basket ? ⚽🏀", "Ton joueur préféré ? 🧑‍🎤", "Tu regardes la coupe du monde ? 🌍⚽",
      "J’adore faire du jogging 🏃‍♀️", "Tu vas à la salle de sport ? 💪", "Les matchs hier étaient fous ! 😮", "Tu fais du sport tous les jours ? 📅",
      "Tu suis un régime sportif ? 🍗🥗", "J’aime bien nager aussi 🏊", "Ton équipe préférée ? 🟢⚪", "Tu fais du yoga ? 🧘", 
      "Un bon coach motive ! 👊", "Tu fais des pompes ? 💥", "Le sport c’est la santé ! 🧠", "Tu fais du vélo ? 🚴",
      "Tu connais bien les règles ? 📘", "Tu veux un défi sportif ? 🥇", "Pas de sport sans musique ! 🎧", "Tu préfères regarder ou pratiquer ? 📺"
    ]
  }

  // Tu peux ajouter plus de sujets ici de la même façon
  ];
  
  for (const keywordGroup of keywords) {
    for (const keyword of keywordGroup.words) {
      if (normalizedMessage.includes(keyword)) {
        return keywordGroup.responses[Math.floor(Math.random() * keywordGroup.responses.length)];
      }
    }
  }
  
  // Réponses par défaut si aucune correspondance
  const defaultResponses = [
    "Intéressant ! 🤔",
    "Ah d'accord ! 👍",
    "Je vois ! 😊",
    "Hmm... 🤨",
    "Raconte-moi en plus ! 😄",
    "C'est cool ! 😎",
    "Ah bon ? 😮",
    "Je comprends ! 👌"
  ];
  
  // 30% de chance d'avoir une réponse par défaut
  if (Math.random() < 0.3) {
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }
  
  return null;
}
