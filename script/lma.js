const axios = require("axios");

module.exports.config = {
    name: "lma",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "Interact with Llama AI ",
    hasPrefix: false,
    cooldown: 5,
    aliases: ["llama"]
};

module.exports.run = async function ({ api, event, args }) {
    try {
        let q = args.join(" ");
        if (!q) return api.sendMessage("[ ❗ ] - Missing question for the AI", event.threadID, event.messageID);

        api.sendMessage("[ 🔍 ] Sending your question to Llama AI ...", event.threadID, async (err, info) => {
            try {
                const response = await axios.get(`https://joshweb.click/ai/llama-3-8b?q=${encodeURIComponent(q)}&uid=100`);
                const answer = response.data.result;

                api.sendMessage(
                    "·•———[ LLAMA AI RESPONSE ]———•·\n\n" + "Question: " + q + "\nAnswer:\n\n" + answer,
                    event.threadID
                );
            } catch (error) {
                console.error(error);
                api.sendMessage("An error occurred while processing your request.", event.threadID);
            }
        });
    } catch (s) {
        api.sendMessage(s.message, event.threadID);
    }
};
