const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "remini",
    version: "1.0",
    description: "Image Enhancer",
    usages: "Reply to a photo to enhance image",
    cooldown: 3,
};

module.exports.handleEvent = async function({ api, event }) {
    const { threadID, messageID, messageReply } = event;
    const photoUrl = messageReply?.attachments[0]?.url;
    
    if (!photoUrl) {
        api.sendMessage("Please reply to a photo to proceed with enhancing the image.", threadID, messageID);
        return;
    }

    api.sendMessage("Enhancing image, please wait...", threadID, async () => {
        try {
            const response = await axios.get(`https://markdevs69-1efde24ed4ea.herokuapp.com/api/remini?inputImage=${encodeURIComponent(photoUrl)}`);
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
            api.sendMessage(`Error while processing image: ${error.message}`, threadID, messageID);
        }
    });
};

module.exports.run = async function({ api, event }) {};
