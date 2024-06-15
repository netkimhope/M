const axios = require('axios');

module.exports.config = {
  name: 'gore',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['goreVideo', 'gore'],
  description: "Sends a random gore video",
  usage: "randGoreVideo",
  credits: 'churchill',
  cooldown: 3,
};

module.exports.run = async function({ api, event }) {
  api.sendMessage(' Fetching a random gore video, please wait...', event.threadID, event.messageID);

  try {
    const response = await axios.get('https://deku-rest-api-ywad.onrender.com/api/randgore');
    const randomGoreVideoUrl = response.data.videoUrl;

    if (randomGoreVideoUrl) {
      api.sendMessage({
        body: "Here's a random gore video:",
        attachment: await axios.get(randomGoreVideoUrl, { responseType: 'stream' })
          .then(res => res.data)
          .catch(err => {
            console.error('Error fetching video:', err);
            throw new Error('Failed to fetch video.');
          })
      }, event.threadID, event.messageID);
    } else {
      throw new Error('No video URL found in response.');
    }
  } catch (error) {
    console.error('Error fetching random gore video:', error);
    api.sendMessage('An error occurred while fetching a random gore video.', event.threadID, event.messageID);
  }
};
