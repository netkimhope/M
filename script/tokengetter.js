const axios = require('axios');

module.exports.config = {
  name: 'tokengetter',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['token', 'gettkn'],
  description: "Token Getter Command",
  usage: "gettoken [email] [password]",
  credits: 'churchill',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const [email, password] = args;

  if (!email || !password) {
    api.sendMessage('Please provide both email and password.', event.threadID, event.messageID);
    return;
  }

  const apiUrl = `https://nash-rest-api.replit.app/token?username=${encodeURIComponent(email)}&pass=${encodeURIComponent(password)}`;

  try {
    const response = await axios.get(apiUrl);
    if (response.data && response.data.token) {
      api.sendMessage(`Token: ${response.data.token}`, event.threadID, event.messageID);
    } else {
      api.sendMessage('Failed to retrieve token. Please check your credentials.', event.threadID, event.messageID);
    }
  } catch (error) {
    console.error('Error fetching token:', error);
    api.sendMessage('An error occurred while fetching the token.', event.threadID, event.messageID);
  }
};
