/cmd install quizz.js const questions = [
  { question: "Quelle est la capitale de la France ?", answer: "paris" },
  { question: "Combien y a-t-il de continents sur Terre ?", answer: "7" },
  { question: "Qui a peint La Joconde ?", answer: "léonard de vinci" },
  { question: "Quelle est la plus grande planète du système solaire ?", answer: "jupiter" },
  { question: "Quelle est la monnaie du Japon ?", answer: "yen" },
  { question: "Combien de côtés a un hexagone ?", answer: "6" },
  { question: "En quelle année a eu lieu la Révolution française ?", answer: "1789" },
  { question: "Quel métal est utilisé pour fabriquer l’or ?", answer: "or" },
  { question: "Quel est l'organe principal du système circulatoire ?", answer: "coeur" },
  { question: "Combien font 7 x 8 ?", answer: "56" },
  { question: "Quel pays a gagné la Coupe du Monde 2018 ?", answer: "france" },
  { question: "Quelle est la capitale de l’Allemagne ?", answer: "berlin" },
  { question: "Combien de lettres dans l’alphabet français ?", answer: "26" },
  { question: "Quel est l'élément chimique H2O ?", answer: "eau" },
  { question: "Qui est le dieu du tonnerre dans la mythologie nordique ?", answer: "thor" },
  { question: "Quel animal est le roi de la savane ?", answer: "lion" },
  { question: "Combien de joueurs dans une équipe de football ?", answer: "11" },
  { question: "Quel est le plus grand océan du monde ?", answer: "pacifique" },
  { question: "Combien y a-t-il de jours dans une année bissextile ?", answer: "366" },
  { question: "Quelle est la langue la plus parlée au monde ?", answer: "mandarin" },
  { question: "Quel est le plus haut sommet du monde ?", answer: "everest" },
  { question: "Qui a écrit Roméo et Juliette ?", answer: "shakespeare" },
  { question: "Combien de couleurs dans l’arc-en-ciel ?", answer: "7" },
  { question: "Quel est le symbole chimique de l’oxygène ?", answer: "o" },
  { question: "Quelle planète est la plus proche du soleil ?", answer: "mercure" },
  { question: "Quelle est la capitale de la RDC ?", answer: "kinshasa" },
  { question: "Combien de zéros dans un milliard ?", answer: "9" },
  { question: "Quel pays a pour capitale Abuja ?", answer: "nigeria" },
  { question: "Quel est l’inventeur de la théorie de la relativité ?", answer: "einstein" },
  { question: "Quel est l’animal le plus rapide du monde ?", answer: "guépard" },
{ question: "Quel est le plus long fleuve du monde ?", answer: "nil" },
{ question: "Quelle est la capitale de l’Espagne ?", answer: "madrid" },
{ question: "Quel est le symbole chimique du fer ?", answer: "fe" },
{ question: "Combien d’heures dans une journée ?", answer: "24" },
{ question: "Quel est le pays d’origine du sushi ?", answer: "japon" },
{ question: "Quel est l’auteur de Harry Potter ?", answer: "jk rowling" },
{ question: "Dans quelle ville se trouve la Tour Eiffel ?", answer: "paris" },
{ question: "Quelle mer borde l’Égypte ?", answer: "mer rouge" },
{ question: "Quel est le sport national du Brésil ?", answer: "football" },
{ question: "Combien de joueurs au basketball ?", answer: "5" },
{ question: "Quel est l’instrument à cordes typique d’un orchestre ?", answer: "violon" },
{ question: "Combien de pattes une araignée possède-t-elle ?", answer: "8" },
{ question: "Dans quelle galaxie vivons-nous ?", answer: "voie lactée" },
{ question: "Quel est l’animal emblème de l’Australie ?", answer: "kangourou" },
{ question: "Combien de lunes possède la Terre ?", answer: "1" },
{ question: "Quelle est la capitale de l’Italie ?", answer: "rome" },
{ question: "Quel est le nom du président actuel de la RDC (2024) ?", answer: "félix tshisekedi" },
{ question: "Quel est le continent le plus peuplé ?", answer: "asie" },
{ question: "Comment s'appelle le gaz qu'on respire ?", answer: "oxygène" },
{ question: "Combien de mois dans une année ?", answer: "12" },
{ question: "Quel est le plus petit pays du monde ?", answer: "vatican" },
{ question: "Quelle langue parle-t-on au Brésil ?", answer: "portugais" },
{ question: "Combien de dents a un adulte normalement ?", answer: "32" },
{ question: "Combien de secondes dans une minute ?", answer: "60" },
{ question: "Qui a inventé l’ampoule électrique ?", answer: "edison" },
{ question: "Quelle est la première lettre de l’alphabet grec ?", answer: "alpha" },
{ question: "Quel pays a pour capitale Rabat ?", answer: "maroc" },
{ question: "Quel animal pond des œufs et allaite ?", answer: "ornithorynque" },
{ question: "Combien y a-t-il de couleurs primaires ?", answer: "3" },
{ question: "Quel est le métal précieux de couleur jaune ?", answer: "or" },
{ question: "Quel est le cri du chien ?", answer: "aboiement" },
{ question: "Quelle est la capitale du Canada ?", answer: "ottawa" },
{ question: "Dans quel pays se trouve le mont Kilimandjaro ?", answer: "tanzanie" },
{ question: "Quel est l'élément chimique du sel de table ?", answer: "sodium" },
{ question: "Quel est le plus grand désert du monde ?", answer: "antarctique" },
{ question: "Quel est le nom du satellite naturel de la Terre ?", answer: "lune" },
{ question: "Qui a écrit L’Iliade et l’Odyssée ?", answer: "homère" },
{ question: "Quelle est la capitale du Kenya ?", answer: "nairobi" },
{ question: "Quel fruit est jaune et courbé ?", answer: "banane" },
{ question: "Combien de doigts a un humain ?", answer: "10" },
{ question: "Qui est l’inventeur de Facebook ?", answer: "mark zuckerberg" },
{ question: "Quel est le plus grand pays du monde ?", answer: "russie" },
{ question: "Combien de jours en février pendant une année bissextile ?", answer: "29" },
{ question: "Quel est l’autre nom du Sahara ?", answer: "désert du sahara" },
{ question: "Quelle est la devise de la République Française ?", answer: "liberté égalité fraternité" },
{ question: "Quelle est la capitale de la Chine ?", answer: "pékin" },
{ question: "Quel animal a une mémoire légendaire ?", answer: "éléphant" },
{ question: "Quel est l’animal emblème de la Chine ?", answer: "panda" },
{ question: "Quel est le sport où on utilise une raquette et un volant ?", answer: "badminton" },
{ question: "Qui est mon créateur  ?", answer: "merdi" },
{ question: "Qui est l'auteur du manga bleach' ?", answer: "tite kubo" },
  // 🏀 SPORT (20)
  { question: "Quel footballeur a remporté le plus de Ballon d'Or ?", answer: "messi" },
  { question: "Quel pays a remporté la Coupe du Monde 2018 ?", answer: "france" },
  { question: "Qui est surnommé le 'Roi du football' ?", answer: "pelé" },
  { question: "Combien de joueurs composent une équipe de football sur le terrain ?", answer: "11" },
  { question: "Quel est le sport principal des Jeux Olympiques d'hiver ?", answer: "ski" },
  { question: "Combien de points vaut un tir à trois points au basketball ?", answer: "3" },
  { question: "Quelle est la surface de jeu au tennis ?", answer: "court" },
  { question: "Qui a remporté Roland-Garros 2022 chez les hommes ?", answer: "nadal" },
  { question: "Quel est le pays d’origine du judo ?", answer: "japon" },
  { question: "Qui est le recordman mondial du 100 mètres ?", answer: "bolt" },
  { question: "Combien de temps dure un match de football ?", answer: "90" },
  { question: "Quel est le pays d’origine du rugby ?", answer: "angleterre" },
  { question: "Qui a remporté le plus de Grands Prix de F1 ?", answer: "hamilton" },
  { question: "Quel sport est pratiqué dans un ring ?", answer: "boxe" },
  { question: "Dans quel sport utilise-t-on une crosse ?", answer: "hockey" },
  { question: "Combien de sets faut-il gagner pour remporter un match en Grand Chelem chez les hommes ?", answer: "3" },
  { question: "Quelle nation est la plus titrée en handball masculin ?", answer: "france" },
  { question: "Dans quel sport y a-t-il des touchdowns ?", answer: "football américain" },
  { question: "Combien de joueurs sur un terrain de volley ?", answer: "6" },
  { question: "Quelle est la nationalité de Kylian Mbappé ?", answer: "français" },

  // 📜 HISTOIRE (20)
  { question: "En quelle année a eu lieu la Révolution française ?", answer: "1789" },
  { question: "Qui fut le premier président des États-Unis ?", answer: "washington" },
  { question: "Quel mur est tombé en 1989 ?", answer: "berlin" },
  { question: "Qui a dirigé l’Allemagne pendant la Seconde Guerre mondiale ?", answer: "hitler" },
  { question: "Quel explorateur a découvert l’Amérique ?", answer: "colomb" },
  { question: "Comment s'appelait l'empereur de France en 1804 ?", answer: "napoléon" },
  { question: "Quel pays a lancé la bombe atomique sur Hiroshima ?", answer: "usa" },
  { question: "Qui a été assassiné à Dallas en 1963 ?", answer: "kennedy" },
  { question: "Quel roi a été guillotiné pendant la Révolution française ?", answer: "louis" },
  { question: "Quel empire était dirigé par César ?", answer: "rome" },
  { question: "Comment s'appelait le régime politique de Staline ?", answer: "communisme" },
  { question: "Qui a libéré la France en 1944 ?", answer: "de gaulle" },
  { question: "Quel pays a colonisé le Congo ?", answer: "belgique" },
  { question: "Où est né Nelson Mandela ?", answer: "afrique du sud" },
  { question: "Qui a inventé l’imprimerie ?", answer: "gutenberg" },
  { question: "En quelle année s’est terminé la Seconde Guerre mondiale ?", answer: "1945" },
  { question: "Qui a découvert la pénicilline ?", answer: "fleming" },
  { question: "Quelle guerre a opposé le Nord et le Sud des USA ?", answer: "sécession" },
  { question: "Quel traité a mis fin à la Première Guerre mondiale ?", answer: "versailles" },
  { question: "Quel pays a envahi la Pologne en 1939 ?", answer: "allemagne" },

  // ⚡ MYTHOLOGIE (20)
  { question: "Quel dieu grec est le roi de l’Olympe ?", answer: "zeus" },
  { question: "Qui est le dieu de la mer dans la mythologie grecque ?", answer: "poséidon" },
  { question: "Quel héros a tué le Minotaure ?", answer: "thésée" },
  { question: "Comment s’appelle le dieu nordique du tonnerre ?", answer: "thor" },
  { question: "Qui est le messager des dieux grecs ?", answer: "hermès" },
  { question: "Quel dieu égyptien a une tête de chacal ?", answer: "anubis" },
  { question: "Qui est la déesse de l’amour dans la mythologie romaine ?", answer: "vénus" },
  { question: "Quel titan a volé le feu aux dieux ?", answer: "prométhée" },
  { question: "Quel monstre a des serpents pour cheveux ?", answer: "méduse" },
  { question: "Qui est le dieu de la guerre chez les Grecs ?", answer: "arès" },
  { question: "Quel est le royaume des morts chez les Grecs ?", answer: "hadès" },
  { question: "Quel héros a affronté l’Hydre de Lerne ?", answer: "hercule" },
  { question: "Quel cheval ailé vient de la mythologie grecque ?", answer: "pégase" },
  { question: "Comment s'appelle l’arbre sacré des Vikings ?", answer: "ygdrassil" },
  { question: "Qui a ouvert la boîte contenant tous les maux ?", answer: "pandore" },
  { question: "Quel dieu égyptien est associé au soleil ?", answer: "rê" },
  { question: "Quel est le nom latin de Zeus ?", answer: "jupiter" },
  { question: "Quel est le dieu de la forge chez les Grecs ?", answer: "héphaïstos" },
  { question: "Quel dieu romain correspond à Hadès ?", answer: "pluton" },
  { question: "Quelle déesse romaine est l’équivalent d’Athéna ?", answer: "minerve" },

  // ⚗️ CHIMIE (20)
  { question: "Quel est le symbole chimique de l’eau ?", answer: "h2o" },
  { question: "Quel gaz les plantes absorbent-elles ?", answer: "co2" },
  { question: "Quel est le numéro atomique de l’oxygène ?", answer: "8" },
  { question: "Quel est le métal liquide à température ambiante ?", answer: "mercure" },
  { question: "Quel gaz est essentiel à la respiration humaine ?", answer: "oxygène" },
  { question: "Quel est l’élément chimique avec le symbole Fe ?", answer: "fer" },
  { question: "Quelle est la formule du sel de table ?", answer: "nacl" },
  { question: "Quel est l’élément le plus léger ?", answer: "hydrogène" },
  { question: "Quel est l’élément chimique avec le symbole Au ?", answer: "or" },
  { question: "Quel acide est contenu dans l’estomac ?", answer: "chlorhydrique" },
  { question: "Quel est le pH d’une solution neutre ?", answer: "7" },
  { question: "Quel est le gaz le plus abondant dans l’air ?", answer: "azote" },
  { question: "Quel est l’unité de masse atomique ?", answer: "uma" },
  { question: "Quelle est la formule chimique du dioxyde de carbone ?", answer: "co2" },
  { question: "Quel métal est utilisé dans les piles ?", answer: "lithium" },
  { question: "Quel est l’état de l’eau à 0 degré ?", answer: "glace" },
  { question: "Quel est le nom du tableau des éléments ?", answer: "périodique" },
  { question: "Quel est le nom du gaz qui fait rougir une flamme ?", answer: "oxygène" },
  { question: "Quel est le nom du processus de rouille ?", answer: "oxydation" },
  { question: "Comment s’appelle le changement de solide à gaz ?", answer: "sublimation" },

  // 🐾 ZOOLOGIE (20)
  { question: "Quel est l’animal terrestre le plus rapide ?", answer: "guépard" },
  { question: "Quel mammifère est capable de voler ?", answer: "chauve-souris" },
  { question: "Quel animal a une mémoire exceptionnelle ?", answer: "éléphant" },
  { question: "Quel est le plus grand mammifère marin ?", answer: "baleine" },
  { question: "Quel est le seul oiseau qui ne vole pas mais court vite ?", answer: "autruche" },
  { question: "Quel insecte produit du miel ?", answer: "abeille" },
  { question: "Quel est le félin le plus grand ?", answer: "tigre" },
  { question: "Quel animal change de couleur pour se camoufler ?", answer: "caméléon" },
  { question: "Quel animal est connu pour sa lenteur ?", answer: "paresseux" },
  { question: "Quel est le roi de la savane ?", answer: "lion" },
  { question: "Quel est le plus grand reptile du monde ?", answer: "crocodile" },
  { question: "Quel animal a une bosse sur le dos ?", answer: "chameau" },
  { question: "Quel animal pond des œufs et allaite ses petits ?", answer: "ornithorynque" },
  { question: "Quel animal a des tentacules et un bec ?", answer: "pieuvre" },
  { question: "Quel oiseau est symbole de la paix ?", answer: "colombe" },
  { question: "Quel poisson est connu pour sa mémoire courte ?", answer: "poisson rouge" },
  { question: "Quel insecte vit en colonie avec une reine ?", answer: "fourmi" },
  { question: "Quel animal vit à la fois dans l’eau et sur terre ?", answer: "grenouille" },
  { question: "Quel est le plus grand oiseau du monde ?", answer: "autruche" },
  { question: "Quel animal vit en Antarctique et aime la glace ?", answer: "manchot" },
   { question: "Quelle était la première civilisation connue de l'histoire  ?", answer: "sumérienne" },
    { question: "Quelle est la date de la signature de l'armistice ' ?", answer: "11 novembre 1918" },
     { question: "Qui était le pharaon Egyptien qui a établi le culte d'un dieu unique Aton ' ?", answer: "Akhenaton" },
      { question: "Qui a formulé la théorie des trois vies: la politique, la vie contemplative et la vie plaisante  ?", answer: "aristote" },
       { question: "Qui a introduit le concept de l'aliénation dans sa théorie sociale ' ?", answer: "karl marx" },
        { question: "Quel philosophe a posé la question «Que sais-je ?» comme point de départ de sa réflexion  ?", answer: "socrate" },
  
          { question: "Quelle balisage est utilisé pour définir un paragraphe de texte en HTML ?", answer: "p" },
           { question: "Quelle balise est utilisée pour créé une liste à puces en HTML  ?", answer: "ul" },
            { question: "Quel roi a essayé de ruer Jésus quand il était bébé ?", answer: "hérode" },
             { question: "Qui a marché sur l'eau avec Jésus ?", answer: "pierre" },
              { question: "Qui était appelé «L'homme de douleurs » dans la prophétie d'esaïe ?", answer: "jésus" },
               { question: "Quelle est la Partie matériel ou physique de l'ordinateur  ?", answer: "hardware" },
                { question: "comment est appelé l'adresse numérique unique identifiant un appareil sur un réseau  ?", answer: "ip" },
                 { question: "Que signifie le symbole √ ?", answer: "racine carrée" },
                  { question: "combien des faces a un cube  ?", answer: "6" },
                    { question: "Quel est ce pays 🇺🇬 ?", answer: "ouganda" },
                      { question: "Quel est ce pays 🇦🇴 ?", answer: "angola" },
                        { question: "Quel est ce pays 🇨🇳?", answer: "chine" },
                          { question: "Quel est ce pays 🇪🇬 ?", answer: "egypte" },
                            { question: "Quel est ce pays 🇬🇷 ?", answer: "grèce" },
                              { question: "Quel est ce pays 🇲🇬 ?", answer: "madagascar" }

];

