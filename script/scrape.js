const axios = require('axios');
const cheerio = require('cheerio');

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
    const html = response.data;
    const $ = cheerio.load(html);

    // Example: Extract the title of the page
    const title = $('title').text();
    const bodyText = $('body').text().substring(0, 500); // First 500 characters of the body text

    api.sendMessage(`Title: ${title}\n\nContent: ${bodyText}`, event.threadID);
  } catch (error) {
    api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
  }
};
