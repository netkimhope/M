const axios = require('axios');

module.exports.config = {
    name: 'adobo',
    version: '1.0.0',
    role: 0,
    hasPrefix: false,
    aliases: ['adobo'],
    description: 'Adobo AI Command',
    usage: 'adobo [query]',
    credits: 'churchill',
    cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
    const query = args.join(' ');

    if (!query) {
        api.sendMessage('Please provide a question. For example: adobo who is the current president in the Philippines?', event.threadID, event.messageID);
        return;
    }

    try {
        console.log('Query:', query);
        const response = await axios.get('https://markdevs69-1efde24ed4ea.herokuapp.com/api/adobo/gpt', {
            params: { query: query }
        });

        console.log('API Response:', response.data);
        const data = response.data.response;

        api.sendMessage(data, event.threadID, event.messageID);
    } catch (error) {
        console.error('Error:', error.message);
        api.sendMessage(`An error occurred while fetching the response: ${error.message}`, event.threadID, event.messageID);
    }
};
