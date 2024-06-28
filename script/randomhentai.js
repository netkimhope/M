const axios = require('axios');

module.exports.config = {
  name: 'randomhentai',
  version: '1.0.0',
  role:0,
  hasPrefix: false,
  aliases: ['hentai', 'randhentai'],
  description: "Get a random hentai image or video",
  usage: "randomhentai",
  credits: 'chilling',
  cooldown: 3,
};

module.exports.run = async function({ api, event }) {
  api.sendMessage('Fetching random hentai, please wait...', event.threadID, event.messageID);

  try {
    const response = await axios.get('https://deku-rest-api-gadz.onrender.com/randomhentai');
    const hentaiUrl = response.data.url;

    api.sendMessage({
      body: 'Here is your random hentai:',
      attachment: await axios.get(hentaiUrl, { responseType: 'stream' }).then(response => response.data)
    }, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage('An error occurred while fetching the hentai.', event.threadID, event.messageID);
  }
};
