const axios = require('axios');

module.exports.config = {
  name: 'ai',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['gpt', 'openai'],
  description: "An AI command powered by GPT-4",
  usage: "ai2 [prompt]",
  credits: 'churchill',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const input = args.join(' ');
  if (!input) {
    api.sendMessage(`𝘏𝘦𝘭𝘭𝘰 𝘪𝘮 𝘢𝘪 𝘵𝘩𝘢𝘵 𝘤𝘳𝘦𝘢𝘵𝘦 𝘣𝘺 𝘤𝘩𝘪𝘭𝘭𝘪! 𝘗𝘭𝘴𝘴 𝘱𝘳𝘰𝘷𝘪𝘥𝘦 𝘲𝘶𝘦𝘴𝘵𝘪𝘰𝘯 𝘧𝘪𝘳𝘴𝘵`, event.threadID, event.messageID);
    return;
  }
  api.sendMessage(`🔍𝙎𝙚𝙖𝙧𝙘𝙝𝙞𝙣𝙜 𝙋𝙡𝙚𝙖𝙨𝙚 𝙒𝙖𝙞𝙩....
━━━━━━━━━━━━━━━━━━\n\n "${input}"`, event.threadID, event.messageID);
  try {
    
    const { data } = await axios.get(`https://openaikey-x20f.onrender.com/api?prompt=${encodeURIComponent(input)}`);
    const response = data.response;

    
    const userInfo = await api.getUserInfo(event.senderID);
    const userName = userInfo[event.senderID].name;

    
    api.sendMessage(`${response}\n\nQuestion asked by: ${userName}`, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};
