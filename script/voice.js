const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports.config = {
    name: "voice",
    version: "1.0.0",
    role: 0,
    credits: "churchill",
    description: "Text to voice speech messages",
    hasPrefix: false,
    usages: `Text to speech messages`,
    cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
    try {
        const { createReadStream, unlinkSync } = fs;
        const { resolve } = path;

        let content = (event.type === "message_reply") ? event.messageReply.body : args.join(" ");
        let languageToSay = detectLanguage(content);
        let msg = content.slice(languageToSay.length).trim();

        const apiUrl = `https://deku-rest-api.vercel.app/new/voicevox-synthesis?id=1&text=${encodeURIComponent(msg)}`;
        const filePath = resolve(__dirname, 'cache', `${event.threadID}_${event.senderID}.mp3`);

        await downloadFile(apiUrl, filePath);

        return api.sendMessage({ attachment: createReadStream(filePath) }, event.threadID, () => unlinkSync(filePath), event.messageID);
    } catch (error) {
        console.error(error);
    }
};

function detectLanguage(content) {
    const supportedLanguages = ["ru", "en", "ko", "ja", "tl"];
    for (const lang of supportedLanguages) {
        if (content.startsWith(lang)) {
            return lang;
        }
    }
    // Default language if not specified or not supported
    return "tl";
}

async function downloadFile(url, filePath) {
    const writer = fs.createWriteStream(filePath);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}
