const axios = require('axios');

module.exports.config = {
  name: 'german',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['deutsch', 'german'],
  description: "German Conversional",
  usage: "german [query]",
  credits: 'churchill',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const query = args.join(' ');
  if (!query) {
    api.sendMessage('Usage: german [query]', event.threadID, event.messageID);
    return;
  }

  const url = `https://deku-rest-api-gadz.onrender.com/ai/discolm-german?q=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(url);
    if (response.data && response.data.answer) {
      const germanAnswer = response.data.answer;
      const conversionalText = 'コンバージョン';

      const message = `GERMAN\n\n${conversionalText}\n\n${germanAnswer}`;
      api.sendMessage(message, event.threadID, event.messageID);
    } else {
      api.sendMessage('Failed to retrieve the answer. Please try again later.', event.threadID, event.messageID);
    }
  } catch (error) {
    console.error('Error fetching the answer:', error);
    api.sendMessage('An error occurred while fetching the answer.', event.threadID, event.messageID);
  }
};
