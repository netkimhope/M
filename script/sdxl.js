const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "sdxl",
    version: "1.0.0",
    credits: "chill",
    description: "Generate images using SDXL API",
    hasPrefix: false,
    cooldown: 5,
    aliases: ["sdxl"]
};

module.exports.run = async function ({ api, event, args }) {
    try {
        if (args.length < 2) {
            return api.sendMessage("[ ❗ ] - Missing query or style for the SDXL command. Usage: sdxl <query> <style>", event.threadID, event.messageID);
        }

        const query = args.slice(0, -1).join(" ");
        const style = args[args.length - 1];
        const validStyles = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];

        if (!validStyles.includes(style)) {
            return api.sendMessage("[ ❗ ] - Invalid style. Please choose a valid style number from 1 to 13.", event.threadID, event.messageID);
        }

        api.sendMessage("Generating image, please wait...", event.threadID, async (err) => {
            if (err) {
                console.error(err);
                return api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
            }

            try {
                const response = await axios.get(`https://joshweb.click/sdxl`, {
                    params: {
                        q: query,
                        style: style
                    },
                    responseType: 'arraybuffer'
                });

                const imagePath = path.join(__dirname, "sdxl_image.png");
                fs.writeFileSync(imagePath, response.data);

                api.sendMessage({
                    body: `Here is the image you requested:\n\nQuery: ${query}\nStyle: ${style}`,
                    attachment: fs.createReadStream(imagePath)
                }, event.threadID, () => {
                    fs.unlinkSync(imagePath);
                });
            } catch (error) {
                console.error("API request error:", error);
                api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
            }
        });
    } catch (error) {
        console.error("Error in SDXL command:", error);
        api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
    }
};
