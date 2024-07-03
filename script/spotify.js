module.exports.config = {
    name: "spotify",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "Search for a song on Spotify",
    hasPrefix: false,
    aliases: ["spotify", "spsearch"],
    usage: "[spotifysearch <song title>]",
    cooldown: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args }) {
    try {
        const query = args.join(" ");
        if (!query) {
            api.sendMessage("Usage: spotifysearch <query>", event.threadID);
            return;
        }

        api.sendMessage("Searching ur song, please wait...", event.threadID);

        const response = await axios.get(`https://hiroshi-rest-api.replit.app/search/spotify?search=${encodeURIComponent(query)}`);
        const songs = response.data;

        if (songs.length > 0) {
            const song = songs[0]; // Take the first song from the search results
            const songTitle = song.title;
            const songArtist = song.artist;
            const songPreview = song.preview_url;

            let messageBody = `🎵 | Song: ${songTitle}\n👤 | Artist: ${songArtist}`;

            if (songPreview) {
                const audioPath = path.join(__dirname, "spotify_preview.mp3");
                const writer = fs.createWriteStream(audioPath);

                const responseStream = await axios({
                    url: songPreview,
                    method: 'GET',
                    responseType: 'stream'
                });

                responseStream.data.pipe(writer);

                writer.on('finish', () => {
                    api.sendMessage({
                        body: messageBody,
                        attachment: fs.createReadStream(audioPath)
                    }, event.threadID, () => {
                        fs.unlinkSync(audioPath); // Clean up the file after sending
                    });
                });

                writer.on('error', (err) => {
                    console.error('Stream writer error:', err);
                    api.sendMessage("An error occurred while processing the request.", event.threadID);
                });
            } else {
                api.sendMessage(`${messageBody}\n\nNo preview available.`, event.threadID);
            }
        } else {
            api.sendMessage("No results found on Spotify.", event.threadID);
        }
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};
