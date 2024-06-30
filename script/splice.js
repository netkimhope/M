const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Function to check if the author matches
async function checkAuthor(authorName) {
  try {
    const response = await axios.get('https://author-check.vercel.app/name');
    const apiAuthor = response.data.name;
    return apiAuthor === authorName;
  } catch (error) {
    console.error("Error checking author:", error);
    return false;
  }
}

// Function to fetch tracks based on query
async function fetchTracks(query) {
  try {
    const response = await axios.get(`https://splice-samples.vercel.app/kshitiz?query=${encodeURIComponent(query)}`);
    return response.data.trackUrls;
  } catch (error) {
    console.error("Error fetching tracks:", error);
    throw new Error("Failed to fetch tracks");
  }
}

// Function to download a track
async function downloadTrack(trackUrl, fileName) {
  try {
    const cacheDir = path.join(__dirname, 'cache');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const response = await axios.get(trackUrl, { responseType: "stream" });
    const writer = fs.createWriteStream(fileName);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on("finish", () => resolve(fileName));
      writer.on("error", reject);
    });
  } catch (error) {
    console.error("Error downloading track:", error);
    throw new Error("Failed to download track");
  }
}

module.exports.config = {
  name: "splice",
  version: "1.0",
  hasPermision: 2,
  credits: "Vex_Kshitiz",
  description: "Get high quality royalty free samples, multiple genre music loops",
  usePrefix: true,
  usages: "splice {query}",
  cooldown: 5,
};

module.exports.onStart = async function ({ api, event, args, message }) {
  const query = args.join(" ");

  const isAuthorValid = await checkAuthor(module.exports.config.credits);
  if (!isAuthorValid) {
    await message.reply("Author changer alert! This command belongs to Vex_Kshitiz.");
    return;
  }

  if (!query) {
    await message.reply("Please provide a query to search for tracks.");
    return;
  }

  api.setMessageReaction("🕐", event.messageID, () => {}, true);

  try {
    const trackUrls = await fetchTracks(query);

    if (!Array.isArray(trackUrls) || trackUrls.length === 0) {
      await message.reply("No tracks found for the given query.");
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return;
    }

    const replyMessage = `Reply to this message with a number from 1 to ${trackUrls.length} to get the track audio.`;

    api.sendMessage({ body: replyMessage }, event.threadID, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: "splice",
        messageID: info.messageID,
        author: event.senderID,
        trackUrls,
      });
    });

    api.setMessageReaction("✅", event.messageID, () => {}, true);
  } catch (error) {
    console.error("Error fetching tracks:", error);
    await message.reply("An error occurred. Please try again later.");
    api.setMessageReaction("❌", event.messageID, () => {}, true);
  }
};

module.exports.onReply = async function ({ api, event, Reply, args, message }) {
  const { author, trackUrls } = Reply;

  if (event.senderID !== author || !trackUrls) {
    return;
  }

  const trackIndex = parseInt(args[0], 10);

  if (isNaN(trackIndex) || trackIndex <= 0 || trackIndex > trackUrls.length) {
    await message.reply("Invalid input. Please provide a valid number.");
    return;
  }

  const selectedTrackUrl = trackUrls[trackIndex - 1];
  const trackFileName = path.join(__dirname, 'cache', `splice_track.mp3`);

  try {
    await downloadTrack(selectedTrackUrl, trackFileName);
    const trackStream = fs.createReadStream(trackFileName);

    await message.reply({
      body: `Here is track ${trackIndex}:`,
      attachment: trackStream,
    });
  } catch (error) {
    console.error("Error downloading track:", error);
    await message.reply("An error occurred while downloading the track.");
  } finally {
    global.GoatBot.onReply.delete(event.messageID);
  }
};
