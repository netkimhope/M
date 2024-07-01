const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
    name: "kanta",
    version: "1.0",
    hasPermission: 0,
    credits: "chilll",
    description: "chilling",
    usages: "kanta song name",
    cooldown: 3,
};

module.exports.handleEvent = async function ({ api, event }) {
    const { body, threadID, messageID } = event;
    if (!body || !body.startsWith("spotify")) return;

    const songQuery = body.slice(8).trim();
    if (!songQuery) {
        api.sendMessage("Please provide a song name.", threadID, messageID);
        return;
    }

    api.sendMessage("🔍 Searching for your song, please wait...", threadID, async () => {
        try {
            const response = await axios.get(`https://markdevs69-1efde24ed4ea.herokuapp.com/search/spotify?q=${encodeURIComponent(songQuery)}`);
            const songURL = response.data.audioUrl;
            const songAuthor = response.data.author;
            const songTitle = response.data.title;

            const songPath = `./cache/${songTitle.replace(/ /g, '_')}.mp3`;
            const songResponse = await axios.get(songURL, { responseType: 'arraybuffer' });
            fs.writeFileSync(songPath, songResponse.data);

            api.sendMessage({
                body: `🎵 Now playing: ${songTitle} by ${songAuthor}`,
                attachment: fs.createReadStream(songPath)
            }, threadID, () => fs.unlinkSync(songPath), messageID);
        } catch (error) {
            api.sendMessage(`❌ Error fetching song: ${error.message}`, threadID, messageID);
        }
    });
};

module.exports.run = async function ({ api, event }) {
    // This function can be left empty
};
