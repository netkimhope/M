const axios = require('axios');

module.exports.config = {
  name: 'box',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['box'],
  description: "blxnigga",
  usage: "boxbox",
  credits: 'chilling',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const query = args.join(' ');
  if (!query) {
    api.sendMessage('Please provide a question.', event.threadID, event.messageID);
    return;
  }

  api.sendMessage('🔍 Box is answering, please wait...', event.threadID, event.messageID);

  try {
    const response = await axios.get(`https://joshweb.click/api/blackboxai?q=${encodeURIComponent(query)}&uid=100`);
    const aiResponse = response.data.response;

    const message = {
      body: `box answer:\n\n${aiResponse}`,
      mentions: [
        {
          tag: `@${event.senderID}`,
          id: event.senderID
        }
      ]
    };

    api.sendMessage(message, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage('An error occurred while fetching the response.', event.threadID, event.messageID);
  }
};
