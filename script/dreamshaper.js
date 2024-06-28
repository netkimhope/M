const axios = require('axios');

module.exports.config = {
  name: 'dreamshaper',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['dsgenerate'],
  description: "Generate images using Dream Shaper",
  usage: "dreamshaper [prompt]",
  credits: 'chilling',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const prompt = args.join(' ');
  if (!prompt) {
    api.sendMessage('Please provide a prompt for the image generation.', event.threadID, event.messageID);
    return;
  }

  api.sendMessage(`🎨 Generating image with prompt: "${prompt}", please wait...`, event.threadID, event.messageID);

  try {
    const response = await axios.get(`https://deku-rest-api-gadz.onrender.com/dreamshaper?prompt=${encodeURIComponent(prompt)}`);
    const imageUrl = response.data.image_url;

    api.sendMessage({
      body: `Here is your generated image:`,
      attachment: await axios.get(imageUrl, { responseType: 'stream' }).then(response => response.data)
    }, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage('An error occurred while generating the image.', event.threadID, event.messageID);
  }
};
