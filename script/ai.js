const axios = require("axios");

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    credits: "chill",
    description: "Interact with GPT4",
    hasPrefix: false,
    cooldown: 5,
    aliases: ["gpt"]
};

module.exports.run = async function ({ api, event, args }) {
    try {
        let prompt = args.join(" ");
        if (!prompt) {
            return api.sendMessage("[ ❗ ] - Missing prompt for the GPT-4 command", event.threadID, event.messageID);
        }

        api.sendMessage("Processing your request, please wait...", event.threadID, async (err, info) => {
            if (err) {
                console.error(err);
                return api.sendMessage("An error occurred while processing your request.", event.threadID);
            }

            try {
                // Fetch the user's name
                api.getUserInfo(event.senderID, async (err, ret) => {
                    if (err) {
                        console.error(err);
                        return api.sendMessage("An error occurred while retrieving your information.", event.threadID);
                    }

                    const senderName = ret[event.senderID].name;

                    // Make the GPT-4 API request
                    const response = await axios.get(`https://joshweb.click/gpt4?prompt=${encodeURIComponent(prompt)}&uid=100`);
                    const answer = response.data.result;

                    api.sendMessage(`${answer}\n\nQuestion asked by: ${senderName}`, event.threadID);
                });
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
