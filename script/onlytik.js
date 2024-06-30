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

module.exports.config = {
  name: "onlytik",
  version: "1.0",
  hasPermision: 2,
  credits: "Vex_Kshitiz",
  description: "18+ TikTok video",
  usePrefix: true,
  usages: "onlytik",
  cooldown: 5,
};

module.exports.onStart = async function ({ api, event, args, message }) {
  const isAuthorValid = await checkAuthor(module.exports.config.credits);
  if (!isAuthorValid) {
    await message.reply("Author changer alert! This command belongs to Vex_Kshitiz.");
    return;
  }

  const apiUrl = "https://only-tik.vercel.app/kshitiz";

  try {
    const response = await axios.get(apiUrl);
    const { videoUrl, likes } = response.data;

    const tempVideoPath = path.join(__dirname, "cache", `${Date.now()}.mp4`);
    const writer = fs.createWriteStream(tempVideoPath);
    const videoResponse = await axios.get(videoUrl, { responseType: "stream" });
    videoResponse.data.pipe(writer);

    writer.on("finish", () => {
      const stream = fs.createReadStream(tempVideoPath);

      message.reply({
        body: ``,
        attachment: stream,
      });
    });

  } catch (error) {
    console.error("Error fetching OnlyTik video:", error);
    message.reply("Sorry, an error occurred while processing your request.");
  }
};
