const axios = require('axios');

module.exports.config = {
  name: 'ai2',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['ai2', 'bot'],
  description: "CyberChrono Command",
  usage: "cyberchrono [query]",
  credits: 'churchill',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const query = args.join(' ');

  if (!query) {
    api.sendMessage('Please provide a query for CyberChrono.', event.threadID, event.messageID);
    return;
  }

  api.sendMessage('Fetching response...', event.threadID, event.messageID);

  try {
    const response = await axios.get(`https://deku-rest-api-ywad.onrender.com/api/cyberchrono`, {
      params: { q: query }
    });
    const data = response.data;

    api.sendMessage(`Response: ${JSON.stringify(data)}`, event.threadID, event.messageID);
  } catch (error) {
    console.error('Error:', error);

    api.sendMessage('An error occurred while fetching the response.', event.threadID, event.messageID);
  }
};
