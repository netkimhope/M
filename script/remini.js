const axios = require('axios');
const fs = require('fs');

module.exports.config = {
  name: 'remini',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['4k', 'remini'],
  description: "ugh",
  usage: "remini [image]",
  credits: 'chill',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
    api.sendMessage('Please reply to an image you want to enhance with the command "remini".', event.threadID, event.messageID);
    return;
  }

  const attachment = event.messageReply.attachments[0];
  if (attachment.type !== 'photo') {
    api.sendMessage('Please reply to a photo.', event.threadID, event.messageID);
    return;
  }

  const imageUrl = attachment.url;
  const enhancedImagePath = './enhancedImage.jpg';


  const enhanceImage = async (url) => {
    const response = await axios.get(`https://markdevs-api.onrender.com/api/remini?inputImage=${encodeURIComponent(url)}`, {
      responseType: 'stream',
    });
    return response.data;
  };

  try {
    const enhancedImageStream = await enhanceImage(imageUrl);

    const writer = fs.createWriteStream(enhancedImagePath);
    enhancedImageStream.pipe(writer);

    writer.on('finish', () => {
      api.sendMessage({ attachment: fs.createReadStream(enhancedImagePath) }, event.threadID, event.messageID);
    });
  } catch (error) {
    console.error('Error enhancing the image:', error);
    api.sendMessage('An error occurred while enhancing the image.', event.threadID, event.messageID);
  }
};
