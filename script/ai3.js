const axios = require("axios");

module.exports.config = {
    name: "ai3",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "Interact with Llama AI",
    hasPrefix: false,
    cooldown: 5,
    aliases: ["llama"]
};

module.exports.run = async function ({ api, event, args, Users }) {
    try {
        let q = args.join(" ");
        if (!q) return api.sendMessage("[ ❗ ] - Missing question for the llma", event.threadID, event.messageID);

        api.sendMessage("[ 🔍 ]Llama AI answer ur question...", event.threadID, async (err, info) => {
            try {
                const response = await axios.get(`https://joshweb.click/ai/llama-3-8b?q=${encodeURIComponent(q)}&uid=100`);
                const answer = response.data.result;
                const userName = await Users.getNameUser(event.senderID);

                const message = `📦 𝙻𝙻𝙰𝙼𝙰+ 𝙲𝙾𝙽𝚃𝙸𝙽𝚄𝙴𝚂 𝙰𝙸
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
