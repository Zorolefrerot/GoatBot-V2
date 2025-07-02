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
  { question: "dans bleach, qui possède le bankai mugetsu ?\n🎌Bleach🎌", answer: "ichigo kurosaki" },
  
  { question: "quel est le nom complet du héros principal ?\n🎌Demon Slayer🎌", answer: "tanjiro kamado" },
  { question: "comment s’appelle la sœur de tanjiro ?\n🎌Demon Slayer🎌", answer: "nezuko kamado" },
  { question: "quel est le nom de la technique principale de tanjiro ?\n🎌Demon Slayer🎌", answer: "souffle de l’eau" },
  { question: "qui est le chef des piliers ?\n🎌Demon Slayer🎌", answer: "kagaya ubuyashiki" },
  { question: "quel démon a tué la famille de tanjiro ?\n🎌Demon Slayer🎌", answer: "muzan kibutsuji" },
  { question: "qui est le pilier du feu ?\n🎌Demon Slayer🎌", answer: "kyojuro rengoku" },
  { question: "comment s'appelle le garçon qui utilise la foudre ?\n🎌Demon Slayer🎌", answer: "zenitsu agatsuma" },
  { question: "comment s’appelle celui qui porte une tête de sanglier ?\n🎌Demon Slayer🎌", answer: "inosuke hashibira" },
  { question: "quelle est la particularité de nezuko en tant que démon ?\n🎌Demon Slayer🎌", answer: "elle résiste au soleil" },
  { question: "quelle organisation combat les démons ?\n🎌Demon Slayer🎌", answer: "corps des pourfendeurs de démons" },
  { question: "quelle est la couleur des cheveux de muzan ?\n🎌Demon Slayer🎌", answer: "noir" },
  { question: "qui est le pilier du son ?\n🎌Demon Slayer🎌", answer: "tengen uzui" },
  { question: "quelle technique utilise zenitsu ?\n🎌Demon Slayer🎌", answer: "souffle de la foudre" },
  { question: "qui est le pilier de l’insecte ?\n🎌Demon Slayer🎌", answer: "shinobu kocho" },
  { question: "qui est la sœur de shinobu ?\n🎌Demon Slayer🎌", answer: "kanae kocho" },
  { question: "comment s'appelle la plus forte lune supérieure ?\n🎌Demon Slayer🎌", answer: "kokushibo" },
  { question: "combien de lunes supérieures existe-t-il ?\n🎌Demon Slayer🎌", answer: "six" },
  { question: "qui est l’ancien pourfendeur devenu lune supérieure ?\n🎌Demon Slayer🎌", answer: "kokushibo" },
  { question: "quelle est la spécialité de muzan ?\n🎌Demon Slayer🎌", answer: "créer des démons" },
  { question: "quelle est la faiblesse principale des démons ?\n🎌Demon Slayer🎌", answer: "lumière du soleil" },
  { question: "qui est le pilier de la brume ?\n🎌Demon Slayer🎌", answer: "muichiro tokito" },
  { question: "qui est le pilier de l’amour ?\n🎌Demon Slayer🎌", answer: "mitsuri kanroji" },
  { question: "qui est le pilier de la pierre ?\n🎌Demon Slayer🎌", answer: "gyomei himejima" },
  { question: "quelle est la technique spéciale de muzan ?\n🎌Demon Slayer🎌", answer: "biologiquement immortel" },
  { question: "comment s'appelle le sabre utilisé par les pourfendeurs ?\n🎌Demon Slayer🎌", answer: "katana nichirin" },
  { question: "quelle est la première mission de tanjiro ?\n🎌Demon Slayer🎌", answer: "sauver une fille enlevée la nuit" },
  { question: "qui entraîne tanjiro au début ?\n🎌Demon Slayer🎌", answer: "sakonji urokodaki" },
  { question: "quel démon tanjiro affronte à la sélection finale ?\n🎌Demon Slayer🎌", answer: "le démon aux bras multiples" },
  { question: "combien de jours dure la sélection finale ?\n🎌Demon Slayer🎌", answer: "sept jours" },
  { question: "quel personnage a une double personnalité ?\n🎌Demon Slayer🎌", answer: "zenitsu agatsuma" },
  { question: "quel pilier meurt dans le train de l’infini ?\n🎌Demon Slayer🎌", answer: "rengoku" },
  { question: "qui est la première lune supérieure vaincue ?\n🎌Demon Slayer🎌", answer: "gyutaro" },
  { question: "quelle est la spécialité d’inosuke ?\n🎌Demon Slayer🎌", answer: "combat instinctif" },
  { question: "quelle est la couleur du sabre de tanjiro ?\n🎌Demon Slayer🎌", answer: "noir" },
  { question: "quelle forme développe tanjiro après l’eau ?\n🎌Demon Slayer🎌", answer: "souffle du soleil" },
  { question: "quel est le style le plus ancien ?\n🎌Demon Slayer🎌", answer: "souffle du soleil" },
  { question: "qui est le rival de tanjiro parmi les démons ?\n🎌Demon Slayer🎌", answer: "akaza" },
  { question: "quelle est la position d'akaza chez les lunes ?\n🎌Demon Slayer🎌", answer: "troisième lune" },
  { question: "qui utilise le souffle du serpent ?\n🎌Demon Slayer🎌", answer: "obanaï iguro" },
  { question: "quelle est l’arme d’uzui ?\n🎌Demon Slayer🎌", answer: "deux grosses lames attachées" },
  { question: "quel est le lien entre muichiro et kokushibo ?\n🎌Demon Slayer🎌", answer: "descendants d’un même ancêtre" },
  { question: "qui est le plus jeune pilier ?\n🎌Demon Slayer🎌", answer: "muichiro" },
  { question: "quel pilier est aveugle ?\n🎌Demon Slayer🎌", answer: "gyomei" },
  { question: "qui est la meilleure amie de mitsuri ?\n🎌Demon Slayer🎌", answer: "obanaï" },
  { question: "quelle est la fin de muzan ?\n🎌Demon Slayer🎌", answer: "vaincu par tanjiro et les pourfendeurs" },
  { question: "tanjiro devient-il démon ?\n🎌Demon Slayer🎌", answer: "oui" },
  { question: "comment nezuko redevient humaine ?\n🎌Demon Slayer🎌", answer: "avec un remède spécial" },
  { question: "quel démon utilise une sœur et un frère ?\n🎌Demon Slayer🎌", answer: "gyutaro et daki" },
  { question: "qui est responsable de la mission du quartier des plaisirs ?\n🎌Demon Slayer🎌", answer: "uzui" },
  { question: "qui crée le médicament pour nezuko ?\n🎌Demon Slayer🎌", answer: "tamayo" },
  
  { question: "qui est le protagoniste principal de tokyo revengers ?\n🎌Tokyo Revengers🎌", answer: "takemichi hanagaki" },
  { question: "quel est le surnom de manjiro sano ?\n🎌Tokyo Revengers🎌", answer: "mikey" },
  { question: "comment s’appelle l’organisation que mikey dirige ?\n🎌Tokyo Revengers🎌", answer: "tokyo manji gang" },
  { question: "quelle est la capacité spéciale de takemichi ?\n🎌Tokyo Revengers🎌", answer: "voyage dans le temps" },
  { question: "quel personnage est surnommé 'draken' ?\n🎌Tokyo Revengers🎌", answer: "ken ryuguji" },
  { question: "qui est la petite amie de takemichi dans le passé ?\n🎌Tokyo Revengers🎌", answer: "hinata tachibana" },
  { question: "comment takemichi retourne-t-il dans le passé ?\n🎌Tokyo Revengers🎌", answer: "en serrant la main de naoto" },
  { question: "quel est le rôle de naoto tachibana ?\n🎌Tokyo Revengers🎌", answer: "inspecteur de police" },
  { question: "qui est le fondateur du tokyo manji gang ?\n🎌Tokyo Revengers🎌", answer: "mikey" },
  { question: "qui est le bras droit de mikey ?\n🎌Tokyo Revengers🎌", answer: "draken" },
  { question: "quelle est la couleur des cheveux de mikey ?\n🎌Tokyo Revengers🎌", answer: "blond" },
  { question: "qui est le premier antagoniste principal dans l’histoire ?\n🎌Tokyo Revengers🎌", answer: "kisaki" },
  { question: "qui est le chef de moebius ?\n🎌Tokyo Revengers🎌", answer: "shoji hanma" },
  { question: "quel est le but de takemichi dans le présent ?\n🎌Tokyo Revengers🎌", answer: "sauver hinata" },
  { question: "comment s'appelle le frère de hinata ?\n🎌Tokyo Revengers🎌", answer: "naoto" },
  { question: "quelle division est dirigée par takemichi dans toman ?\n🎌Tokyo Revengers🎌", answer: "1ère division" },
  { question: "quel est le vrai nom de baji ?\n🎌Tokyo Revengers🎌", answer: "keisuke baji" },
  { question: "comment s'appelle le meilleur ami de baji ?\n🎌Tokyo Revengers🎌", answer: "chifuyu matsuno" },
  { question: "qui est le fondateur de valhalla ?\n🎌Tokyo Revengers🎌", answer: "kisaki" },
  { question: "quel gang absorbe toman dans une timeline alternative ?\n🎌Tokyo Revengers🎌", answer: "black dragons" },
  { question: "quel est le rôle de hanma ?\n🎌Tokyo Revengers🎌", answer: "bras droit de kisaki" },
  { question: "qui tue baji ?\n🎌Tokyo Revengers🎌", answer: "kazutora" },
  { question: "quel est le vrai nom de mikey ?\n🎌Tokyo Revengers🎌", answer: "manjiro sano" },
  { question: "qui est le frère aîné de mikey ?\n🎌Tokyo Revengers🎌", answer: "shinichiro sano" },
  { question: "qui est le fondateur des black dragons ?\n🎌Tokyo Revengers🎌", answer: "shinichiro sano" },
  { question: "quelle génération des black dragons est la plus crainte ?\n🎌Tokyo Revengers🎌", answer: "10e" },
  { question: "qui dirige les black dragons à la 10e génération ?\n🎌Tokyo Revengers🎌", answer: "taiju shiba" },
  { question: "quelle est la spécialité de taiju shiba ?\n🎌Tokyo Revengers🎌", answer: "force brute" },
  { question: "qui est le frère de taiju ?\n🎌Tokyo Revengers🎌", answer: "hakkai shiba" },
  { question: "qui veut protéger hakkai des abus de taiju ?\n🎌Tokyo Revengers🎌", answer: "takemichi" },
  { question: "qui est la sœur de hakkai ?\n🎌Tokyo Revengers🎌", answer: "yuzuha shiba" },
  { question: "quelle est la principale faiblesse de takemichi ?\n🎌Tokyo Revengers🎌", answer: "il ne sait pas se battre" },
  { question: "comment mikey devient-il instable dans certaines timelines ?\n🎌Tokyo Revengers🎌", answer: "à cause de la perte de ses proches" },
  { question: "qui est le stratège derrière les manipulations de gang ?\n🎌Tokyo Revengers🎌", answer: "kisaki" },
  { question: "quelle est la conséquence de l’absence de draken dans le futur ?\n🎌Tokyo Revengers🎌", answer: "toman devient criminel" },
  { question: "qui aide takemichi à comprendre kisaki ?\n🎌Tokyo Revengers🎌", answer: "chifuyu" },
  { question: "que fait kisaki à la fin de l'arc tenjiku ?\n🎌Tokyo Revengers🎌", answer: "il tente de tuer takemichi" },
  { question: "qui est le chef de tenjiku ?\n🎌Tokyo Revengers🎌", answer: "izana kuro" },
  { question: "quel est le lien entre izana et mikey ?\n🎌Tokyo Revengers🎌", answer: "demi-frère adoptif" },
  { question: "qui est surnommé 'le roi du crime' ?\n🎌Tokyo Revengers🎌", answer: "izana" },
  { question: "quel est le nom du gang final dans la timeline la plus sombre ?\n🎌Tokyo Revengers🎌", answer: "bonten" },
  { question: "qui dirige bonten ?\n🎌Tokyo Revengers🎌", answer: "mikey" },
  { question: "qui est le bras droit de bonten ?\n🎌Tokyo Revengers🎌", answer: "sanzu" },
  { question: "comment s’appelle le chef d’unité de la 2e division de toman ?\n🎌Tokyo Revengers🎌", answer: "mitsuya" },
  { question: "quel est le rêve de takemichi à la fin ?\n🎌Tokyo Revengers🎌", answer: "vivre une vie paisible avec hinata" },
  { question: "quelle est la date récurrente du début du voyage temporel ?\n🎌Tokyo Revengers🎌", answer: "4 juillet" },
  { question: "quel est le point de départ de la série ?\n🎌Tokyo Revengers🎌", answer: "hinata meurt dans un accident" },
  { question: "qui est surnommé le 'chien fou de bonten' ?\n🎌Tokyo Revengers🎌", answer: "sanzu haruchiyo" },
  { question: "qui a trahi toman pendant l'arc valhalla ?\n🎌Tokyo Revengers🎌", answer: "kisaki" },
  { question: "quelle est la couleur de cheveux de draken ?\n🎌Tokyo Revengers🎌", answer: "blond" },
  { question: "quel est le gang rival de toman durant l’arc moebius ?\n🎌Tokyo Revengers🎌", answer: "moebius" },
  
  { question: "quel est le vrai nom de kaiju no. 8 ?\n🎌Kaiju No. 8🎌", answer: "kaffka hibino" },
  { question: "quel est le nom de l’amie d’enfance de kaffka ?\n🎌Kaiju No. 8🎌", answer: "mina ashira" },
  { question: "quelle est l’unité dirigée par mina ?\n🎌Kaiju No. 8🎌", answer: "3e division" },
  { question: "comment kaffka obtient-il ses pouvoirs ?\n🎌Kaiju No. 8🎌", answer: "il est infecté par un kaiju" },
  { question: "qui est le capitaine strict de la 3e division ?\n🎌Kaiju No. 8🎌", answer: "soshiro hoshina" },
  { question: "quelle organisation combat les kaijus ?\n🎌Kaiju No. 8🎌", answer: "force de défense" },
  { question: "quelle est la particularité de kaiju no. 8 ?\n🎌Kaiju No. 8🎌", answer: "il est humain et kaiju" },
  { question: "quel est le rêve de kaffka au début ?\n🎌Kaiju No. 8🎌", answer: "rejoindre la force de défense" },
  { question: "quel est le surnom du kaiju numéro 9 ?\n🎌Kaiju No. 8🎌", answer: "kaiju intelligent" },
  { question: "quel est le poste initial de kaffka ?\n🎌Kaiju No. 8🎌", answer: "nettoyeur de cadavres de kaiju" },
  { question: "qui est la recrue talentueuse aux lunettes ?\n🎌Kaiju No. 8🎌", answer: "reno ichikawa" },
  { question: "qui est la jeune recrue timide amie de reno ?\n🎌Kaiju No. 8🎌", answer: "ichikawa" },
  { question: "quelle est la puissance de déploiement de kaffka ?\n🎌Kaiju No. 8🎌", answer: "zéro pourcent" },
  { question: "quelle arme utilise hoshina ?\n🎌Kaiju No. 8🎌", answer: "sabres" },
  { question: "comment s’appelle la fille forte qui rejoint la 3e division ?\n🎌Kaiju No. 8🎌", answer: "kikoru shinomiya" },
  { question: "quel est le lien de kikoru avec la direction ?\n🎌Kaiju No. 8🎌", answer: "fille du directeur général" },
  { question: "quel est le grade de mina ashira ?\n🎌Kaiju No. 8🎌", answer: "capitaine" },
  { question: "comment kaffka cache-t-il son identité ?\n🎌Kaiju No. 8🎌", answer: "il se transforme hors de vue" },
  { question: "quel est le nom du kaiju qui parle et planifie ?\n🎌Kaiju No. 8🎌", answer: "kaiju no. 9" },
  { question: "quelle unité utilise la technologie la plus avancée ?\n🎌Kaiju No. 8🎌", answer: "1ère division" },
  { question: "comment s'appelle l'armure utilisée contre les kaiju ?\n🎌Kaiju No. 8🎌", answer: "système de combinaison" },
  { question: "quelle est la première mission de kaffka après sa réussite ?\n🎌Kaiju No. 8🎌", answer: "attaque d’un kaiju classe fort" },
  { question: "quelle est la particularité du kaiju no. 9 ?\n🎌Kaiju No. 8🎌", answer: "il évolue rapidement" },
  { question: "qui est le chef suprême de la défense ?\n🎌Kaiju No. 8🎌", answer: "isao shinomiya" },
  { question: "quelle division est réputée pour ses missions périlleuses ?\n🎌Kaiju No. 8🎌", answer: "3e division" },
  { question: "qui est surnommé 'le chasseur de kaiju' ?\n🎌Kaiju No. 8🎌", answer: "hoshina" },
  { question: "comment kaffka réagit face à la peur en mission ?\n🎌Kaiju No. 8🎌", answer: "il agit instinctivement" },
  { question: "qu'est-ce qui rend kaiju no. 8 différent des autres ?\n🎌Kaiju No. 8🎌", answer: "il garde sa conscience humaine" },
  { question: "quel est le style de combat de kikoru ?\n🎌Kaiju No. 8🎌", answer: "force brute" },
  { question: "quelle est la réponse de la direction après l’identification de kaiju no. 8 ?\n🎌Kaiju No. 8🎌", answer: "exécution immédiate" },
  { question: "quelle est la conséquence pour kaffka après sa transformation révélée ?\n🎌Kaiju No. 8🎌", answer: "il est placé en détention" },
  { question: "quelle est la réaction de mina après la révélation de kaffka ?\n🎌Kaiju No. 8🎌", answer: "elle reste silencieuse" },
  { question: "qui veut surpasser kaffka en puissance ?\n🎌Kaiju No. 8🎌", answer: "reno" },
  { question: "quelle ville est attaquée dans les premiers chapitres ?\n🎌Kaiju No. 8🎌", answer: "yokohama" },
  { question: "quelle est la mission principale de la force de défense ?\n🎌Kaiju No. 8🎌", answer: "éliminer les kaiju" },
  { question: "quel est le nom de code officiel de kaffka ?\n🎌Kaiju No. 8🎌", answer: "kaiju no. 8" },
  { question: "quelle est l’arme la plus efficace contre les kaijus ?\n🎌Kaiju No. 8🎌", answer: "combinaison de puissance" },
  { question: "comment les recrues améliorent-elles leur score ?\n🎌Kaiju No. 8🎌", answer: "en synchronisant leur combinaison" },
  { question: "quel personnage veut venger ses camarades ?\n🎌Kaiju No. 8🎌", answer: "kikoru" },
  { question: "quel est le rôle des agents d’élite ?\n🎌Kaiju No. 8🎌", answer: "éliminer les kaiju classe supérieur" },
  { question: "qui interroge kaffka après sa capture ?\n🎌Kaiju No. 8🎌", answer: "isao" },
  { question: "que représente le chiffre d’un kaiju ?\n🎌Kaiju No. 8🎌", answer: "son classement spécial" },
  { question: "quelle est la principale faiblesse de kaffka ?\n🎌Kaiju No. 8🎌", answer: "il perd parfois le contrôle" },
  { question: "comment kaffka protège reno pendant une attaque ?\n🎌Kaiju No. 8🎌", answer: "en se transformant en kaiju" },
  { question: "quel est l’objectif de kaiju no. 9 ?\n🎌Kaiju No. 8🎌", answer: "créer une armée de kaiju intelligents" },
  { question: "quel est le surnom donné à kaffka par les médias ?\n🎌Kaiju No. 8🎌", answer: "le traître humain" },
  { question: "quel kaiju possède des pouvoirs de duplication ?\n🎌Kaiju No. 8🎌", answer: "kaiju no. 9" },
  { question: "qui aide kaffka à reprendre le contrôle lors de sa rage ?\n🎌Kaiju No. 8🎌", answer: "reno" },
  { question: "quel est l’élément central du conflit dans kaiju no. 8 ?\n🎌Kaiju No. 8🎌", answer: "coexistence impossible humain/kaiju" },
  { question: "comment kaffka est jugé utile malgré sa transformation ?\n🎌Kaiju No. 8🎌", answer: "grâce à sa conscience humaine" },
  { question: "qui commence à douter des intentions de la hiérarchie ?\n🎌Kaiju No. 8🎌", answer: "hoshina" }





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
