const axios = require("axios");

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    credits: "chill",
    description: "Interact with GPT-4 ",
    hasPrefix: false,
    cooldown: 5,
    aliases: ["gpt4"]
};

module.exports.run = async function ({ api, event, args }) {
    try {
        let prompt = args.join(" ");
        if (!prompt) {
            return api.sendMessage("Missing question for the ai", event.threadID, event.messageID);
        }

        api.sendMessage("Processing your request, please wait...", event.threadID, async (err, info) => {
            if (err) {
                console.error(err);
                return api.sendMessage("An error occurred while processing your request.", event.threadID);
            }

            try {
                const response = await axios.get(`https://joshweb.click/gpt4?prompt=${encodeURIComponent(prompt)}&uid=100`);
                const answer = response.data.result;
                const senderName = event.senderID; 

                api.sendMessage(`${answer}\n\nQuestion asked by: ${senderName}`, event.threadID);
            } catch (error) {
                console.error(error);
                api.sendMessage("An error occurred while processing your request.", event.threadID);
            }
        });
    } catch (error) {
        console.error("Error in GPT-4 command:", error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};
