const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "remini",
  version: "6.9",
  hasPermision: 0,
  credits: "chill",
  description: "Image Enhancer",
  usePrefix: false,
  usages: "Reply to a photo to enhance image",
  cooldown: 3,
};

let reminderSent = {};

module.exports.handleEvent = async function({ api, event }) {
    const { threadID, messageID, messageReply, body } = event;

    // Check if the message starts with "remini"
    if (!body || !body.toLowerCase().startsWith("remini")) return;

    // Check if the message is a reply and if it contains a photo attachment
    const photoUrl = messageReply?.attachments[0]?.url;

    if (!photoUrl) {
        if (!reminderSent[threadID]) {
            reminderSent[threadID] = true;
            api.sendMessage("Please reply to a photo to proceed with enhancing the image.", threadID, messageID);
        }
        return;
    }

    reminderSent[threadID] = false;

    api.sendMessage("Enhancing image, please wait...", threadID, async () => {
        try {
            const response = await axios.get(`https://markdevs69-1efde24ed4ea.herokuapp.com/api/remini?inputImage=${encodeURIComponent(photoUrl)}`, {
                responseType: 'arraybuffer'
            });

            const imageBuffer = Buffer.from(response.data, 'binary');
            const filename = path.join(__dirname, 'enhanced_image.jpg');
            fs.writeFileSync(filename, imageBuffer);

            api.sendMessage({
                body: "Successfully enhanced your image.",
                attachment: fs.createReadStream(filename)
            }, threadID, () => {
                fs.unlinkSync(filename);
            }, messageID);
        } catch (error) {
            console.error("Error while processing image:", error);
            api.sendMessage(`Error while processing image: ${error.message}`, threadID, messageID);
        }
    });
};

module.exports.run = async function({ api, event }) {};
