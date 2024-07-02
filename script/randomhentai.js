const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "randomhentai",
    version: "1.0.0",
    role: 0,
    credits: "chilli", 
    description: "Send a random hentai video",
    hasPrefix: false,
    aliases: ["randhentai", "rh"],
    usage: "[randomhentai]",
    cooldown: 5,
};

module.exports.run = async function ({ api, event }) {
    try {
        api.sendMessage("⏱️ | Fetching a random hentai video, please wait...", event.threadID);

        const response = await axios.get('https://joshweb.click/api/randhntai');
        const result = response.data.result;

        if (!result || result.length === 0) {
            api.sendMessage("No hentai videos found.", event.threadID);
            return;
        }

        // Choose a random video from the result
        const randomVideo = result[Math.floor(Math.random() * result.length)];

        if (!randomVideo || !randomVideo.video_1) {
            api.sendMessage("No valid hentai video found.", event.threadID);
            return;
        }

        const videoUrl = randomVideo.video_1;
        const message = `Title: ${randomVideo.title}\nCategory: ${randomVideo.category}\nViews: ${randomVideo.views_count}\nShares: ${randomVideo.share_count}\nType: ${randomVideo.type}\n\nLink: ${randomVideo.link}`;

        const filePath = path.join(__dirname, `/cache/hentai_video.mp4`);
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
