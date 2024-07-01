const axios = require("axios");

module.exports.config = {
    name: "box",
    version: "1.0.0",
    credits: "chill",
    description: "Interact with BlackBox AI in different formats",
    hasPrefix: false,
    cooldown: 5,
    aliases: []
};

module.exports.run = async function ({ api, event, args }) {
    try {
        let q = args.join(" ");
        if (!q) {
            return api.sendMessage("[ ❗ ] - Missing input for the box command", event.threadID, event.messageID);
        }

        api.sendMessage("Processing your request, please wait...", event.threadID, async (err, info) => {
            try {
                const response = await axios.get(`https://joshweb.click/api/blackboxai?q=${encodeURIComponent(q)}&uid=100`);
                const { result, format } = response.data;

                let answer = "";

                // Handling different response formats based on the API documentation
                switch (format) {
                    case "text":
                        answer = result.text;
                        break;
                    case "image":
                        answer = result.imageUrl;
                        break;
                    case "link":
                        answer = result.linkUrl;
                        break;
                    default:
                        answer = "Unsupported format received from API.";
                        break;
                }

                api.sendMessage(answer, event.threadID);
            } catch (error) {
                console.error(error);
                api.sendMessage("An error occurred while processing your request.", event.threadID);
            }
        });
    } catch (error) {
        console.error("Error in box command:", error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};
