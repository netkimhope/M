module.exports.config = {
    name: "hentaigif",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "Send a random hentai GIF",
    hasPrefix: false,
    aliases: ["hentaigif"],
    usage: "[randomhentaigif]",
    cooldown: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event }) {
    try {
        api.sendMessage("Sending giff taglibog, please wait...", event.threadID);

        const response = await axios.get("https://nash-rest-api.replit.app/hentai-gif");

        if (response.data && response.data.url) {
            const gifUrl = response.data.url;
            const gifPath = path.join(__dirname, "random_hentai_gif.gif");
            
            const writer = fs.createWriteStream(gifPath);
            const responseStream = await axios({
                url: gifUrl,
                method: 'GET',
                responseType: 'stream'
            });

            responseStream.data.pipe(writer);

            writer.on('finish', () => {
                api.sendMessage({
                    body: "Eto manyak:",
                    attachment: fs.createReadStream(gifPath)
                }, event.threadID, () => {
                    fs.unlinkSync(gifPath); // Clean up the file after sending
                });
            });

            writer.on('error', (err) => {
                console.error('Stream writer error:', err);
                api.sendMessage("An error occurred while processing the request.", event.threadID);
            });

        } else {
            api.sendMessage("No GIF found, please try again later.", event.threadID);
        }
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};
