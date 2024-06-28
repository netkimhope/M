const axios = require('axios');

module.exports.config = {
  name: 'playstore',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['ps', 'play'],
  description: "Search for apps on the Google Play Store",
  usage: "playstore [query]",
  credits: 'chilling',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const query = args.join(' ');
  if (!query) {
    api.sendMessage('Please provide an app name to search for.', event.threadID, event.messageID);
    return;
  }

  api.sendMessage(`🔍 Searching Play Store for: "${query}", please wait...`, event.threadID, event.messageID);

  try {
    const response = await axios.get(`https://deku-rest-api-gadz.onrender.com/playstore?query=${encodeURIComponent(query)}`);
    const apps = response.data.apps;

    let message = `🔍 Search results for: "${query}"\n\n`;
    apps.forEach((app, index) => {
      message += `${index + 1}. ${app.title}\n${app.description}\n${app.link}\n\n`;
    });

    const userInfo = await api.getUserInfo(event.senderID);
    const userName = userInfo[event.senderID].name;

    api.sendMessage(`${message}\nSearch performed by: ${userName}`, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage('An error occurred while fetching app information.', event.threadID, event.messageID);
  }
};
