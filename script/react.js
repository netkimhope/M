const axios = require('axios');
const cheerio = require('cheerio');

module.exports.config = {
  name: 'react',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['react', 'link-preview'],
  description: "like Tools Commands",
  usage: {
    react: "react [post_link] [reaction_type] [fb_cookie]",
    linkPreview: "link-preview [url]",
  },
  credits: 'churchill',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args, command }) {
  if (command === 'react') {
    await reactCommand({ api, event, args });
  } else if (command === 'link-preview') {
    await linkPreviewCommand({ api, event, args });
  }
};

const validReactions = ['like', 'love', 'haha', 'wow', 'sad', 'angry', 'care'];

async function reactCommand({ api, event, args }) {
  const [post_link, reaction_type, fb_cookie] = args;
  if (!post_link || !reaction_type || !fb_cookie) {
    api.sendMessage('Usage: react [post_link] [reaction_type] [fb_cookie]', event.threadID, event.messageID);
    return;
  }

  if (!validReactions.includes(reaction_type.toLowerCase())) {
    api.sendMessage(`Invalid reaction type. Valid types are: ${validReactions.join(', ')}`, event.threadID, event.messageID);
    return;
  }

  try {
    const response = await axios.get('https://flikers.onrender.com/api/react', {
      params: {
        link: post_link,
        type: reaction_type,
        cookie: fb_cookie,
      },
    });

    const responseData = response.data;
    if (responseData.status === 200) {
      api.sendMessage("Reaction sent successfully!", event.threadID, event.messageID);
    } else {
      api.sendMessage(`Failed to send reaction. Response: ${JSON.stringify(responseData)}`, event.threadID, event.messageID);
    }
  } catch (error) {
    api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
  }
}

async function linkPreviewCommand({ api, event, args }) {
  const [url] = args;
  if (!url) {
    api.sendMessage('Usage: link-preview [url]', event.threadID, event.messageID);
    return;
  }

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const getMetaTag = (name) => $(`meta[property='${name}']`).attr('content') || $(`meta[name='${name}']`).attr('content');

    const previewData = {
      title: getMetaTag('og:title') || $('title').text(),
      description: getMetaTag('og:description') || '',
      image: getMetaTag('og:image') || '',
    };

    api.sendMessage(`Title: ${previewData.title}\nDescription: ${previewData.description}\nImage: ${previewData.image}`, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage('Failed to fetch link preview', event.threadID, event.messageID);
  }
}
