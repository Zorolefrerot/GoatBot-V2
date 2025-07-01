const questions = [
  { question: "Quel est le nom du physicien qui a découvert les rayons X ?", answer: "Wilhelm Röntgen" },
  { question: "Quel écrivain a refusé le prix Nobel de littérature en 1964 ?", answer: "Jean-Paul Sartre" },
  { question: "Quel est le plus ancien parlement encore en activité au monde ?", answer: "Althing (Islande)" },
  { question: "Quel pays a le plus grand nombre d'îles au monde ?", answer: "Suède" },
  { question: "Quelle est la capitale du Bhoutan ?", answer: "Thimphou" },
  { question: "Quel empereur romain a légalisé le christianisme ?", answer: "Constantin Ier" },
  { question: "Combien de satellites naturels possède Mars ?", answer: "2" },
  { question: "Dans quelle ville est mort Napoléon Bonaparte ?", answer: "Sainte-Hélène" },
  { question: "Quel est l'élément chimique de numéro atomique 79 ?", answer: "Or" },
  { question: "Quel est le nom du traité qui mit fin à la Première Guerre mondiale ?", answer: "Traité de Versailles" },
  { question: "Quel peintre est l'auteur de 'Guernica' ?", answer: "Pablo Picasso" },
  { question: "En quelle année l’euro a-t-il été introduit comme monnaie fiduciaire ?", answer: "2002" },
  { question: "Quel mathématicien grec a donné son nom à un théorème célèbre ?", answer: "Pythagore" },
  { question: "Quelle est la langue officielle de l’Éthiopie ?", answer: "Amharique" },
  { question: "Combien de temps met la lumière du Soleil pour atteindre la Terre ?", answer: "8 minutes" },
  { question: "Quel philosophe est l'auteur de 'Critique de la raison pure' ?", answer: "Emmanuel Kant" },
  { question: "Dans quel pays trouve-t-on la ville de Samarcande ?", answer: "Ouzbékistan" },
  { question: "Quel est le plus grand désert froid du monde ?", answer: "Antarctique" },
  { question: "Qui a découvert la pénicilline ?", answer: "Alexander Fleming" },
  { question: "Quel est l'acide présent dans l'estomac humain ?", answer: "Acide chlorhydrique" },
  { question: "En quelle année a eu lieu le krach boursier de Wall Street ?", answer: "1929" },
  { question: "Quel est le plus ancien livre imprimé au monde ?", answer: "Le Sūtra du diamant" },
  { question: "Qui a peint 'Le Jardin des délices' ?", answer: "Jérôme Bosch" },
  { question: "Quel écrivain est l’auteur de 'L'Étranger' ?", answer: "Albert Camus" },
  { question: "Quel organe du corps humain produit l'insuline ?", answer: "Pancréas" },
  { question: "Quel est le nom du premier satellite artificiel lancé dans l’espace ?", answer: "Spoutnik" },
  { question: "Qui a théorisé la relativité restreinte ?", answer: "Albert Einstein" },
  { question: "Quel pays a inventé l’imprimerie à caractères mobiles ?", answer: "Chine" }, 
  
  { question: "Quel footballeur a remporté le plus de Ballons d'Or ?", answer: "lionel messi" },
  { question: "Quel pays a remporté la première Coupe du Monde de football en 1930 ?", answer: "uruguay" },
  { question: "Combien de fois Rafael Nadal a-t-il gagné Roland-Garros ?", answer: "14" },
  { question: "Quel est le record du monde du 100m masculin ?", answer: "9.58" },
  { question: "Dans quel sport excelle Simone Biles ?", answer: "gymnastique" },
  { question: "Combien de joueurs sur le terrain pour une équipe de rugby à XV ?", answer: "15" },
  { question: "Quel pays a organisé les Jeux Olympiques de 1964 ?", answer: "japon" },
  { question: "Qui a marqué la 'main de Dieu' ?", answer: "diego maradona" },
  { question: "Quel est le sport le plus pratiqué au monde ?", answer: "football" },
  { question: "Combien de grands chelems existent en tennis ?", answer: "4" },
  { question: "Quel coureur a remporté le plus de Tours de France ?", answer: "eddy merckx" },
  { question: "Quel est le surnom du boxeur Mohamed Ali ?", answer: "the greatest" },
  { question: "Quel est le sport national au Japon ?", answer: "sumo" },
  { question: "Quel pays a gagné la CAN 2012 ?", answer: "zambie" },
  { question: "Quel nageur détient le record de médailles olympiques ?", answer: "michael phelps" },
  { question: "Quel joueur de tennis est surnommé 'le roi de la terre battue' ?", answer: "rafael nadal" },
  { question: "Quel footballeur a joué pour l'ajax, le barça et manchester united ?", answer: "zlatan ibrahimovic" },
  { question: "Combien de minutes dure un match de handball ?", answer: "60" },
  { question: "Quel est le nom du stade du real madrid ?", answer: "santiago bernabeu" },
  { question: "Qui a remporté le Ballon d'Or 2006 ?", answer: "fabio cannavaro" },
  { question: "Dans quel sport utilise-t-on un 'cocktail molotov' comme stratégie ?", answer: "paintball" },
  { question: "Quel joueur a marqué le but de la victoire pour l'espagne en finale de la coupe du monde 2010 ?", answer: "andres iniesta" },
  { question: "Combien de trous dans un parcours de golf standard ?", answer: "18" },
  { question: "Dans quel sport utilise-t-on un sabre ?", answer: "escrime" },
  { question: "Qui est le seul athlète à avoir couru le 200 m en moins de 19.20 s ?", answer: "usain bolt" },
  { question: "Quel pays a remporté le plus de coupes du monde de football ?", answer: "bresil" },
  { question: "Quel club de foot a remporté la ligue des champions en 1999 ?", answer: "manchester united" },
  { question: "Dans quelle ville se trouve le stade de l'olympique lyonnais ?", answer: "decines" },
  { question: "Quel est le record du monde du saut à la perche masculin ?", answer: "6.23" },
  { question: "Combien de fois la france a-t-elle gagné la coupe du monde de foot ?", answer: "2" },
  { question: "Quel joueur détient le record de buts en une seule saison de premier league ?", answer: "erling haaland" },
  { question: "Dans quel sport retrouve-t-on des 'rebonds' et des 'rebonds défensifs' ?", answer: "basketball" },
  { question: "Quel joueur est surnommé 'el fenomeno' ?", answer: "ronaldo" },
  { question: "Combien de sets faut-il gagner pour remporter un match en grand chelem masculin ?", answer: "3" },
  { question: "Quel pays a inventé le hockey sur glace ?", answer: "canada" },
  { question: "Quel joueur argentin est surnommé 'la pulga' ?", answer: "lionel messi" },
  { question: "Quelle est la distance officielle d’un marathon ?", answer: "42.195" },
  { question: "Quel pays a gagné le mondial 2006 ?", answer: "italie" },
  { question: "Qui est le joueur le plus capé de l’histoire de l’équipe de france de football ?", answer: "hugo lloris" },
  { question: "Quelle nation a remporté la coupe du monde de rugby en 2019 ?", answer: "afrique du sud" },
  { question: "Dans quel sport joue-t-on avec une raquette et un volant ?", answer: "badminton" },
  { question: "Quel est le sport d'équipe le plus rapide ?", answer: "hockey sur glace" },
  { question: "Quel joueur a remporté le ballon d’or 2007 ?", answer: "kaka" },
  { question: "Dans quelle ville se trouve le stade anfield ?", answer: "liverpool" },
  { question: "Quel basketteur est surnommé 'king james' ?", answer: "lebron james" },
  { question: "Quel est le poids d’un ballon de football réglementaire ?", answer: "450 grammes" },
  { question: "Combien de joueurs dans une équipe de volley ?", answer: "6" },
  { question: "Quel est le pays hôte des JO 2024 ?", answer: "france" },
  { question: "Quel joueur a remporté le plus de grands chelems en tennis ?", answer: "novak djokovic" },
  { question: "Quel sport est aussi appelé 'le noble art' ?", answer: "boxe" },
  { question: "Qui a gagné l'euro 2004 ?", answer: "grece" },
  { question: "Dans quel sport utilise-t-on un 'grip' et un 'service' ?", answer: "tennis" },
  { question: "Quel footballeur a joué pour liverpool, barcelone et bayern munich ?", answer: "philippe coutinho" },
  { question: "Combien de médailles olympiques a gagné la france en 2020 ?", answer: "33" },
  { question: "Dans quel sport utilise-t-on une planche appelée 'deck' ?", answer: "skateboard" },
  { question: "Quel est le sport de michael jordan ?", answer: "basketball" },
  { question: "Combien de kilomètres dans un 10k ?", answer: "10" },
  { question: "Quel est le nom du championnat anglais de football ?", answer: "premier league" },
  { question: "Combien de temps dure un match de basket nba ?", answer: "48 minutes" },
  { question: "Quel pays est surnommé la selecao ?", answer: "bresil" },
  { question: "Combien de médailles d'or a remporté bolt aux jeux olympiques ?", answer: "8" },
  { question: "Dans quel pays est né kylian mbappe ?", answer: "france" },
  { question: "Quel sport est pratiqué lors du superbowl ?", answer: "football americain" },
  { question: "Quel est le plus grand stade d’europe en capacité ?", answer: "camp nou" },
  { question: "Combien de quarts-temps dans un match de basket ?", answer: "4" },
  { question: "Quel est le surnom de l’équipe nationale d’allemagne ?", answer: "mannschaft" },
  { question: "Quel pays est le plus titré en coupe d’afrique des nations ?", answer: "egypte" },
  { question: "Combien de médailles a remporté phelps en tout ?", answer: "28" },
  { question: "Quel pays a organisé les jeux olympiques d’hiver 2022 ?", answer: "chine" },
  { question: "Quel joueur est célèbre pour sa 'main de dieu' ?", answer: "diego maradona" },
  { question: "Quelle nation est surnommée 'les lions indomptables' ?", answer: "cameroun" },
  { question: "Dans quel sport est-ce que tony parker a brillé ?", answer: "basketball" },
  { question: "Qui est le gardien mythique de l'italie championne du monde 2006 ?", answer: "gianluigi buffon" },
  { question: "Quel pays a remporté la coupe du monde de cricket en 2019 ?", answer: "angleterre" },
  { question: "Dans quel sport pratique-t-on le 'kata' ?", answer: "karate" },
  { question: "Qui a marqué un triplé en finale de coupe du monde 2022 ?", answer: "kylian mbappe" },
  { question: "Quelle est la couleur du maillot du meilleur grimpeur au tour de france ?", answer: "a pois" },
  { question: "Qui a remporté roland garros en 2023 ?", answer: "novak djokovic" },
  { question: "Dans quel sport le 'triple saut' est-il une épreuve ?", answer: "athletisme" },
  { question: "Quel est le pays d’origine du judo ?", answer: "japon" },
  { question: "Quel footballeur est surnommé 'la panthère' ?", answer: "samuel eto’o" },
  { question: "Quel est le sport le plus regardé au monde ?", answer: "football" },
  { question: "Quelle est la durée maximale d’un match de boxe professionnelle ?", answer: "36 minutes" },
  { question: "Quel est le club surnommé 'les reds' ?", answer: "liverpool" },
  { question: "Combien de fois roger federer a-t-il gagné wimbledon ?", answer: "8" },
  { question: "Quel est le sport du ballon ovale ?", answer: "rugby" },
  { question: "Dans quel sport trouve-t-on le terme 'birdie' ?", answer: "golf" },
  { question: "Qui est le capitaine du senegal en 2022 ?", answer: "kalidou koulibaly" },
  { question: "Dans quel sport est utilisé un arc ?", answer: "tir a l’arc" },
  { question: "Combien de médailles a gagné la france aux jeux paralympiques de tokyo 2020 ?", answer: "54" },
  { question: "Qui est le seul joueur à avoir remporté la coupe du monde comme joueur et entraîneur ?", answer: "mario zagallo" },
  { question: "Quel est le sport le plus populaire aux etats-unis ?", answer: "football americain" },
  
  { question: "🌎 Quel pays possède le drapeau 🇦🇷 ?", answer: "argentine" },
  { question: "🌍 La capitale du 🇳🇬 Nigéria est ?", answer: "abuja" },
  { question: "🌏 À quel pays appartient le drapeau 🇵🇭 ?", answer: "philippines" },
  { question: "🌍 Quelle est la capitale du 🇨🇩 Congo-Kinshasa ?", answer: "kinshasa" },
  { question: "🌎 Quel pays a pour capitale 'nassau' ?", answer: "bahamas" },
  { question: "🌏 Le drapeau 🇳🇵 représente quel pays ?", answer: "népal" },
  { question: "🌍 Quelle capitale se trouve en 🇨🇴 Colombie ?", answer: "bogota" },
  { question: "🌎 Le drapeau 🇧🇹 est celui de quel pays ?", answer: "bhoutan" },
  { question: "🌍 Le pays avec le drapeau 🇲🇳 ?", answer: "mongolie" },
  { question: "🌏 Quelle est la capitale de 🇱🇧 Liban ?", answer: "beyrouth" },
  { question: "🌎 Le drapeau 🇲🇷 appartient à ?", answer: "mauritanie" },
  { question: "🌍 Quelle capitale correspond au drapeau 🇧🇴 ?", answer: "la paz" },
  { question: "🌎 À quel pays appartient le drapeau 🇨🇺 ?", answer: "cuba" },
  { question: "🌍 La capitale de 🇸🇿 Eswatini est ?", answer: "mbabane" },
  { question: "🌏 Le drapeau 🇮🇶 représente quel pays ?", answer: "irak" },
  { question: "🌎 Quelle est la capitale du 🇻🇪 Venezuela ?", answer: "caracas" },
  { question: "🌍 Le drapeau 🇸🇮 correspond à quel pays ?", answer: "slovénie" },
  { question: "🌏 Quelle est la capitale de 🇦🇿 Azerbaïdjan ?", answer: "bakou" },
  { question: "🌎 À quel pays appartient le drapeau 🇬🇶 ?", answer: "guinée équatoriale" },
  { question: "🌍 Quel est le pays avec pour capitale 'dili' ?", answer: "timor oriental" },
  { question: "🌎 Quelle est la capitale du 🇲🇴 Macao ?", answer: "macao" },
  { question: "🌍 Quel drapeau est 🇰🇿 ?", answer: "kazakhstan" },
  { question: "🌏 Quelle capitale pour 🇸🇬 Singapour ?", answer: "singapour" },
  { question: "🌎 Quelle capitale a 🇪🇸 Espagne ?", answer: "madrid" },
  { question: "🌍 Quel pays a le drapeau 🇱🇮 ?", answer: "liechtenstein" },
  { question: "🌎 Le drapeau 🇹🇱 correspond à ?", answer: "timor oriental" },
  { question: "🌍 Quelle capitale pour 🇨🇿 République Tchèque ?", answer: "prague" },
  { question: "🌏 Quel pays a pour capitale 'sana'a' ?", answer: "yémen" },
  { question: "🌍 Le drapeau 🇱🇺 est celui de ?", answer: "luxembourg" },
  { question: "🌎 Quelle capitale pour 🇰🇪 Kenya ?", answer: "nairobi" },
  { question: "🌏 Drapeau 🇦🇲 correspond à quel pays ?", answer: "arménie" },
  { question: "🌍 Quelle est la capitale du 🇵🇾 Paraguay ?", answer: "asuncion" },
  { question: "🌎 Le drapeau 🇲🇱 représente ?", answer: "mali" },
  { question: "🌏 La capitale de 🇷🇸 Serbie est ?", answer: "belgrade" },
  { question: "🌍 Le drapeau 🇸🇳 représente ?", answer: "sénégal" },
  { question: "🌎 Quelle capitale pour 🇮🇩 Indonésie ?", answer: "jakarta" },
  { question: "🌍 Quel pays a le drapeau 🇹🇳 ?", answer: "tunisie" },
  { question: "🌏 Quelle capitale pour 🇳🇿 Nouvelle-Zélande ?", answer: "wellington" },
  { question: "🌍 Le drapeau 🇲🇪 appartient à ?", answer: "monténégro" },
  { question: "🌎 La capitale de 🇮🇱 Israël est ?", answer: "jérusalem" },
  { question: "🌍 Le drapeau 🇹🇿 est à ?", answer: "tanzanie" },
  { question: "🌏 Le pays avec le drapeau 🇦🇴 ?", answer: "angola" },
  { question: "🌎 Quelle est la capitale de 🇸🇰 Slovaquie ?", answer: "bratislava" },
  { question: "🌍 À quel pays correspond le drapeau 🇸🇷 ?", answer: "suriname" },
  { question: "🌎 Quelle est la capitale de 🇱🇸 Lesotho ?", answer: "maseru" },
  { question: "🌍 Le drapeau 🇱🇷 est celui de ?", answer: "libéria" },
  { question: "🌏 Quelle est la capitale de 🇨🇬 Congo-Brazzaville ?", answer: "brazzaville" },
  { question: "🌎 Quelle capitale pour 🇵🇰 Pakistan ?", answer: "islamabad" },
  { question: "🌍 Quel pays a pour capitale 'manama' ?", answer: "bahreïn" },
  { question: "🌏 Drapeau 🇺🇿 représente ?", answer: "ouzbekistan" },
  { question: "🌍 Quelle est la capitale de 🇨🇱 Chili ?", answer: "santiago" },
  { question: "🌎 Le drapeau 🇸🇴 est celui de ?", answer: "somalie" },
  { question: "🌏 Le drapeau 🇲🇲 est à quel pays ?", answer: "myanmar" },
  { question: "🌍 Quelle capitale pour 🇬🇲 Gambie ?", answer: "banjul" },
  { question: "🌎 Le drapeau 🇻🇺 appartient à ?", answer: "vanuatu" },
  { question: "🌍 Quelle capitale pour 🇬🇦 Gabon ?", answer: "libreville" },
  { question: "🌏 Le pays avec la capitale 'astana' ?", answer: "kazakhstan" },
  { question: "🌎 Quelle capitale pour 🇹🇭 Thaïlande ?", answer: "bangkok" },
  { question: "🌍 Quel pays a le drapeau 🇲🇬 ?", answer: "madagascar" },
  { question: "🌏 Quelle est la capitale de 🇮🇷 Iran ?", answer: "téhéran" },
  { question: "🌍 Le drapeau 🇧🇭 représente ?", answer: "bahreïn" },
  { question: "🌎 Quelle capitale pour 🇱🇦 Laos ?", answer: "vientiane" },
  { question: "🌏 À quel pays appartient le drapeau 🇲🇰 ?", answer: "macédoine" },
  { question: "🌍 Quelle est la capitale de 🇲🇻 Maldives ?", answer: "male" },
  { question: "🌎 Quel pays a le drapeau 🇷🇼 ?", answer: "rwanda" },
  { question: "🌏 Quelle capitale a 🇧🇩 Bangladesh ?", answer: "dhaka" },
  { question: "🌍 Le drapeau 🇺🇾 appartient à ?", answer: "uruguay" },
  { question: "🌎 Quelle capitale pour 🇹🇩 Tchad ?", answer: "ndjamena" },
  { question: "🌍 Quel drapeau est 🇸🇿 ?", answer: "eswatini" },
  { question: "🌏 Le pays avec pour capitale 'tashkent' ?", answer: "ouzbekistan" },
  { question: "🌎 Quelle capitale pour 🇲🇺 Maurice ?", answer: "port louis" },
  { question: "🌍 Le drapeau 🇫🇯 est celui de ?", answer: "fidji" },
  { question: "🌏 Quelle capitale pour 🇵🇪 Pérou ?", answer: "lima" },
  { question: "🌍 Le drapeau 🇲🇿 représente ?", answer: "mozambique" },
  { question: "🌎 Quelle est la capitale de 🇸🇩 Soudan ?", answer: "khartoum" },
  { question: "🌏 Drapeau 🇷🇪 est de ?", answer: "réunion" },
  { question: "🌍 Quelle capitale pour 🇬🇳 Guinée ?", answer: "conakry" },
  { question: "🌎 À quel pays appartient le drapeau 🇸🇽 ?", answer: "saint-martin" },
  { question: "🌏 Quelle capitale pour 🇰🇵 Corée du Nord ?", answer: "pyongyang" },
  { question: "🌍 Le drapeau 🇧🇾 appartient à ?", answer: "biélorussie" },
  { question: "🌎 Quelle capitale pour 🇸🇪 Suède ?", answer: "stockholm" },
  { question: "🌍 Quelle capitale pour 🇸🇬 Singapour ?", answer: "singapour" },
  { question: "🌏 Quel pays a la capitale 'georgetown' ?", answer: "guyana" },
  { question: "🌎 Drapeau 🇧🇯 représente ?", answer: "bénin" },
  { question: "🌍 Quelle est la capitale de 🇹🇬 Togo ?", answer: "lomé" },
  { question: "🌎 Quel est le pays du drapeau 🇦🇷 ?", answer: "argentine" },
  { question: "🌍 À quel pays correspond le drapeau 🇬🇹 ?", answer: "guatemala" },
  { question: "🌏 Quelle capitale pour 🇧🇿 Belize ?", answer: "belmopan" },
  { question: "🌍 Quel drapeau est 🇭🇹 ?", answer: "haïti" },
  { question: "🌎 Quelle capitale pour 🇧🇮 Burundi ?", answer: "bujumbura" },
  { question: "🌍 Quelle capitale pour 🇿🇼 Zimbabwe ?", answer: "harare" },
  { question: "🌏 À quel pays correspond le drapeau 🇿🇲 ?", answer: "zambie" },
  { question: "🌍 Quel pays a pour capitale 'doha' ?", answer: "qatar" },


];

const activeSessions = {};

module.exports = {
  config: {
    name: "cg",
    role: "0",
    author: "Merdi Madimba or Bryan Bulakali",
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
    const selected = [...questions].sort(() => 0.5 - Math.random()).slice(0, 50);
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
