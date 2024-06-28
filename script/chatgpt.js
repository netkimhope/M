const axios = require('axios');

module.exports.config = {
  name: 'chatgpt',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['gpt1', 'gpt4'],
  description: "Chat with GPT-4-Turbo conversational AI",
  usage: "chatgpt [message]",
  credits: 'chilling',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const message = args.join(' ');
  if (!message) {
    api.sendMessage('Please provide a message to send to GPT-4.', event.threadID, event.messageID);
    return;
  }

  api.sendMessage(`💬 Sending message to GPT-4: "${message}", please wait...`, event.threadID, event.messageID);

  try {
    const response = await axios.get(`https://deku-rest-api-gadz.onrender.com/gpt4-turbo?message=${encodeURIComponent(message)}`);
    const reply = response.data.reply;

    const userInfo = await api.getUserInfo(event.senderID);
    const userName = userInfo[event.senderID].name;

    api.sendMessage(`🧠 GPT-4's reply:\n${reply}\n\ninitiated by: ${userName}`, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};
