const axios = require("axios");

module.exports.config = {
    name: "ai2",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "gpt4",
    hasPrefix: false,
    cooldown: 5,
    aliases: ["gpt4"]
};

module.exports.run = async function ({ api, event, args, Users }) {
    try {
        let prompt = args.join(" ");
        if (!prompt) return api.sendMessage("[ ❗ ] - use gpt4 like this ai2 what is love ", event.threadID, event.messageID);

        api.sendMessage("[ 🔍 ] Answering plss waittt...", event.threadID, async (err, info) => {
            try {
                const response = await axios.get(`https://joshweb.click/gpt4?prompt=${encodeURIComponent(prompt)}&uid=100`);
                const answer = response.data.result;
                const userName = await Users.getNameUser(event.senderID);

                const message = `📦 𝙶𝙿𝚃4+ 𝙲𝙾𝙽𝚃𝙸𝙽𝚄𝙴𝚂 𝙰𝙸
━━━━━━━━━━━━━━━━━━
${answer}
━━━━━━━━━━━━━━━━━━
👤 𝙰𝚜𝚔𝚎𝚍 𝚋𝚢: ${userName}`;

                api.sendMessage(message, event.threadID);
            } catch (error) {
                console.error(error);
                api.sendMessage("An error occurred while processing your request.", event.threadID);
            }
        });
    } catch (s) {
        api.sendMessage(s.message, event.threadID);
    }
};
