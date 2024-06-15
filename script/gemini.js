const axios = require('axios');

module.exports.config = {
  name: 'gemini',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['photoDescription', 'describeImage'],
  description: "Describes a photo using the Gemini API",
  usage: "geminides [photo URL]",
  credits: 'Developer: Churchill',
  cooldown: 3,
};

module.exports.run = async function({ api, event }) {
  const attachments = event.attachments;
  
  if (!attachments || attachments.length === 0) {
    api.sendMessage('Please attach a photo to describe.', event.threadID, event.messageID);
    return;
  }
  
  const photoUrl = attachments[0].url;
  
  api.sendMessage('gemini describing, please wait...', event.threadID, event.messageID);

  try {
    const prompt = 'describe this photo';
    const response = await axios.get(`https://deku-rest-api-ywad.onrender.com/gemini?prompt=${encodeURIComponent(prompt)}&url=${encodeURIComponent(photoUrl)}`);
    console.log('API Response:', response.data); // Log the response data

    if (response.data && response.data.description) {
      const description = response.data.description;
      api.sendMessage(` description: ${description}`, event.threadID, event.messageID);
    } else {
      throw new Error('No description found in the response.');
    }
  } catch (error) {
    console.error('Error fetching photo description:', error);
    api.sendMessage('An error occurred while fetching the photo description.', event.threadID, event.messageID);
  }
};
