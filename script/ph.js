const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "ph",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "Send a cute video ",
    hasPrefix: false,
    aliases: [ "ph"],
    usage: "[phub]",
    cooldown: 5
};

module.exports.run = async function({ api, event }) {
    try {
        const url = "https://nash-rest-api.replit.app/pornhub";
        const response = await axios.get(url);

        const { title, link } = response.data;

        if (!title || !link) {
            api.sendMessage("No video found.", event.threadID);
            return;
        }

        // Download the video
        const videoPath = path.join(__dirname, "video.mp4");
        const videoResponse = await axios.get(link, { responseType: 'stream' });
        const writer = fs.createWriteStream(videoPath);

        videoResponse.data.pipe(writer);

        writer.on('finish', async () => {
            const message = {
                body: `Title: ${title}`,
                attachment: fs.createReadStream(videoPath)
            };

            api.sendMessage(message, event.threadID, () => {
                // Clean up the downloaded video file
                fs.unlinkSync(videoPath);
            });
        });

        writer.on('error', () => {
            api.sendMessage("An error occurred while downloading the video.", event.threadID);
        });

    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};
