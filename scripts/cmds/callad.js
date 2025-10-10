const { getStreamsFromAttachment, log } = global.utils;
const mediaTypes = ["photo", "png", "animated_image", "video", "audio"];

// 🏛️ TID du groupe administrateur
const ADMIN_GROUP_TID = "29968396699442660";

module.exports = {
  config: {
    name: "callad",
    version: "4.0",
    author: "Mod by 𝗠𝗘𝗥𝗗𝗜 𝗠𝗔𝗗𝗜𝗠𝗕𝗔 💫",
    countDown: 5,
    role: 0,
    description: {
      fr: "Permet aux utilisateurs d’envoyer un message ou signalement à l’administrateur.",
      en: "Send a report, suggestion or bug directly to admin."
    },
    category: "📩 Contact Admin",
    guide: {
      fr: "💡 {pn} <message> — envoie un message à 𝗠𝗘𝗥𝗗𝗜 𝗠𝗔𝗗𝗜𝗠𝗕𝗔 💫",
      en: "{pn} <message> — send message to the admin group."
    }
  },

  langs: {
    fr: {
      missingMessage: "⚠️ Veuillez entrer un message à envoyer à l’administrateur.",
      success: "✅ Votre message a été transmis avec succès à l’administration !",
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

  // ======= DÉBUT DU CODE =======
  onStart: async function ({ args, message, event, usersData, threadsData, api, getLang, commandName }) {
    if (!args[0]) return message.reply(getLang("missingMessage"));

    const { senderID, threadID, isGroup } = event;
    const senderName = await usersData.getName(senderID);
    let locationText = "";

    if (isGroup) {
      const threadInfo = await threadsData.get(threadID);
      locationText = getLang("sendByGroup", threadInfo.threadName || "Groupe inconnu", threadID);
    } else {
      locationText = getLang("sendByUser");
    }

    const messageContent = args.join(" ");

    // Formulaire d’envoi au groupe admin
    const formMessage = {
      body: getLang("feedback", senderName, senderID, locationText, messageContent),
      mentions: [{ id: senderID, tag: senderName }],
      attachment: await getStreamsFromAttachment(
        [...event.attachments, ...(event.messageReply?.attachments || [])]
          .filter(item => mediaTypes.includes(item.type))
      )
    };

    try {
      const sentMessage = await api.sendMessage(formMessage, ADMIN_GROUP_TID);
      message.reply(getLang("success"));

      // Sauvegarde pour permettre la réponse dans le groupe d'origine
      global.GoatBot.onReply.set(sentMessage.messageID, {
        commandName,
        type: "adminReply",
        userID: senderID,
        originalThreadID: threadID, // <-- On garde le groupe d'origine
        messageIDSender: event.messageID
      });
    } catch (error) {
      log.err("CALL ADMIN ERROR", error);
      return message.reply(getLang("failed"));
    }
  },

  // ======= GESTION DES RÉPONSES =======
  onReply: async function ({ args, event, api, message, Reply, getLang, commandName, usersData }) {
    const { type, userID, originalThreadID, messageIDSender } = Reply;
    const senderName = await usersData.getName(event.senderID);
    const replyContent = args.join(" ") || "— (message vide) —";

    switch (type) {
      case "adminReply": {
        // ✅ L'admin répond, le message part dans le groupe d'origine
        const replyMsg = {
          body: getLang("replyAdmin", replyContent),
          attachment: await getStreamsFromAttachment(
            event.attachments.filter(item => mediaTypes.includes(item.type))
          ),
          replyToMessageID: messageIDSender // répond au message original
        };

        try {
          const sentInfo = await api.sendMessage(replyMsg, originalThreadID);
          message.reply(getLang("replySuccess"));

          // On permet à l’utilisateur de répondre à nouveau
          global.GoatBot.onReply.set(sentInfo.messageID, {
            commandName,
            type: "userReply",
            originalThreadID,
            adminName: senderName,
            messageIDSender
          });
        } catch (error) {
          message.reply("❌ Impossible d’envoyer la réponse dans le groupe.");
          log.err("ADMIN REPLY ERROR", error);
        }
        break;
      }

      case "userReply": {
        // L'utilisateur répond → envoie au groupe admin
        const replyForm = {
          body: `📨 **𝗥𝗘́𝗣𝗢𝗡𝗦𝗘 DE ${senderName} (${event.senderID}) :**\n━━━━━━━━━━━━━━━\n${replyContent}`,
          mentions: [{ id: event.senderID, tag: senderName }],
          attachment: await getStreamsFromAttachment(
            event.attachments.filter(item => mediaTypes.includes(item.type))
          )
        };

        try {
          const sentMsg = await api.sendMessage(replyForm, ADMIN_GROUP_TID);
          message.reply("✅ Votre réponse a été envoyée à l’administration 🕊️");
          global.GoatBot.onReply.set(sentMsg.messageID, {
            commandName,
            type: "adminReply",
            userID: event.senderID,
            originalThreadID,
            messageIDSender: event.messageID
          });
        } catch (error) {
          message.reply("❌ Impossible d’envoyer votre réponse à l’administration.");
          log.err("USER REPLY ERROR", error);
        }
        break;
      }
    }
  }
};
