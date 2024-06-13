const axios = require('axios');

module.exports.config = {
    name: 'freesms',
    version: '1.0.0',
    role: 0,
    hasPrefix: true,
    aliases: ['freesms'],
    description: "Send a free text message",
    usage: "freesms [phone number] [message]",
    credits: 'churchill',
};

module.exports.run = async function ({ api, event, args }) {
    const phoneNumber = args[0];
    const message = args.slice(1).join(' ');

    if (!phoneNumber || !message) {
        return api.sendMessage('Please provide a phone number and a message.', event.threadID, event.messageID);
    }

    const apiUrl = `https://api-freesms.replit.app/send_sms?number=${encodeURIComponent(phoneNumber)}&message=${encodeURIComponent(message)}`;

    try {
        const response = await axios.get(apiUrl);
        console.log('API response:', response.data);
        api.sendMessage('Message sent successfully!', event.threadID, event.messageID);
    } catch (error) {
        console.error('Error sending message:', error);
        api.sendMessage('Error sending message.', event.threadID, event.messageID);
    }
};
