module.exports = {
    config: {
        name: "ok",
        version: "1.0",
        author: "kivv",
        countDown: 5,
        role: 0,
        shortDescription: " 😒 Monkey-🙊🙈",
        longDescription: "No Prefix",
        category: "reply",
    },
onStart: async function(){}, 
onChat: async function({
    event,
    message,
    getLang
}) {
    if (event.body && event.body.toLowerCase() == "ok") return message.reply("�𝗢𝗻 𝘁'𝗮𝘀 𝗱𝗲𝗷𝗮 𝗱𝗶𝘁 𝗾𝘂𝗲 𝘁'𝗲𝘀 𝘃𝗶𝗹𝗮𝗶𝗻?🙃");
}
};
