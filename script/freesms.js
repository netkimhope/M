const fetch = require('node-fetch');

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

    console.log(`Making request to API URL: ${apiUrl}`);

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log(`API response status: ${response.status}`);
        console.log(`API response data: ${JSON.stringify(data)}`);

        if (response.ok) {
            api.sendMessage('Message sent successfully!', event.threadID, event.messageID);
        } else {
            api.sendMessage('Error sending message.', event.threadID, event.messageID);
        }
    } catch (error) {
        console.error('Error fetching from API:', error);
        api.sendMessage('Error sending message.', event.threadID, event.messageID);
    }
};
