const axios = require('axios');

module.exports.config = {
    name: 'gore',
    version: '1.0.0',
    role: 0,
    hasPrefix: true,
    aliases: ['gore'],
    description: 'Fetches a random gore video',
    usage: 'gore',
    credits: 'Developer',
};

module.exports.run = async function({ api, event }) {
    try {
        const chilliResponse = await axios.get('https://nash-rest-api.replit.app/gore');
        const bingchilliVideoUrl = chilliResponse.data.url; // dito yung na rereturnvng fieldname

        if (bingchilliVideoUrl) {
            api.sendMessage({ body: '🎥 Fetching random gore content...', attachment: bingchilliVideoUrl }, event.threadID, event.messageID);
        } else {
            api.sendMessage('❌ Failed to fetch the gore video. Please try again later.', event.threadID, event.messageID);
        }
    } catch (chillimansiError) {
        console.error('Error fetching gore video:', chillimansiError);
        api.sendMessage('⚠️ An error occurred while fetching the gore video.', event.threadID, event.messageID);
    }
};
