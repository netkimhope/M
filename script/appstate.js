const axios = require('axios');

module.exports.config = {
  name: 'appstate',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['appstate'],
  description: "AppState Getter ",
  usage: "appstate [email] [password]",
  credits: 'churchill',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const email = args[0];
  const password = args[1];
  const message = { className: '', textContent: '' };

  if (!email || !password) {
    message.className = 'error';
    message.textContent = 'Usage: appstate [email] [password]';
    api.sendMessage(message.textContent, event.threadID, event.messageID);
    return;
  }

  message.textContent = 'Getting AppState...';
  api.sendMessage(message.textContent, event.threadID, event.messageID);

  const appStateUrl = `https://nash-rest-api.replit.app/app-state?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

  try {
    const response = await axios.get(appStateUrl);
    const data = response.data;

    message.className = 'success';
    message.textContent = `Here's ur appstate:\n${JSON.stringify(data, null, 2)}`;
    api.sendMessage(message.textContent, event.threadID, event.messageID);
  } catch (error) {
    console.error('Error fetching the AppState:', error);
    message.className = 'error';
    message.textContent = 'An error occurred while fetching the AppState.';
    api.sendMessage(message.textContent, event.threadID, event.messageID);
  }
};
