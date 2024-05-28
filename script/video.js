const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const ytdl = require('ytdl-core');
const yts = require('yt-search');

module.exports.config = {
  name: "video",
  version: "1.0",
  hasPermssion: 0,
  description: "Search and send a specified video",
  commandCategory: "media",
  usages: "video ",
  cooldowns: 10,
  credits: "octobot",//moddified chilli
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
    const stream = ytdl(videoUrl, {
      filter: "audioandvideo"
    });

    const time = new Date();
    const timestamp = time.toISOString().replace(/[:.]/g, "-");
    const pathToFile = path.join(__dirname, `cache/${timestamp}_video.mp4`);

    // Ensure the cache directory exists
    const cacheDir = path.dirname(pathToFile);
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    stream.pipe(fs.createWriteStream(pathToFile));
    stream.on('end', () => {
      if (fs.statSync(pathToFile).size > 26214400) { // 25MB limit
        fs.unlinkSync(pathToFile);
        return reply('The video could not be sent because it is larger than 25MB.', event.threadID, event.messageID);
      }
      reply({
        body: `${video.title}`,
        attachment: fs.createReadStream(pathToFile)
      }, event.threadID, () => {
        fs.unlinkSync(pathToFile);
      }, event.messageID);
    });
  } catch (error) {
    console.error(error);
    reply('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};
