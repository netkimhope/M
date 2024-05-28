module.exports.config = {
    name: "youtube",
    version: "1.0.0",
    role: 0,
    credits: "libyzxy0",
    description: "Search for YouTube videos.",
    usages: "[search query]",
    cooldown: 0,
    hasPrefix: true,
};

module.exports.run = async ({ api, event, args }) => {
    const axios = require('axios');
    const fs = require('fs');
    const { messageID, threadID } = event;

    if (args.length === 0) {
        return api.sendMessage("Please provide a search query.", threadID, messageID);
    }

    const query = args.join(" ");
    const apiUrl = `https://markdevs-last-api-a4sm.onrender.com/search/youtube?q=${encodeURIComponent(query)}`;

    try {
        api.setMessageReaction("⏳", event.messageID, (err) => {}, true);
        api.sendTypingIndicator(threadID, true);

        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data || data.length === 0) {
            return api.sendMessage("No results found.", threadID, messageID);
        }

        let messageBody = "Here are the search results:\n\n";
        data.forEach((video, index) => {
            messageBody += `${index + 1}. ${video.title}\nURL: ${video.url}\n\n`;
        });

        api.setMessageReaction("✅", event.messageID, (err) => {}, true);
        return api.sendMessage({
            body: messageBody,
            attachment: fs.createReadStream(data[0].videoPath) // Assuming videoPath is provided in API response
        }, threadID, messageID);
    } catch (error) {
        api.setMessageReaction("❌", event.messageID, (err) => {}, true);
        return api.sendMessage(`An error occurred: ${error.message}`, threadID, messageID);
    } finally {
        api.sendTypingIndicator(threadID, false);
    }
};
