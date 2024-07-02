const axios = require('axios');

module.exports.config = {
    name: 'ai',
    version: '1.0.0',
    role: 0,
    hasPrefix: true,
    aliases: ['ai'],
    description: 'Ask a questiion',
    usage: 'ai <question>',
    credits: 'Developer',
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    
    if (args.length === 0) {
        return api.sendMessage('Please provide a question for ex: ai what is nigga?.', threadID, messageID);
    }
    
    const question = args.join(' ');
    const apiUrl = `https://joshweb.click/gpt4?prompt=${encodeURIComponent(question)}&uid=${senderID}`;
    
    try {
        const response = await axios.get(apiUrl);
        const responseText = response.data.response || 'No response from the API.';
        api.sendMessage(responseText, threadID, messageID);
    } catch (error) {
        console.error('Error fetching response from the API:', error);
        api.sendMessage('⚠️ An error occurred while fetching the response from the API.', threadID, messageID);
    }
};
