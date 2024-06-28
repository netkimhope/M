const axios = require('axios');

module.exports.config = {
  name: 'scraper',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['scraper', 'fetchweb'],
  description: "Fetch content from a specified URL using AI Web Scraper",
  usage: "webscraper [URL]",
  credits: 'chilling',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const url = args.join(' ');
  if (!url) {
    api.sendMessage('Please provide a URL to scrape.', event.threadID, event.messageID);
    return;
  }

  api.sendMessage(`🔍 Scraping content from: "${url}", please wait...`, event.threadID, event.messageID);

  try {
    const response = await axios.get(`https://deku-rest-api-gadz.onrender.com/webscraper?url=${encodeURIComponent(url)}`);
    const content = response.data.content;

    const userInfo = await api.getUserInfo(event.senderID);
    const userName = userInfo[event.senderID].name;

    api.sendMessage(`📰 Scraped content:\n${content}\n\nScraped by: ${userName}`, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage('An error occurred while scraping the content.', event.threadID, event.messageID);
  }
};
