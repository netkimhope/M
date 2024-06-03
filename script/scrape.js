const axios = require('axios');

module.exports.config = {
  name: 'scrape',
  version: '1.1.1',
  hasPermssion: 0,
  role: 2,
  credits: "cliff",//modchilli
  author: 'yazky',
  description: 'Scraping Web and API/output',
  usePrefix: false,
  hasPrefix: false,
  commandCategory: 'url',
  usage: '{pn} [url]',
  usages: '{pn} [url]',
  cooldown: 0,
  cooldowns: 0,
};

module.exports.run = async function({ api, event, args }) {
  let url = args.join(' ');

  if (!url) {
    return api.sendMessage('Please provide a URL you want to scrape.', event.threadID, event.messageID);
  }

  try {
    const initialMessage = await new Promise(resolve => {
      api.sendMessage('Scraping website/API, please wait a few seconds...', event.threadID, (err, info) => {
        resolve(info);
      }, event.messageID);
    });

    const response = await axios.get(`http://158.101.198.227:8609/scrapper?url=${encodeURIComponent(url)}`);
    const responseData = response.data.results;

    const rawContent = responseData.map(item => item.content).join('\n\n');

    const formattedContent = responseData.map(item => ({
      created_at: item.created_at,
      updated_at: item.updated_at,
      page: item.page,
      url: item.url,
      job_id: item.job_id,
      status_code: item.status_code,
      request: item._request,
      response: item._response,
      session_info: item.session_info
    }));

    const fullContent = `${rawContent}\n\n${JSON.stringify(formattedContent, null, 2)}`;

    api.editMessage(fullContent, initialMessage.messageID);
  } catch (err) {
    console.error(err);
    return api.sendMessage('Error: Unable to access the link. Please try again.', event.threadID, event.messageID);
  }
};
