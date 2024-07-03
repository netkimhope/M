module.exports.config = {
    name: "netflix",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "Search videos on netflix",
    hasPrefix: false,
    aliases: [ "netflix"],
    usage: "[netflix <prompt>]",
    cooldown: 5
};

const chilli = require("axios");
const pogi = require("fs");
const pogimochill = require("path");

module.exports.run = async function({ api, event, args }) {
    try {
        const cutemochill = args.join(" ");
        if (!cutemochill) {
            api.sendMessage("Usage: pornhub <query>", event.threadID);
            return;
        }

        api.sendMessage("🔍 | Searching netflix, please wait...", event.threadID);

        const chilliResponse = await chilli.get(`https://nash-rest-api.replit.app/pornhubsearch?search=${encodeURIComponent(cutemochill)}`);

        if (chilliResponse.data && chilliResponse.data.videos && chilliResponse.data.videos.length > 0) {
            const pogiResults = chilliResponse.data.videos;
            const pogimochillMessage = "🔞 | Here are the top search results:\n\n";
            const result = pogiResults[0]; // Send only the first result as an example

            api.sendMessage(`${pogimochillMessage}Title: ${result.title}\nLink: ${result.link}\nThumbnail: ${result.thumbnail}`, event.threadID);

            // Download the video
            const videoResponse = await chilli.get(result.link, { responseType: 'arraybuffer' });
            const cutemochillPath = pogimochill.join(__dirname, `/cache/video.mp4`);
            pogi.writeFileSync(cutemochillPath, Buffer.from(videoResponse.data, 'binary'));

          
            api.sendMessage({
                body: "Here is the video:",
                attachment: pogi.createReadStream(cutemochillPath)
            }, event.threadID, () => {
                pogi.unlinkSync(cutemochillPath);
            });
        } else {
            api.sendMessage("No results found for your query.", event.threadID);
        }
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};
