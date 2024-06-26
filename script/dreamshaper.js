const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: 'dreamshaper',
    version: '1.0.0',
    role: 0,
    hasPrefix: false,
    aliases: ['dreamshaper', 'ds'],
    description: 'Generate base sa prompt mo',
    usage: 'dreamshaper <prompt>',
    credits: 'churchill',
    cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
    const prompt = args.join(' ');

    if (!prompt) {
        api.sendMessage('Please provide a prompt, for example: dreamshaper dog', event.threadID, event.messageID);
        return;
    }

    api.sendMessage('🔄 Generating image, please wait...', event.threadID, event.messageID);

    try {
        const response = await axios.get('https://deku-rest-api-gadz.onrender.com/dreamshaper', {
            params: { prompt }
        });
        const imageUrl = response.data.url;

        const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });
        const imagePath = path.join(__dirname, 'temp_image.jpg');
        const writer = fs.createWriteStream(imagePath);

        imageResponse.data.pipe(writer);

        writer.on('finish', () => {
            api.sendMessage({
                body: `Here is your : ${prompt}`,
                attachment: fs.createReadStream(imagePath)
            }, event.threadID, event.messageID, () => {
                fs.unlinkSync(imagePath);
            });
        });

        writer.on('error', (err) => {
            console.error('Error writing image:', err);
            api.sendMessage('An error occurred while generating the image.', event.threadID, event.messageID);
        });

    } catch (error) {
        console.error('Error:', error);
        api.sendMessage('An error occurred while generating the image.', event.threadID, event.messageID);
    }
};
