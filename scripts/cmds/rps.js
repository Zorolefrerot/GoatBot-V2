module.exports = {
  config: {
    name: "rps",
    aliases: ["rps", "shifumi", "pfc"],
    version: "1.0",
    author: "Merdi Madimba",
    shortDescription: "Pierre, Papier, Ciseaux",
    longDescription: "Joue à pierre-papier-ciseaux avec le bot",
    category: "🎮 Jeux",
    guide: {
      en: "{p}rps <pierre|papier|ciseaux>"
    }
  },

  onStart: async function ({ message, args }) {
    const userChoice = args[0]?.toLowerCase();
    const validChoices = ["pierre", "papier", "ciseaux"];
    if (!userChoice || !validChoices.includes(userChoice)) {
      return message.reply("❌ Tu dois choisir entre : pierre, papier ou ciseaux.\nEx : !rps pierre");
    }

    const botChoice = validChoices[Math.floor(Math.random() * 3)];

    let result = "";
    if (userChoice === botChoice) {
      result = "🤝 Égalité !";
    } else if (
      (userChoice === "pierre" && botChoice === "ciseaux") ||
      (userChoice === "papier" && botChoice === "pierre") ||
      (userChoice === "ciseaux" && botChoice === "papier")
    ) {
      result = "🎉 Tu gagnes !";
    } else {
      result = "😈 Le bot gagne !";
    }

    message.reply(
      `🧑 Toi : ${userChoice}\n🤖 Bot : ${botChoice}\n\n${result}`
    );
  }
};
