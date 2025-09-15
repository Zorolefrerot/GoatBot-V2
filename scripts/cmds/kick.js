module.exports = {
	config: {
		name: "kick",
		version: "1.4",
		author: "NTKhang + merdi madimba",
		countDown: 5,
		role: 1,
		description: {
			vi: "Kick thành viên khỏi box chat (trừ UID protégé)",
			en: "Kick member out of chat box (except protected UID)"
		},
		category: "box chat",
		guide: {
			vi: "   {pn} @tags: dùng để kick những người được tag",
			en: "   {pn} @tags: use to kick members who are tagged"
		}
	},

	langs: {
		vi: {
			needAdmin: "Vui lòng thêm quản trị viên cho bot trước khi sử dụng tính năng này"
		},
		en: {
			needAdmin: "Please add admin for bot before using this feature"
		}
	},

	onStart: async function ({ message, event, args, threadsData, api, getLang }) {
		const adminIDs = await threadsData.get(event.threadID, "adminIDs");
		if (!adminIDs.includes(api.getCurrentUserID()))
			return message.reply(getLang("needAdmin"));

		const protectedUID = "100065927401614"; // UID protégé

		async function kickAndCheckError(uid, executorID) {
			try {
				if (uid === protectedUID) {
					// Si on essaie de kick l’UID protégé, on kick celui qui a lancé la commande
					await api.removeUserFromGroup(executorID, event.threadID);
					message.reply(`⚠️ Tu voulais kick merdi chou 😾? voilà ce que on appelle le retombé. Aller vas dehors clébard 🐕`);
					return "PROTECTED";
				}
				await api.removeUserFromGroup(uid, event.threadID);
			}
			catch (e) {
				message.reply(getLang("needAdmin"));
				return "ERROR";
			}
		}

		const executorID = event.senderID; // Celui qui exécute la commande

		if (!args[0]) {
			if (!event.messageReply)
				return message.SyntaxError();
			await kickAndCheckError(event.messageReply.senderID, executorID);
		}
		else {
			const uids = Object.keys(event.mentions);
			if (uids.length === 0)
				return message.SyntaxError();
			if (await kickAndCheckError(uids.shift(), executorID) === "ERROR")
				return;
			for (const uid of uids)
				kickAndCheckError(uid, executorID);
		}
	}
};
