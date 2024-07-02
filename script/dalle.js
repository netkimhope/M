const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "dalle",
    version: "1.0.0",
    credits: "chill",
    description: "Generate images",
    hasPrefix: false,
    cooldown: 5,
    aliases: ["dalle"]
};

module.exports.run = async function ({ api, event, args }) {
    try {
        let prompt = args.join(" ");
        if (!prompt) {
            return api.sendMessage("[ ❗ ] - Missing prompt for the DALL-E command", event.threadID, event.messageID);
        }

        api.sendMessage("Generating image, please wait...", event.threadID, async (err, info) => {
            if (err) {
                console.error(err);
                return api.sendMessage("An error occurred while processing your request.", event.threadID);
            }

            try {
                const response = await axios.get(`https://joshweb.click/dalle?prompt=${encodeURIComponent(prompt)}`, { responseType: 'arraybuffer' });
                const imagePath = path.join(__dirname, "dalle_image.png");
                
                fs.writeFileSync(imagePath, response.data);

                const senderName = event.senderID; 

                api.sendMessage({
                    body: `Here is the image you requested:\n\nPrompt: ${prompt}\n\nRequested by: ${senderName}`,
                    attachment: fs.createReadStream(imagePath)
                }, event.threadID, () => {
                    fs.unlinkSync(imagePath);
                });
            } catch (error) {
                console.error(error);
                api.sendMessage("An error occurred while processing your request.", event.threadID);
            }
        });
    } catch (error) {
        console.error("Error in DALL-E command:", error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};
