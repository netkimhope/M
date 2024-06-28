const axios = require('axios');

module.exports.config = {
  name: 'tiktokdl',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['tiktok', 'ttdl'],
  description: "Download videos from TikTok",
  usage: "tiktokdl [TikTok URL]",
  credits: 'chilling',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const url = args.join(' ');
  if (!url) {
    api.sendMessage('Please provide a TikTok URL.', event.threadID, event.messageID);
    return;
  }

  api.sendMessage(`🔍 Fetching video from: "${url}", please wait...`, event.threadID, event.messageID);

  try {
    const response = await axios.get(`https://deku-rest-api-gadz.onrender.com/tiktokdl?url=${encodeURIComponent(url)}`);
    const videoUrl = response.data.video_url;

    api.sendMessage({
      body: `Here is your video from: ${url}`,
      attachment: await axios.get(videoUrl, { responseType: 'stream' }).then(response => response.data)
    }, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage('An error occurred while fetching the video.', event.threadID, event.messageID);
  }
};
