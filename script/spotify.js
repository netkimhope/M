module.exports.config = {
    name: "spotify",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "Search for a track on Spotify and send it as an MP3 file",
    hasPrefix: false,
    aliases: ["spotsearch", "spotify"],
    usage: "[spotify <song>]",
    cooldown: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args }) {
    try {
        const query = args.join(" ");
        if (!query) {
            api.sendMessage("Usage: spotify <song>", event.threadID);
            return;
        }

        api.sendMessage("Searching for your track, please wait...", event.threadID);

        const response = await axios.get(`https://hiroshi-rest-api.replit.app/search/spotify?search=${encodeURIComponent(query)}`);
        const results = response.data;

        if (results.length > 0) {
            const track = results[0]; // Take the first track from the search results
            const trackName = track.name;
            const trackLink = track.track;
            const downloadLink = track.download;
            const trackImage = track.image;

            const trackPath = path.join(__dirname, "track.mp3");

            // Download the track using the provided download link
            const trackStream = await axios({
                url: downloadLink,
                method: 'GET',
                responseType: 'stream'
            });

            const writer = fs.createWriteStream(trackPath);
            trackStream.data.pipe(writer);

            writer.on('finish', () => {
                const messageBody = `🎵 | Track: ${trackName}\n🔗 | Link: ${trackLink}\n🖼 | Image: ${trackImage}`;

                api.sendMessage({
                    body: messageBody,
                    attachment: fs.createReadStream(trackPath)
                }, event.threadID, () => {
                    fs.unlinkSync(trackPath); // Clean up the file after sending
                });
            });

            writer.on('error', (err) => {
                console.error('Stream writer error:', err);
                api.sendMessage("An error occurred while processing the request.", event.threadID);
            });
        } else {
            api.sendMessage("No results found on Spotify.", event.threadID);
        }
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};
