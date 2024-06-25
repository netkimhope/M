const chilling = require('axios');

module.exports.config = {
  name: 'search',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['bing', 'lookup'],
  description: "makakapag search basta un ",
  usage: "search [query]",
  credits: 'chillingbing',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const query = args.join(' ');
  if (!query) {
    api.sendMessage('Please provide a search query.', event.threadID, event.messageID);
    return;
  }

  api.sendMessage(`🔍 Searching for: "${query}", please wait...`, event.threadID, event.messageID);

  try {
    const conrad = await chilling.get(`https://openaico.vercel.app/api/bing?query=${encodeURIComponent(query)}`);
    const bubu = conrad.data.results;

    let message = `🔍 Search results for: "${query}"\n\n`;
    bubu.forEach((result, index) => {
      message += `${index + 1}. ${result.title}\n${result.link}\n\n`;
    });

    const donna = await api.getUserInfo(event.senderID);
    const jay = donna[event.senderID].name;

    api.sendMessage(`${message}\nSearch performed by: ${jay}`, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage('An error occurred while fetching search results.', event.threadID, event.messageID);
  }
};
