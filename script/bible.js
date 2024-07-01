const axios = require('axios');

module.exports.config = {
    name: 'bible',
    version: '1.0.0',
    role: 0,
    credits: 'churchill',
    description: 'Get a random Bible verse.',
    hasPrefix: false,
    aliases: ['bibleverse', 'bibble'],
    usage: '',
    cooldown: 5,
};

let intervalID = null;

module.exports.run = async function({ api, event, args }) {
    const command = args[0]?.toLowerCase();

    if (command === 'on') {
        if (intervalID) {
            api.sendMessage('The daily Bible verse is already on.', event.threadID);
            return;
        }

        api.sendMessage('Daily Bible verse turned on, sending every 10 minutes.', event.threadID);
        intervalID = setInterval(async () => {
            try {
                const response = await axios.get('https://joshweb.click/bible');
                const verse = response.data.verse;
                const reference = response.data.reference;

                const message = `🔔 Daily Bible Verse:\n📖 ${verse}\n- ${reference}`;
                api.sendMessage(message, event.threadID);
            } catch (error) {
                console.error('Error:', error);
                api.sendMessage('An error occurred while fetching the Bible verse.', event.threadID);
            }
        }, 600000); // 10 minutes in milliseconds

    } else if (command === 'off') {
        if (intervalID) {
            clearInterval(intervalID);
            intervalID = null;
            api.sendMessage('Daily Bible verse turned off.', event.threadID);
        } else {
            api.sendMessage('The daily Bible verse is already off.', event.threadID);
        }
    } else {
        api.sendMessage('⏱️ | Fetching a random Bible verse, please wait...', event.threadID);

        try {
            const response = await axios.get('https://joshweb.click/bible');
            const verse = response.data.verse;
            const reference = response.data.reference;

            const message = `📖 ${verse}\n- ${reference}`;
            api.sendMessage(message, event.threadID);
        } catch (error) {
            console.error('Error:', error);
            api.sendMessage('An error occurred while fetching the Bible verse.', event.threadID);
        }
    }
};
