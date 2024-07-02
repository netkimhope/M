const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "randomgore",
    version: "1.0.0",
    credits: "chill",
    description: "Send a random gore video",
    hasPrefix: false,
    cooldown: 5,
    aliases: ["gore"]
};

module.exports.run = async function ({ api, event }) {
    try {
        api.sendMessage("Fetching a random gore video, please wait...", event.threadID, async (pangit, chillli) => {
            if (pangit) return console.error(pangit);

            try {
                const pogi = await axios.get('https://joshweb.click/api/randgre', { responseType: 'stream' });
                const videoPath = path.join(__dirname, "randomgore.mp4");
                const writer = fs.createWriteStream(videoPath);

                pogi.data.pipe(writer);

                writer.on('finish', () => {
                    const message = {
                        body: "Here's a random gore video:",
                        attachment: fs.createReadStream(videoPath)
                    };
                    api.sendMessage(message, event.threadID, () => {
                        fs.unlinkSync(videoPath); 
                    });
                });

                writer.on('error', (pangit) => {
                    console.error(pangit);
                    api.sendMessage("An error occurred while downloading the video.", event.threadID);
                });
            } catch (pangit) {
                console.error(pangit);
                api.sendMessage("An error occurred while fetching the video.", event.threadID);
            }
        });
    } catch (pangit) {
        console.error("Error in randomgore command:", pangit);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};
