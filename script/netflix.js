const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "netflix",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "Send a random netflix video",
    hasPrefix: false,
    aliases: ["netflix", "net"],
    usage: "[pornhub]",
    cooldown: 5,
};

module.exports.run = async function ({ api, event }) {
    try {
        api.sendMessage("⏱ |Fetching a netflix video, please wait...", event.threadID);

        const response = await axios.get('https://nash-rest-api.replit.app/pornhub');
        const videoData = response.data;

        if (!videoData || !videoData.video) {
            api.sendMessage("No Pornhub video found.", event.threadID);
            return;
        }

        const { title, views, duration, video } = videoData;

        const message = `Title: ${title}\nViews: ${views}\nDuration: ${duration}`;

        const filePath = path.join(__dirname, `/cache/pornhub_video.mp4`);
        const writer = fs.createWriteStream(filePath);

        const videoResponse = await axios({
            method: 'get',
            url: video,
            responseType: 'stream'
        });

        videoResponse.data.pipe(writer);

        writer.on('finish', () => {
            api.sendMessage(
                { body: message, attachment: fs.createReadStream(filePath) },
                event.threadID,
                () => fs.unlinkSync(filePath)
            );
        });

        writer.on('error', () => {
            api.sendMessage("An error occurred while downloading the video.", event.threadID);
        });

    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};
