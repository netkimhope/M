const axios = require('axios');

module.exports.config = {
  name: "scrape",
  version: "1.0.0",
  role: 0,
  hasPrefix: false,
  description: "Scrape a webpage and return its content",
  usages: "scrape <URL>",
  credits: "chilli",
  cooldowns: 0
};

module.exports.run = async function({ api, event, args }) {
  const url = args[0];

  if (!url) {
    return api.sendMessage("Please provide a URL to scrape.", event.threadID, event.messageID);
  }

  try {
    const response = await axios.get(url);
    const data = response.data;

    // Format the scraped content, you can adjust this part as needed
    const content = JSON.stringify(data, null, 2);
    api.sendMessage(`Scraped content: ${content}`, event.threadID);
  } catch (error) {
    api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
  }
};
