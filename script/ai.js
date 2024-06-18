const axios = require('axios');

module.exports.config = {
    name: 'ai',
    version: '1.0.0',
    role: 0,
    hasPrefix: false,
    aliases: ['ai', 'bot'],
    description: 'AI Command',
    usage: 'ai [query]',
    credits: 'churchill',
    cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
    const query = args.join(' ');

    if (!query) {
        api.sendMessage('Please provide a question ex:ai what is nigga.', event.threadID, event.messageID);
        return;
    }

    api.sendMessage('Fetching response...', event.threadID, event.messageID);

    try {
        const response = await axios.get('https://deku-rest-api-ywad.onrender.com/gpt4', {
            params: { prompt: query, uid: event.senderID }
        });
        const data = response.data;

        api.sendMessage(`Response: ${JSON.stringify(data)}`, event.threadID, event.messageID);
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage('An error occurred while fetching the response.', event.threadID, event.messageID);
    }
};
