const axios = require("axios");
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "randomhentai",
    version: "1.0.0",
    credits: "chill",
    description: "Send a random hentai video",
    hasPrefix: false,
    cooldown: 3,
    aliases: ["randhntai"]
};

module.exports.run = async function ({ api, event }) {
    try {
        api.sendMessage("Fetching a random hentai video, please wait...", event.threadID, async (err, info) => {
            if (err) {
                console.error("Error sending initial message:", err);
                return api.sendMessage("An error occurred while processing your request.", event.threadID);
            }

            try {
                // Make the API request to get a random hentai video
                const response = await axios.get('https://joshweb.click/api/randhntai');
                const videoData = response.data.result[0];

                // Extract the video URL and title
                const videoUrl = videoData.video_1;
                const videoTitle = videoData.title;

                // Download the video
                const videoPath = path.join(__dirname, 'random_hentai_video.mp4');
                const videoResponse = await axios({
                    url: videoUrl,
                    method: 'GET',
                    responseType: 'stream'
                });

                
                const writer = fs.createWriteStream(videoPath);
                videoResponse.data.pipe(writer);

                writer.on('finish', () => {
                    
                    api.sendMessage({
                        body: `Here is a random hentai video: ${videoTitle}`,
                        attachment: fs.createReadStream(videoPath)
                    }, event.threadID, () => {
                        
                        fs.unlink(videoPath, (err) => {
                            if (err) console.error("Error deleting video file:", err);
                        });
                    });
                });

                writer.on('error', (err) => {
                    console.error("Error saving video file:", err);
                    api.sendMessage("An error occurred while processing your request.", event.threadID);
                });
            } catch (error) {
                console.error("Error fetching video:", error);
                api.sendMessage("An error occurred while processing your request.", event.threadID);
            }
        });
    } catch (error) {
        console.error("Error in randomhentai command:", error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};
