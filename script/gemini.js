const { get } = require('axios');

module.exports.config = {
    name: "gemini",
    version: "1.0.0",
    role: 0,
    hasPrefix: false,
    credits: "chilli",
    description: "Describe a photo using the Gemini API.",
    aliases: [],
    usages: "[photo URL]",
    cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
    function sendMessage(msg) {
        api.sendMessage(msg, event.threadID, event.messageID);
    }

    if (!args[0]) return sendMessage('Please provide a photo URL.');

    const photoUrl = args.join(" ");
    const url = `https://deku-rest-api-3ijr.onrender.com/gemini?prompt=describe%20this%20photo&url=${encodeURIComponent(photoUrl)}`;

    try {
        const response = await get(url);
        const data = response.data;
        return sendMessage(data.description);
    } catch (error) {
        return sendMessage('Sorry, there was an error with the request.');
    }
}
