const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "randomgore",
    version: "1.0.0",
    role: 0,
    credits: "chill", 
    description: "Send a random gore video",
    hasPrefix: false,
    aliases: ["randgore", "rg"],
    usage: "[randomgore]",
    cooldown: 5,
};

module.exports.run = async function ({ api, event }) {
    try {
        api.sendMessage("⏱️ | Fetching a random gore video, please wait...", event.threadID);

        const response = await axios.get('https://joshweb.click/api/randgre');
        const result = response.data.result;

        if (!result || result.length === 0) {
            api.sendMessage("No gore videos found.", event.threadID);
            return;
        }

        // Get video information
        const videoTitle = result.title;
        const videoSource = result.source;
        const videoViews = result.view;
        const videoComments = result.comment;
        const videoVotes = result.vote;
        const videoUrl = result.video1;

        if (!videoUrl) {
            api.sendMessage("No valid gore video found.", event.threadID);
            return;
        }

        const message = `Title: ${videoTitle}\nSource: ${videoSource}\nViews: ${videoViews}\nComments: ${videoComments}\nVotes: ${videoVotes}`;

        const filePath = path.join(__dirname, `/cache/gore_video.mp4`);
        const writer = fs.createWriteStream(filePath);

        const videoResponse = await axios({
            method: 'get',
            url: videoUrl,
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
