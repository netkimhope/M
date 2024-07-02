const axios = require("axios");

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    credits: "chill",
    description: "Interact with GPT-4 AI",
    hasPrefix: false,
    cooldown: 5,
    aliases: []
};

module.exports.run = async function ({ api, event, args, Users }) {
    const query = args.join(" ");
    if (!query) {
        return api.sendMessage("Plss provide a question fot ex: ai what is nigga?", event.threadID, event.messageID);
    }

    api.sendMessage("GPT-4 Continues, answering please wait...", event.threadID, async (err, info) => {
        if (err) return console.error("Error sending initial message:", err);

        try {
            const response = await axios.get(`https://joshweb.click/gpt4?prompt=${encodeURIComponent(query)}&uid=100`);
            const answer = response.data.result;

            const userName = await Users.getName(event.senderID);

            const reply = `***GPT4-CONTINUES***\n\n${answer}\n\nQuestion asked by: ${userName}`;
            api.sendMessage(reply, event.threadID);
        } catch (error) {
            console.error("Error fetching data from GPT-4 AI:", error);
            api.sendMessage("An error occurred while processing your request.", event.threadID);
        }
    });
};
