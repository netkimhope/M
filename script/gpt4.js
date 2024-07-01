const axios = require("axios");

module.exports.config = {
    name: "gpt4",
    version: "1.0.0",
    role: 0,
    credits: "chilli",
    description: "Interact with GPT-4",
    hasPrefix: false,
    cooldown: 5,
    aliases: ["gpt4"]
};

module.exports.run = async function ({ api, event, args }) {
    try {
        let prompt = args.join(" ");
        if (!prompt) {
            return api.sendMessage("[ ❗ ] - Missing prompt for GPT-4", event.threadID, event.messageID);
        }

        api.sendMessage("📦 𝙶𝙿𝚃-4+ 𝙲𝙾𝙽𝚃𝙸𝙽𝚄𝙴𝚂 𝙰𝙸\n━━━━━━━━━━━━━━━━━━\n", event.threadID);

        api.sendMessage("[ 🔍 ] Sending your prompt to GPT-4 ...", event.threadID, async (err, info) => {
            if (err) {
                console.error("Error sending initial message:", err);
                return api.sendMessage("An error occurred while sending your request.", event.threadID, event.messageID);
            }

            try {
                const response = await axios.get(`https://joshweb.click/gpt4?prompt=${encodeURIComponent(prompt)}&uid=100`);
                const answer = response.data.result;

                api.sendMessage(answer, event.threadID, event.messageID);
            } catch (error) {
                console.error("Error fetching GPT-4 response:", error);
                api.sendMessage("An error occurred while fetching the GPT-4 response.", event.threadID, event.messageID);
            }
        });
    } catch (error) {
        console.error("Unexpected error in gpt4 command:", error);
        api.sendMessage("An unexpected error occurred.", event.threadID, event.messageID);
    }
};
