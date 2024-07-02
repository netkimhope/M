

const axios = require("axios");

module.exports.config = {
    name: "box",
    version: "1.0.0",
    credits: "chill",
    description: "Interact with Blackbox AI",
    hasPrefix: false,
    cooldown: 5,
    aliases: []
};

module.exports.run = async function ({ api, event, args }) {

    const query = args.join(" ");
    if (!query) {
        return api.sendMessage("plss provide question for ex:box give me source of love", event.threadID, event.messageID);
    }

    
    api.sendMessage("Blackbox Continues, answering please wait...", event.threadID, async (err, info) => {
        if (err) return console.error("Error sending initial message:", err);

        try {
            
            const response = await axios.get(`https://joshweb.click/api/blackboxai?q=${encodeURIComponent(query)}&uid=100`);
            const answer = response.data.result;

            
            api.sendMessage(answer, event.threadID);
        } catch (error) {
            console.error("Error fetching data from Blackbox AI:", error);
            api.sendMessage("An error occurred while processing your request.", event.threadID);
        }
    });
};
