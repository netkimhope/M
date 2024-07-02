const axios = require("axios");

module.exports.config = {
    name: "gpt4",
    version: "1.0.0",
    credits: "chill",
    description: "Interact with GPT-4",
    hasPrefix: false,
    cooldown: 5,
    aliases: ["gpt"]
};

module.exports.run = async function ({ api, event, args }) {
    try {
        let chilli = args.join(" ");
        if (!chilli) {
            return api.sendMessage("[ ❗ ] - Missing prompt for the GPT-4 command", event.threadID, event.messageID);
        }

        api.sendMessage("Processing your request, please wait...", event.threadID, async (err, info) => {
            if (err) {
                console.error(err);
                return api.sendMessage("An error occurred while processing your request.", event.threadID);
            }

            try {
                const response = await axios.get(`https://joshweb.click/gpt4?prompt=${encodeURIComponent(chilli)}&uid=${event.senderID}`);
                
                const nognog = await api.getUserInfo(event.senderID);
                const nigga = nognog[event.senderID].name;

                api.sendMessage({
                    body: `Answer from GPT-4:\n\n${response.data}\n\nRequested by: ${nigga}`
                }, event.threadID);
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
