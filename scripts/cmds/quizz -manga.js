const questions = [
  { question: "qui est le professeur de yuji itadori ?\n🎌Jujutsu Kaisen🎌", answer: "satoru gojo" },
  { question: "quel est le nom du démon qui partage le corps de yuji ?\n🎌Jujutsu Kaisen🎌", answer: "ryomen sukuna" },
  { question: "quel est le lycée où sont formés les exorcistes ?\n🎌Jujutsu Kaisen🎌", answer: "lycée tokyo d'exorcisme" },
  { question: "quel est le nom de la technique héréditaire du clan gojo ?\n🎌Jujutsu Kaisen🎌", answer: "six yeux" },
  { question: "quelle est la technique spéciale de toge inumaki ?\n🎌Jujutsu Kaisen🎌", answer: "paroles maudites" },
  { question: "quel est le nom complet de megumi ?\n🎌Jujutsu Kaisen🎌", answer: "megumi fushiguro" },
  { question: "qui est le directeur du lycée d’exorcisme de tokyo ?\n🎌Jujutsu Kaisen🎌", answer: "masamichi yaga" },
  { question: "quel objet contient les doigts de sukuna ?\n🎌Jujutsu Kaisen🎌", answer: "talismans maudits" },
  { question: "qui est la seule fille de l’équipe principale ?\n🎌Jujutsu Kaisen🎌", answer: "nobara kugisaki" },
  { question: "quelle est la malédiction qui manipule les poupées ?\n🎌Jujutsu Kaisen🎌", answer: "mechamaru" },
  { question: "quel est le grade de yuji lorsqu’il débute ?\n🎌Jujutsu Kaisen🎌", answer: "grade 4" },
  { question: "comment s'appelle le panda dans le lycée ?\n🎌Jujutsu Kaisen🎌", answer: "panda" },
  { question: "quelle technique permet de créer une barrière infinie ?\n🎌Jujutsu Kaisen🎌", answer: "infini" },
  { question: "quel est le nom du frère maudit de choso ?\n🎌Jujutsu Kaisen🎌", answer: "kechizu" },
  { question: "quel est le nom du personnage qui contrôle le sang ?\n🎌Jujutsu Kaisen🎌", answer: "choso" },
  { question: "quelle technique utilise nanami ?\n🎌Jujutsu Kaisen🎌", answer: "ratio" },
  { question: "quel est le vrai nom de geto ?\n🎌Jujutsu Kaisen🎌", answer: "suguru geto" },
  { question: "qui est l’ennemi principal dans le film jujutsu kaisen 0 ?\n🎌Jujutsu Kaisen🎌", answer: "suguru geto" },
  { question: "quel est le nom du personnage possédé par sukuna ?\n🎌Jujutsu Kaisen🎌", answer: "yuji itadori" },
  { question: "quelle est la technique de combat de nobara ?\n🎌Jujutsu Kaisen🎌", answer: "marteau et clous" },
  { question: "qui utilise le style de projection ?\n🎌Jujutsu Kaisen🎌", answer: "naoya zenin" },
  { question: "qui est la sorcière de kyoto utilisant une hache ?\n🎌Jujutsu Kaisen🎌", answer: "mai zenin" },
  { question: "quelle est la forme ultime de sukuna ?\n🎌Jujutsu Kaisen🎌", answer: "forme à 4 bras" },
  { question: "qui est le rival principal de gojo à l’école ?\n🎌Jujutsu Kaisen🎌", answer: "geto" },
  { question: "quel personnage veut venger la mort de ses frères maudits ?\n🎌Jujutsu Kaisen🎌", answer: "choso" },
  { question: "quelle est la forme de technique la plus puissante ?\n🎌Jujutsu Kaisen🎌", answer: "extension de domaine" },
  { question: "comment s’appelle le domaine de gojo ?\n🎌Jujutsu Kaisen🎌", answer: "infini illimité" },
  { question: "qui est le plus puissant exorciste vivant ?\n🎌Jujutsu Kaisen🎌", answer: "satoru gojo" },
  { question: "quelle est la malédiction représentant la peur de la mer ?\n🎌Jujutsu Kaisen🎌", answer: "dagon" },
  { question: "quelle est l’identité de l’antagoniste aux points de suture ?\n🎌Jujutsu Kaisen🎌", answer: "mahito" },
  { question: "qui manipule les âmes avec sa main ?\n🎌Jujutsu Kaisen🎌", answer: "mahito" },
  { question: "quelle est la spécialité de nanami ?\n🎌Jujutsu Kaisen🎌", answer: "ratio technique" },
  { question: "qui est le maître de yuta ?\n🎌Jujutsu Kaisen🎌", answer: "gojo" },
  { question: "quel objet contient rika dans le film ?\n🎌Jujutsu Kaisen🎌", answer: "bague" },
  { question: "qui tue mahito ?\n🎌Jujutsu Kaisen🎌", answer: "kenjaku" },
  { question: "qui est kenjaku ?\n🎌Jujutsu Kaisen🎌", answer: "possesseur du corps de geto" },
  { question: "quelle est l’arme principale de yuta ?\n🎌Jujutsu Kaisen🎌", answer: "katana" },
  { question: "qui utilise une technique avec des cheveux ?\n🎌Jujutsu Kaisen🎌", answer: "kusakabe" },
  { question: "qui est la présidente de la classe de megumi ?\n🎌Jujutsu Kaisen🎌", answer: "tsukimi" },
  { question: "quel est le lien entre gojo et le clan zenin ?\n🎌Jujutsu Kaisen🎌", answer: "rivalité de clans" },
  { question: "quel est le niveau de yuki tsukumo ?\n🎌Jujutsu Kaisen🎌", answer: "grade spécial" },
  { question: "quelle est la technique de maki zenin ?\n🎌Jujutsu Kaisen🎌", answer: "force physique pure" },
  { question: "qui tue naoya zenin ?\n🎌Jujutsu Kaisen🎌", answer: "maki" },
  { question: "quelle technique de gojo permet d’écraser tout autour ?\n🎌Jujutsu Kaisen🎌", answer: "rouge" },
  { question: "quelle technique attire tout vers un point ?\n🎌Jujutsu Kaisen🎌", answer: "bleu" },
  { question: "quelle technique de gojo combine bleu et rouge ?\n🎌Jujutsu Kaisen🎌", answer: "hollow purple" },
  { question: "quel est le nom du clan de megumi ?\n🎌Jujutsu Kaisen🎌", answer: "zenin" },
  { question: "quelle est la condition d’utilisation du domaine ?\n🎌Jujutsu Kaisen🎌", answer: "consommation de beaucoup d’énergie" },
  { question: "quel personnage a été réincarné par kenjaku ?\n🎌Jujutsu Kaisen🎌", answer: "geto" },
  { question: "qui est considéré comme le successeur potentiel de gojo ?\n🎌Jujutsu Kaisen🎌", answer: "yuta okkotsu" },

  { question: "dans naruto shippuden, quel est le nom du démon renard scellé en naruto ?\n🎌Naruto Shippuden🎌", answer: "kyubi" },
  { question: "dans naruto shippuden, qui est le chef de l'akatsuki ?\n🎌Naruto Shippuden🎌", answer: "pain" },
  { question: "dans naruto shippuden, quelle est la vraie identité de tobi ?\n🎌Naruto Shippuden🎌", answer: "obito uchiha" },
  { question: "dans naruto shippuden, quel est le nom de la mère de naruto ?\n🎌Naruto Shippuden🎌", answer: "kushina uzumaki" },
  { question: "dans naruto shippuden, qui est le frère aîné de sasuke ?\n🎌Naruto Shippuden🎌", answer: "itachi uchiha" },
  { question: "dans naruto shippuden, quel bijuu a sept queues ?\n🎌Naruto Shippuden🎌", answer: "chomei" },
  { question: "dans naruto shippuden, quel est le nom de la technique ultime de naruto ?\n🎌Naruto Shippuden🎌", answer: "rasenshuriken" },
  { question: "dans naruto shippuden, quel est le clan de shikamaru ?\n🎌Naruto Shippuden🎌", answer: "nara" },
  { question: "dans naruto shippuden, quel est le nom du père de naruto ?\n🎌Naruto Shippuden🎌", answer: "minato namikaze" },
  { question: "dans naruto shippuden, quel est le rang ninja de kakashi ?\n🎌Naruto Shippuden🎌", answer: "jonin" },
  { question: "dans naruto shippuden, qui peut contrôler les marionnettes ?\n🎌Naruto Shippuden🎌", answer: "kankuro" },
  { question: "dans naruto shippuden, quel est le village caché du sable ?\n🎌Naruto Shippuden🎌", answer: "sunagakure" },
  { question: "dans naruto shippuden, qui a tué asuma ?\n🎌Naruto Shippuden🎌", answer: "hidan" },
  { question: "dans naruto shippuden, quelle technique utilise gai pour ouvrir les portes ?\n🎌Naruto Shippuden🎌", answer: "huit portes" },
  { question: "dans naruto shippuden, quel est le nom du bijuu à une queue ?\n🎌Naruto Shippuden🎌", answer: "shukaku" },
  { question: "dans naruto shippuden, qui est le jinchuriki de huit queues ?\n🎌Naruto Shippuden🎌", answer: "killer bee" },
  { question: "dans naruto shippuden, qui est le sensei de naruto à l’académie ?\n🎌Naruto Shippuden🎌", answer: "iruka" },
  { question: "dans naruto shippuden, quel est le nom de la technique d’invocation de naruto ?\n🎌Naruto Shippuden🎌", answer: "invocation des crapauds" },
  { question: "dans naruto shippuden, qui est la cinquième hokage ?\n🎌Naruto Shippuden🎌", answer: "tsunade" },
  { question: "dans naruto shippuden, qui est l’utilisateur principal du sharigan et rinnegan ?\n🎌Naruto Shippuden🎌", answer: "madara uchiha" },
  { question: "dans naruto shippuden, quelle organisation cherche à capturer les bijuu ?\n🎌Naruto Shippuden🎌", answer: "akatsuki" },
  { question: "dans naruto shippuden, quel personnage utilise l’art explosif ?\n🎌Naruto Shippuden🎌", answer: "deidara" },
  { question: "dans naruto shippuden, quel est le nom complet de pain ?\n🎌Naruto Shippuden🎌", answer: "nagato uzumaki" },
  { question: "dans naruto shippuden, qui est le partenaire de kakuzu ?\n🎌Naruto Shippuden🎌", answer: "hidan" },
  { question: "dans naruto shippuden, qui est le père de sasuke ?\n🎌Naruto Shippuden🎌", answer: "fugaku uchiha" },
  { question: "dans naruto shippuden, qui est le fils de naruto ?\n🎌Naruto Shippuden🎌", answer: "boruto" },
  { question: "dans naruto shippuden, quel est le nom du crapaud maître de naruto ?\n🎌Naruto Shippuden🎌", answer: "fukasaku" },
  { question: "dans naruto shippuden, qui est la sœur de neji ?\n🎌Naruto Shippuden🎌", answer: "hinata" },
  { question: "dans naruto shippuden, qui est le chef du clan aburame ?\n🎌Naruto Shippuden🎌", answer: "shino" },
  { question: "dans naruto shippuden, qui est l’utilisateur du style de sable de fer ?\n🎌Naruto Shippuden🎌", answer: "sasori" },
  { question: "dans naruto shippuden, quel ninja utilise le style lave ?\n🎌Naruto Shippuden🎌", answer: "mei terumi" },
  { question: "dans naruto shippuden, quel est le rang de yamato ?\n🎌Naruto Shippuden🎌", answer: "anbu" },
  { question: "dans naruto shippuden, quel ninja invoque un chien géant ?\n🎌Naruto Shippuden🎌", answer: "kakashi" },
  { question: "dans naruto shippuden, qui tue danzo shimura ?\n🎌Naruto Shippuden🎌", answer: "sasuke uchiha" },
  { question: "dans naruto shippuden, quelle est la spécialité du clan ino ?\n🎌Naruto Shippuden🎌", answer: "contrôle mental" },
  { question: "dans naruto shippuden, quel est le nom du fondateur du clan uchiha ?\n🎌Naruto Shippuden🎌", answer: "madara" },
  { question: "dans naruto shippuden, qui tue kurama ?\n🎌Naruto Shippuden🎌", answer: "personne" },
  { question: "dans naruto shippuden, qui est l’hôte de kurama ?\n🎌Naruto Shippuden🎌", answer: "naruto uzumaki" },
  { question: "dans naruto shippuden, quel est le jutsu interdit de l’akatsuki ?\n🎌Naruto Shippuden🎌", answer: "edo tensei" },
  { question: "dans naruto shippuden, quelle technique utilise les ombres ?\n🎌Naruto Shippuden🎌", answer: "kagemane" },
  { question: "dans naruto shippuden, qui est le coéquipier de neji ?\n🎌Naruto Shippuden🎌", answer: "lee" },
  { question: "dans naruto shippuden, qui est le rival de naruto dans sa team ?\n🎌Naruto Shippuden🎌", answer: "sasuke" },
  { question: "dans naruto shippuden, qui est la sensei de l’équipe de hinata ?\n🎌Naruto Shippuden🎌", answer: "kurenai" },
  { question: "dans naruto shippuden, qui manipule les papillons pour combattre ?\n🎌Naruto Shippuden🎌", answer: "choji" },
  { question: "dans naruto shippuden, quelle est la spécialité de kiba ?\n🎌Naruto Shippuden🎌", answer: "collaboration avec akamaru" },
  { question: "dans naruto shippuden, quel est le frère de itachi ?\n🎌Naruto Shippuden🎌", answer: "sasuke" },
  { question: "dans naruto shippuden, qui a sauvé naruto de zabuza ?\n🎌Naruto Shippuden🎌", answer: "kakashi" },
  { question: "dans naruto shippuden, qui a formé l’équipe taka ?\n🎌Naruto Shippuden🎌", answer: "sasuke" },

  { question: "dans bleach, comment se nomme le zanpakuto principal d'ichigo kurosaki ?\n🎌Bleach🎌", answer: "zangetsu" },
  { question: "dans bleach, qui est le capitaine de la 6e division du gotei 13 ?\n🎌Bleach🎌", answer: "byakuya kuchiki" },
  { question: "dans bleach, comment appelle-t-on la forme évoluée d'un zanpakuto ?\n🎌Bleach🎌", answer: "bankai" },
  { question: "dans bleach, quel personnage est le capitaine traître de la 5e division ?\n🎌Bleach🎌", answer: "sosuke aizen" },
  { question: "dans bleach, qui est l'esprit hollow intérieur d'ichigo ?\n🎌Bleach🎌", answer: "inner hollow" },
  { question: "dans bleach, quelle est la ville natale d'ichigo kurosaki ?\n🎌Bleach🎌", answer: "karakura" },
  { question: "dans bleach, quel est le pouvoir de protection d'orihime inoue ?\n🎌Bleach🎌", answer: "shun shun rikka" },
  { question: "dans bleach, qui dirige la 12e division de recherche ?\n🎌Bleach🎌", answer: "mayuri kurotsuchi" },
  { question: "dans bleach, quel est le nom complet du personnage surnommé chad ?\n🎌Bleach🎌", answer: "yasutora sado" },
  { question: "dans bleach, quelle division est chargée des soins ?\n🎌Bleach🎌", answer: "4e division" },
  { question: "dans bleach, quelle division aime le combat frontal ?\n🎌Bleach🎌", answer: "11e division" },
  { question: "dans bleach, quel est le zanpakuto de renji abarai ?\n🎌Bleach🎌", answer: "zabimaru" },
  { question: "dans bleach, quelle est la forme bankai de zabimaru ?\n🎌Bleach🎌", answer: "soui zabimaru" },
  { question: "dans bleach, qui porte toujours un bob et un éventail ?\n🎌Bleach🎌", answer: "kisuke urahara" },
  { question: "dans bleach, quelle est la technique de déplacement des shinigami ?\n🎌Bleach🎌", answer: "shunpo" },
  { question: "dans bleach, quelle est l'attaque signature d'ichigo ?\n🎌Bleach🎌", answer: "getsuga tensho" },
  { question: "dans bleach, quel est le nom de sa bankai ?\n🎌Bleach🎌", answer: "tensa zangetsu" },
  { question: "dans bleach, qui est le père d'ichigo ?\n🎌Bleach🎌", answer: "isshin kurosaki" },
  { question: "dans bleach, qui est le capitaine de la 11e division ?\n🎌Bleach🎌", answer: "kenpachi zaraki" },
  { question: "dans bleach, comment s'appelle le monde des hollows ?\n🎌Bleach🎌", answer: "hueco mundo" },
  { question: "dans bleach, quel groupe contient les plus puissants arrancars ?\n🎌Bleach🎌", answer: "espada" },
  { question: "dans bleach, quel est le numéro de grimmjow ?\n🎌Bleach🎌", answer: "6" },
  { question: "dans bleach, quel espada peut se transformer deux fois ?\n🎌Bleach🎌", answer: "ulquiorra" },
  { question: "dans bleach, qui est le plus jeune capitaine du gotei 13 ?\n🎌Bleach🎌", answer: "toshirou hitsugaya" },
  { question: "dans bleach, qui est la vice-capitaine de hitsugaya ?\n🎌Bleach🎌", answer: "rangiku matsumoto" },
  { question: "dans bleach, quel est le zanpakuto de byakuya kuchiki ?\n🎌Bleach🎌", answer: "senbonzakura" },
  { question: "dans bleach, quelle division est dirigée par soi fon ?\n🎌Bleach🎌", answer: "2e division" },
  { question: "dans bleach, quel est le zanpakuto de soi fon ?\n🎌Bleach🎌", answer: "suzumebachi" },
  { question: "dans bleach, quel personnage est surnommé le roi des quincy ?\n🎌Bleach🎌", answer: "yhwach" },
  { question: "dans bleach, quel est le nom du groupe ennemi final ?\n🎌Bleach🎌", answer: "wandenreich" },
  { question: "dans bleach, quel est le pouvoir de kyoka suigetsu d'aizen ?\n🎌Bleach🎌", answer: "hypnose totale" },
  { question: "dans bleach, qui dirige les vizards ?\n🎌Bleach🎌", answer: "shinji hirako" },
  { question: "dans bleach, comment s'appelle le chat qui aide ichigo ?\n🎌Bleach🎌", answer: "yoruichi" },
  { question: "dans bleach, quelle était la division d'urahara avant son exil ?\n🎌Bleach🎌", answer: "12e division" },
  { question: "dans bleach, qui est la vice-capitaine de zaraki kenpachi ?\n🎌Bleach🎌", answer: "yachiru kusajishi" },
  { question: "dans bleach, quelle est l'attaque ultime d'ichigo contre aizen ?\n🎌Bleach🎌", answer: "mugetsu" },
  { question: "dans bleach, quel est le nom du monde des âmes ?\n🎌Bleach🎌", answer: "soul society" },
  { question: "dans bleach, qui est le scientifique le plus fou de la soul society ?\n🎌Bleach🎌", answer: "mayuri kurotsuchi" },
  { question: "dans bleach, quel est le bankai de mayuri ?\n🎌Bleach🎌", answer: "konjiki ashisogi jizo" },
  { question: "dans bleach, qui est l'espada numéro 1 ?\n🎌Bleach🎌", answer: "starrk" },
  { question: "dans bleach, quel espada porte deux pistolets ?\n🎌Bleach🎌", answer: "starrk" },
  { question: "dans bleach, quel est l'ennemi final de l'anime ?\n🎌Bleach🎌", answer: "yhwach" },
  { question: "dans bleach, comment se nomme le roi spirituel ?\n🎌Bleach🎌", answer: "reiou" },
  { question: "dans bleach, quel capitaine utilise des jeux pour se battre en bankai ?\n🎌Bleach🎌", answer: "shunsui kyoraku" },
  { question: "dans bleach, quel zanpakuto se divise en deux sabres dès sa base ?\n🎌Bleach🎌", answer: "katen kyokotsu" },
  { question: "dans bleach, quel est le pouvoir principal des quincy ?\n🎌Bleach🎌", answer: "arc spirituel" },
  { question: "dans bleach, quel est le nom de la division des assassins ?\n🎌Bleach🎌", answer: "onmitsukido" },
  { question: "dans bleach, qui est l'espada numéro 4 ?\n🎌Bleach🎌", answer: "ulquiorra" },
  { question: "dans bleach, qui est le capitaine le plus ancien du gotei 13 avant sa mort ?\n🎌Bleach🎌", answer: "yamamoto genryusai" },
  { question: "dans bleach, quel zanpakuto utilise la chaleur et le feu ?\n🎌Bleach🎌", answer: "ryujin jakka" },
  { question: "dans bleach, qui possède le bankai mugetsu ?\n🎌Bleach🎌", answer: "ichigo kurosaki" }



];

const activeSessions = {};

module.exports = {
  config: {
    name: "quizz-manga",
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
