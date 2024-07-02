const axios = require("axios");

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    credits: "chill",
    description: "Interact with Qwen AI",
    hasPrefix: false,
    cooldown: 3,
    aliases: ["qwen"]
};

module.exports.run = async function ({ api, event, args }) {
    try {
        let q = args.join(" ");
        if (!q) {
            return api.sendMessage("Plss provide a question for example: ai what is nigga?", event.threadID, event.messageID);
        }

        api.sendMessage("Answering, please wait...", event.threadID, async (err, info) => {
            try {
                const response = await axios.get(`https://joshweb.click/ai/qwen1.5-14b?q=${encodeURIComponent(q)}&uid=100`);
                const answer = response.data.result;

                api.sendMessage(answer, event.threadID);
            } catch (error) {
                console.error(error);
                api.sendMessage("An error occurred while processing your request.", event.threadID);
            }
        });
    } catch (error) {
        console.error("Error in qwenn command:", error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};
