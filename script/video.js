const yts = require('yt-search');

module.exports.config = {
  name: "video",
  version: "1.0",
  hasPermssion: 0,
  description: "Play a music video",
  commandCategory: "media",
  usages: "video [title]",
  cooldowns: 15,
  credits: "Adapted from original by Eugene Aguilar",
};

module.exports.run = async function ({ api, event, args }) {
  const { sendMessage: reply } = api;
  const videoName = args.join(' ');

  if (!videoName) {
    reply(`To get started, type "video" followed by the title of the video you want to play.`, event.threadID, event.messageID);
    return;
  }

  try {
    reply(`Searching for "${videoName}"...`, event.threadID, event.messageID);

    const searchResults = await yts(videoName);

    if (!searchResults.videos.length) {
      return reply("Can't find the video you searched for.", event.threadID, event.messageID);
    }

    const video = searchResults.videos[0];
    const videoUrl = video.url;

    reply({
      body: `${video.title}\n\n${videoUrl}`,
    }, event.threadID, event.messageID);

  } catch (error) {
    console.error(error);
    reply('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};
