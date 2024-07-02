module.exports.config = {
    name: "voicebox",
    version: "1.0.0",
    role: 0,
    credits: "chill",
    description: "Synthesize voice",
    hasPrefix: false,
    aliases: ["voice"],
    usage: "[voicebox <text>]",
    cooldown: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args }) {
    try {
        const text = args.join(" ");
        if (!text) {
            api.sendMessage("Usage: voicebox <text>", event.threadID);
            return;
        }

        api.sendMessage("🤖 | Synthesizing voice, please wait...", event.threadID);

        const response = await axios.get(`https://joshweb.click/new/voicevox-synthesis?id=1&text=${encodeURIComponent(text)}`, {
            responseType: 'arraybuffer'
        });

        const audioPath = path.join(__dirname, `/cache/voice_message.wav`);
        fs.writeFileSync(audioPath, Buffer.from(response.data, 'binary'));

        api.sendMessage({
            body: `voice message:`,
            attachment: fs.createReadStream(audioPath)
        }, event.threadID, () => {
            fs.unlinkSync(audioPath);
        });
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};