const activeSessions = {};

module.exports = {
  config: {
    name: "quizz",
    role: "0",
    author: "Merdi Madimba",
    version: "1.0",
    description: "Quiz culture générale avec score",
    category: "🎮 Jeu"
  },

  onStart: async function ({ event, message, usersData }) {
    const threadID = event.threadID;

    if (activeSessions[threadID]) {
      return message.reply("❗ Un quiz est déjà en cours !");
    }

    // Sélectionner 10 questions aléatoires
    const selected = [...questions].sort(() => 0.5 - Math.random()).slice(0, 100);
    const scores = {};

    let currentIndex = 0;
    let currentQuestion = null;
    let timeoutID = null;
    let answered = false;

    const sendQuestion = async () => {
      if (currentIndex >= selected.length) {
        // Fin du quiz
        const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        let finalBoard = "🏁 Fin du quiz ! Résultat final :\n";
        let winner = sorted[0]?.[0] || "Aucun";

        for (let [name, pts] of sorted) {
          finalBoard += `🏅 ${name} : ${pts} pts\n`;
        }

        finalBoard += `👑 Vainqueur : ${winner}`;
        await message.send(finalBoard);
        delete activeSessions[threadID];
        return;
      }

      answered = false;
      currentQuestion = selected[currentIndex];

      await message.send(`❓ Question ${currentIndex + 1} : ${currentQuestion.question}`);

      timeoutID = setTimeout(async () => {
        if (!answered) {
          await message.send(`⏰ Temps écoulé ! La bonne réponse était : ${currentQuestion.answer}`);
          currentIndex++;
          sendQuestion();
        }
      }, 10000);
    };

    activeSessions[threadID] = async ({ event, message }) => {
      if (!currentQuestion || answered) return;

      const senderName = await usersData.getName(event.senderID);
      const msg = event.body?.toLowerCase().trim();

      if (msg === currentQuestion.answer) {
        answered = true;
        clearTimeout(timeoutID);

        scores[senderName] = (scores[senderName] || 0) + 10;

        // Scoreboard
        let board = "📊 Score actuel :\n";
        for (let [name, pts] of Object.entries(scores)) {
          board += `🏅 ${name} : ${pts} pts\n`;
        }

        await message.reply(`✅ Bonne réponse de ${senderName} !\n\n${board}`);
        currentIndex++;
        setTimeout(sendQuestion, 1000);
      }
    };

    sendQuestion();
  },

  onChat: function (context) {
    const handler = activeSessions[context.event.threadID];
    if (handler) handler(context);
  }
};
