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
  const responseDiv = { className: '', textContent: '' };

  if (!query) {
    responseDiv.className = 'error';
    responseDiv.textContent = 'cyberchrono query';
    api.sendMessage(responseDiv.textContent, event.threadID, event.messageID);
    return;
  }

  responseDiv.textContent = 'Fetching response...';
  api.sendMessage(responseDiv.textContent, event.threadID, event.messageID);

  try {
    const response = await axios.get(`https://deku-rest-api-ywad.onrender.com/api/cyberchrono`, {
      params: { q: query }
    });
    const data = response.data;
    console.log('Response:', data);

    responseDiv.className = 'success';
    responseDiv.textContent = `Response: ${JSON.stringify(data)}`;
  } catch (error) {
    console.error('Error:', error);

    responseDiv.className = 'error';
    responseDiv.textContent = 'An error occurred while fetching the response.';
  }

  api.sendMessage(responseDiv.textContent, event.threadID, event.messageID);
};
