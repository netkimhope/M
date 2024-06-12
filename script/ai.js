const { get } = require('axios');

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    role: 0,
    hasPrefix: false,
    credits: "churchill",
    description: "Ask any question to the AI.",
    aliases: [],
    usages: "[question]",
    cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
    function sendMessage(msg) {
        api.sendMessage(msg, event.threadID, event.messageID);
    }

    if (!args[0]) return sendMessage('Please provide a question.');

    const question = args.join(" ");
    const url = `https://deku-rest-api-3ijr.onrender.com/api/neuronspike?q=${encodeURIComponent(question)}`;

    try {
        const response = await get(url);
        const data = response.data;
        return sendMessage(data.response);
    } catch (error) {
        return sendMessage('Sorry, there was an error with the request.');
    }
}
