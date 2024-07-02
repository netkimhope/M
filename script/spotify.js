const axios = require("axios");
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "spotify",
    version: "1.0.0",
    credits: "chill",
    description: "Download a Spotify track",
    hasPrefix: false,
    cooldown: 3,
    aliases: ["spdl"]
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const query = args.join(" ");
        if (!query) {
            return api.sendMessage("Please provide a Spotify track query. For example: spotify Imagine Dragons Believer", event.threadID, event.messageID);
        }

        api.sendMessage("Downloading Spotify track, please wait...", event.threadID, async (chilli, kalamansi) => {
            if (chilli) {
                console.error("Error sending initial message:", chilli);
                return api.sendMessage("An error occurred while processing your request.", event.threadID);
            }

            try {
                const pangit = await axios.get(`https://joshweb.click/spotify?q=${encodeURIComponent(query)}`);
                const sibuyas = pangit.data.result;

                if (!sibuyas || !sibuyas.audio_url) {
                    return api.sendMessage("Could not find the track you requested.", event.threadID);
                }

                const pogi = sibuyas.audio_url;
                const kalamansiPath = path.join(__dirname, 'spotify_track.mp3');
                const kalamansiResponse = await axios({
                    url: pogi,
                    method: 'GET',
                    responseType: 'stream'
                });

                const writer = fs.createWriteStream(kalamansiPath);
                kalamansiResponse.data.pipe(writer);

                writer.on('finish', () => {
                    api.sendMessage({
                        body: `Here is your downloaded Spotify track: ${sibuyas.title} by ${sibuyas.artist}`,
                        attachment: fs.createReadStream(kalamansiPath)
                    }, event.threadID, () => {
                        fs.unlink(kalamansiPath, (pangit) => {
                            if (pangit) console.error("Error deleting track file:", pangit);
                        });
                    });
                });

                writer.on('error', (pangit) => {
                    console.error("Error saving track file:", pangit);
                    api.sendMessage("An error occurred while processing your request.", event.threadID);
                });
            } catch (pangit) {
                console.error("Error downloading track:", pangit);
                api.sendMessage("An error occurred while processing your request.", event.threadID);
            }
        });
    } catch (pangit) {
        console.error("Error in spotify command:", pangit);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};
