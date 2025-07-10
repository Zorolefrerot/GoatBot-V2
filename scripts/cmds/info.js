
const axios = require('axios');

module.exports = {
	config: {
		name: "info",
		aliases: ["profile", "profil"],
		version: "1.0",
		author: "Votre nom",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "Xem thông tin người dùng",
			en: "View user information"
		},
		longDescription: {
			vi: "Xem thông tin chi tiết của người dùng Facebook",
			en: "View detailed Facebook user information"
		},
		category: "info",
		guide: {
			vi: "{pn} [tag người dùng hoặc để trống để xem thông tin của bạn]",
			en: "{pn} [tag user or leave blank to view your info]"
		}
	},

	langs: {
		vi: {
			loading: "Đang tải thông tin...",
			error: "Không thể lấy thông tin người dùng",
			userInfo: "📋 THÔNG TIN NGƯỜI DÙNG",
			name: "👤 Tên",
			firstName: "📝 Tên đầu",
			birthday: "🎂 Sinh nhật",
			gender: "⚧ Giới tính",
			relationship: "💕 Tình trạng",
			location: "📍 Vị trí",
			hometown: "🏠 Quê quán",
			bio: "📖 Tiểu sử",
			work: "💼 Công việc",
			education: "🎓 Học vấn",
			profileUrl: "🔗 Link profile",
			userId: "🆔 User ID",
			accountCreated: "📅 Tài khoản tạo",
			friends: "👥 Bạn bè",
			noInfo: "Không có thông tin",
			male: "Nam",
			female: "Nữ",
			other: "Khác"
		},
		en: {
			loading: "Loading information...",
			error: "Unable to get user information",
			userInfo: "📋 USER INFORMATION",
			name: "👤 Name",
			firstName: "📝 First Name", 
			birthday: "🎂 Birthday",
			gender: "⚧ Gender",
			relationship: "💕 Relationship",
			location: "📍 Location",
			hometown: "🏠 Hometown",
			bio: "📖 Bio",
			work: "💼 Work",
			education: "🎓 Education",
			profileUrl: "🔗 Profile URL",
			userId: "🆔 User ID",
			accountCreated: "📅 Account Created",
			friends: "👥 Friends",
			noInfo: "No information",
			male: "Male",
			female: "Female",
			other: "Other"
		}
	},

	onStart: async function ({ message, event, args, getLang, api }) {
		try {
			// Déterminer l'ID utilisateur
			let targetUserID = event.senderID;
			
			// Si quelqu'un est tagué, utiliser son ID
			if (Object.keys(event.mentions).length > 0) {
				targetUserID = Object.keys(event.mentions)[0];
			}
			// Si un ID est fourni en argument
			else if (args[0] && !isNaN(args[0])) {
				targetUserID = args[0];
			}

			// Message de chargement
			const loadingMsg = await message.reply(getLang("loading"));

			try {
				// Récupérer les informations utilisateur via l'API Facebook
				const userInfo = await api.getUserInfo(targetUserID);
				const userData = userInfo[targetUserID];

				if (!userData) {
					return message.reply(getLang("error"));
				}

				// Construire le message d'information
				let infoMessage = `${getLang("userInfo")}\n`;
				infoMessage += `━━━━━━━━━━━━━━━━━━━\n\n`;

				// Nom
				if (userData.name) {
					infoMessage += `${getLang("name")}: ${userData.name}\n`;
				}

				// Prénom
				if (userData.firstName) {
					infoMessage += `${getLang("firstName")}: ${userData.firstName}\n`;
				}

				// ID utilisateur
				infoMessage += `${getLang("userId")}: ${targetUserID}\n`;

				// Genre
				if (userData.gender) {
					let genderText = getLang("other");
					if (userData.gender === 1) genderText = getLang("female");
					else if (userData.gender === 2) genderText = getLang("male");
					infoMessage += `${getLang("gender")}: ${genderText}\n`;
				}

				// URL du profil
				if (userData.profileUrl) {
					infoMessage += `${getLang("profileUrl")}: ${userData.profileUrl}\n`;
				}

				// Nom alternatif (nom d'utilisateur)
				if (userData.alternateName) {
					infoMessage += `📛 Username: ${userData.alternateName}\n`;
				}

				// Vanity URL
				if (userData.vanity) {
					infoMessage += `🔗 Vanity: facebook.com/${userData.vanity}\n`;
				}

				// Type de compte
				if (userData.type) {
					infoMessage += `📋 Type: ${userData.type}\n`;
				}

				// Statut d'amitié
				if (userData.isFriend !== undefined) {
					infoMessage += `👥 Ami: ${userData.isFriend ? "Oui" : "Non"}\n`;
				}

				// Anniversaire
				if (userData.isBirthday) {
					infoMessage += `🎂 ${getLang("birthday")}: Aujourd'hui ! 🎉\n`;
				}

				infoMessage += `\n━━━━━━━━━━━━━━━━━━━`;

				// Préparer la photo de profil
				let attachment = null;
				if (userData.thumbSrc) {
					try {
						attachment = await global.utils.getStreamFromURL(userData.thumbSrc);
					} catch (error) {
						console.log("Erreur lors du téléchargement de la photo:", error);
					}
				}

				// Supprimer le message de chargement
				api.unsendMessage(loadingMsg.messageID);

				// Envoyer la réponse avec ou sans photo
				const messageData = {
					body: infoMessage
				};

				if (attachment) {
					messageData.attachment = attachment;
				}

				return message.reply(messageData);

			} catch (apiError) {
				console.error("Erreur API:", apiError);
				
				// Supprimer le message de chargement
				api.unsendMessage(loadingMsg.messageID);

				// Message d'information basique en cas d'échec
				let basicInfo = `${getLang("userInfo")}\n`;
				basicInfo += `━━━━━━━━━━━━━━━━━━━\n\n`;
				basicInfo += `${getLang("userId")}: ${targetUserID}\n`;
				basicInfo += `${getLang("profileUrl")}: https://facebook.com/${targetUserID}\n`;
				basicInfo += `\n⚠️ Informations limitées disponibles`;

				return message.reply(basicInfo);
			}

		} catch (error) {
			console.error("Erreur générale:", error);
			return message.reply(getLang("error"));
		}
	}
};
