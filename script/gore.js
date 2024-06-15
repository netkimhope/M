const axios = require('axios');

module.exports.config = {
  name: 'gore',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['goreVideo', 'randomGoreVideo'],
  description: "Sends a random gore video",
  usage: "randGoreVideo",
  credits: 'Developer: https://www.facebook.com/Churchill.Dev4100',
  cooldown: 10,
};

module.exports.run = async function({ api, event }) {
  api.sendMessage('💀 Fetching a random gore video, please wait...', event.threadID, event.messageID);

  try {
    const response = await axios.get('https://deku-rest-api-ywad.onrender.com/api/randgore'); // Corrected endpoint
    console.log('API Response:', response.data); // Log the response data

    if (response.data && response.data.result && response.data.result.video1) {
      const videoUrl = response.data.result.video1;

      const videoResponse = await axios({
        method: 'get',
        url: videoUrl,
        responseType: 'stream'
      });

      // Send the video stream as an attachment
      api.sendMessage({
        body: "Here's a random gore video:",
        attachment: videoResponse.data
      }, event.threadID, event.messageID);
    } else {
      throw new Error('No video URL found in the response.');
    }
  } catch (error) {
    console.error('Error fetching random gore video:', error);
    api.sendMessage('An error occurred while fetching a random gore video.', event.threadID, event.messageID);
  }
};
