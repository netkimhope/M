const axios = require('axios');

module.exports.config = {
    name: 'gpt3',
    version: '1.0.0',
    role: 0,
    hasPrefix: false,
    aliases: ['gpt3'],
    description: 'GPT-3 Command',
    usage: 'gpt3 [query]',
    credits: 'churchill',
    cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
    const query = args.join(' ');

    if (!query) {
        api.sendMessage('Please provide a question, gpt3 what is AI?', event.threadID, event.messageID);
        return;
    }

    api.sendMessage('Searching, please wait...', event.threadID, event.messageID);

    try {
        const response = await axios.get('https://markdevs69-1efde24ed4ea.herokuapp.com/gpt3', {
            params: { prompt: query, uid: event.senderID }
        });

        const data = response.data.response;

        api.sendMessage(data, event.threadID, event.messageID);
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage('An error occurred while fetching the response.', event.threadID, event.messageID);
    }
};
