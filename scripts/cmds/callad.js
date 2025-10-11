const { getStreamsFromAttachment, log } = global.utils;

// Types de médias acceptés
const mediaTypes = ["photo", "png", "animated_image", "video", "audio"];

// 🏛️ ID du groupe administrateur
const ADMIN_GROUP_TID = "29968396699442660";

module.exports = {
  config: {
    name: "callad",
    version: "5.0",
    author: "Mod by 𝗠𝗘𝗥𝗗𝗜 𝗠𝗔𝗗𝗜𝗠𝗕𝗔 💫",
    countDown: 5,
    role: 0,
    description: {
      fr: "Permet d’envoyer un message, signalement ou suggestion à l’administrateur.",
      en: "Send a report or message to the admin group."
    },
    category: "📩 Contact Admin",
    guide: {
      fr: "{pn} <message> — envoie un message à l’administration",
      en: "{pn} <message> — send a message to the admin group"
    }
  },

  langs: {
    fr: {
      missingMessage: "⚠️ Veuillez entrer un message à envoyer à l’administrateur.",
      success: "✅ Votre message a été transmis avec succès à l’administration 💌",
      failed: "❌ Une erreur est survenue lors de l’envoi du message.",
      feedback:
`💌 **𝗡𝗢𝗨𝗩𝗘𝗔𝗨 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 𝗥𝗘𝗖̧𝗨 !**
━━━━━━━━━━━━━━━
👤 **De :** %1
🆔 **UID :** %2
🏠 **Source :** %3
━━━━━━━━━━━━━━━
📝 **Contenu :**
%4
━━━━━━━━━━━━━━━
💠 **Administrateur : 𝗠𝗘𝗥𝗗𝗜 𝗠𝗔𝗗𝗜𝗠𝗕𝗔 💫**`,
      replyAdmin:
`📬 **💬 RÉPONSE DE 𝗠𝗘𝗥𝗗𝗜 𝗠𝗔𝗗𝗜𝗠𝗕𝗔 💫**
━━━━━━━━━━━━━━━
%1
━━━━━━━━━━━━━━━`,
      replySuccess: "✅ Réponse envoyée avec succès dans le groupe de l’utilisateur 💌",
      sendByGroup: "💬 Groupe : %1\n🆔 Thread ID : %2",
      sendByUser: "📩 Message envoyé depuis une conversation privée."
    }
  },

  // ===== DÉBUT DE LA COMMANDE =====
  onStart: async function ({ args, message, event, usersData, threadsData, api, getLang, commandName }) {
    if (!args[0]) return message.reply(getLang("missingMessage"));

    const { senderID, threadID, isGroup } = event;
    const senderName = await usersData.getName(senderID);
    let locationText = "";

    if (isGroup) {
      const threadInfo = await threadsData.get(threadID);
      locationText = getLang("sendByGroup", threadInfo?.threadName || "Groupe inconnu", threadID);
    } else {
      locationText = getLang("sendByUser");
    }

    const messageContent = args.join(" ");

    // 📦 Préparer les fichiers joints
    const attachments = await getStreamsFromAttachment(
      [...(event.attachments || []), ...(event.messageReply?.attachments || [])]
        .filter(a => mediaTypes.includes(a.type))
    );

    const formMessage = {
      body: getLang("feedback", senderName, senderID, locationText, messageContent),
      mentions: [{ id: senderID, tag: senderName }],
      attachment: attachments
    };

    try {
      const sentMessage = await api.sendMessage(formMessage, ADMIN_GROUP_TID);
      message.reply(getLang("success"));

      // Enregistrement de la conversation
      global.GoatBot.onReply.set(sentMessage.messageID, {
        commandName,
        type: "adminReply",
        userID: senderID,
        originalThreadID: threadID,
        messageIDSender: event.messageID
      });
    } catch (error) {
      log.err("CALL ADMIN ERROR", error);
      return message.reply(getLang("failed"));
    }
  },

  // ===== GESTION DES RÉPONSES =====
  onReply: async function ({ args, event, api, message, Reply, getLang, commandName, usersData }) {
    const { type, userID, originalThreadID, messageIDSender } = Reply;
    const senderName = await usersData.getName(event.senderID);
    const replyContent = args.join(" ") || "— (message vide) —";

    // 📦 Gestion des pièces jointes
    const attachments = await getStreamsFromAttachment(
      event.attachments?.filter(a => mediaTypes.includes(a.type)) || []
    );

    switch (type) {
      case "adminReply": {
        // ✅ L'admin répond au message de l'utilisateur
        const replyMsg = {
          body: getLang("replyAdmin", replyContent),
          attachment: attachments,
          replyToMessageID: messageIDSender
        };

        try {
          const sentInfo = await api.sendMessage(replyMsg, originalThreadID);
          message.reply(getLang("replySuccess"));

          // Autoriser la réponse de l'utilisateur
          global.GoatBot.onReply.set(sentInfo.messageID, {
            commandName,
            type: "userReply",
            originalThreadID,
            adminName: senderName,
            messageIDSender
          });
        } catch (error) {
          log.err("ADMIN REPLY ERROR", error);
          return message.reply("❌ Impossible d’envoyer la réponse à l’utilisateur.");
        }
        break;
      }

      case "userReply": {
        // 👤 L'utilisateur répond à l'admin
        const replyForm = {
          body: `📨 **𝗥𝗘́𝗣𝗢𝗡𝗦𝗘 DE ${senderName} (${event.senderID}) :**\n━━━━━━━━━━━━━━━\n${replyContent}`,
          mentions: [{ id: event.senderID, tag: senderName }],
          attachment: attachments
        };

        try {
          const sentMsg = await api.sendMessage(replyForm, ADMIN_GROUP_TID);
          message.reply("✅ Votre réponse a été envoyée à l’administration 🕊️");

          // Enregistrer la nouvelle boucle de réponse
          global.GoatBot.onReply.set(sentMsg.messageID, {
            commandName,
            type: "adminReply",
            userID: event.senderID,
            originalThreadID,
            messageIDSender: event.messageID
          });
        } catch (error) {
          log.err("USER REPLY ERROR", error);
          return message.reply("❌ Impossible d’envoyer votre réponse à l’administration.");
        }
        break;
      }
    }
  }
};
