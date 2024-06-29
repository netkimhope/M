const axios = require('axios');

module.exports.config = {
  name: 'german',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['deutsch'],
  description: "German AI Command",
  usage: "german [query]",
  credits: 'churchill',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const query = args.join(" ");  /
  const responseMessage = { className: '', textContent: '' };

  if (!query) {
    responseMessage.className = 'error';
    responseMessage.textContent = ' german what is kiffy?';
    api.sendMessage(responseMessage.textContent, event.threadID, event.messageID);
    return;
  }

  responseMessage.textContent = '👄𝑨𝒏𝒔𝒘𝒆𝒓𝒊𝒏𝒈 𝒖𝒓 𝒒𝒖𝒆𝒂𝒕𝒊𝒐𝒏 𝒑𝒍𝒔𝒔 𝒘𝒂𝒊𝒕...';
  api.sendMessage(responseMessage.textContent, event.threadID, event.messageID);

  const apiUrl = `https://deku-rest-api-gadz.onrender.com/ai/discolm-german?q=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    responseMessage.className = 'success';
    responseMessage.textContent = `Response:\n${data.response}`;
    api.sendMessage(responseMessage.textContent, event.threadID, event.messageID);
  } catch (error) {
    console.error('Error fetching the response:', error);
    responseMessage.className = 'error';
    responseMessage.textContent = 'An error occurred while processing your query.';
    api.sendMessage(responseMessage.textContent, event.threadID, event.messageID);
  }
};
