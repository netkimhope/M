const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "randomedit",
    version: "1.0.0",
    role: 0,
    credits: "chilli",
    description: "Fetch a random edited video",
    hasPrefix: false,
    aliases: ["random", "randomedit"],
    usage: "[editvideo]",
    cooldown: 5,
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;

    try {
        api.sendMessage("⏱️ | Fetching a random edited video, please wait...", threadID);

        // Fetch random edited video data from API
        const response = await axios.get("https://cc-project-apis-jonell-magallanes.onrender.com/api/edit");
        const videoData = response.data.data;

        console.log('API Response:', response.data);  // Log the complete API response

        // Check if video data exists
        if (!videoData || !videoData.play) {
            return api.sendMessage("No edited video found.", threadID, messageID);
        }

        const videoUrl = videoData.play;
        const message = `𝐇𝐞𝐫𝐞’𝐬 𝐲𝐨𝐮𝐫 𝐫𝐚𝐧𝐝𝐨𝐦 𝐞𝐝𝐢𝐭𝐞𝐝 𝐯𝐢𝐝𝐞𝐨:\n\n𝐓𝐢𝐭𝐥𝐞: ${videoData.title}\n𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧: ${videoData.description}`;

        // Prepare to download video
        const filePath = path.join(__dirname, 'cache', 'edit_video.mp4');
        const writer = fs.createWriteStream(filePath);

        const videoResponse = await axios({
            method: 'get',
            url: videoUrl,
            responseType: 'stream'
        });

        // Pipe the video data to the file writer
        videoResponse.data.pipe(writer);

        // On successful download
        writer.on('finish', () => {
            api.sendMessage(
                { body: message, attachment: fs.createReadStream(filePath) },
                threadID,
                () => fs.unlinkSync(filePath)  // Delete the file after sending
            );
        });

        // On error during file writing
        writer.on('error', (err) => {
            console.error('Error writing video file:', err);
            api.sendMessage("An error occurred while processing the video.", threadID, messageID);
        });
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", threadID, messageID);
    }
};
