const axios = require('axios');

module.exports.config = {
    name: 'ai2',
    version: '1.0.0',
    role: 0,
    hasPrefix: true,
    aliases: ['ai2'],
    description: 'Fetches a response from GPT-4 API',
    usage: 'gpt4 <prompt>',
    credits: 'chilli',
};

module.exports.run = async function({ api, event, args }) {
    try {
        const prompt = args.join(' ');
        const chilliResponse = await axios.get(`https://joshweb.click/gpt4?prompt=${encodeURIComponent(prompt)}&uid=100`);
        const bingchilliReply = chilliResponse.data.reply; // Assuming the API returns a field named 'reply'

        if (bingchilliReply) {
            const responseMessage = `📦 𝙶𝙿𝚃4+ 𝙲𝙾𝙽𝚃𝙸𝙽𝚄𝙴𝚂 𝙰𝙸
━━━━━━━━━━━━━━━━━━
${bingchilliReply}
━━━━━━━━━━━━━━━━━━
👤 𝙰𝚜𝚔𝚎𝚍 𝚋𝚢: ${event.senderID}`;

            api.sendMessage(responseMessage, event.threadID, event.messageID);
        } else {
            api.sendMessage('❌ Failed to fetch the GPT-4 response. Please try again later.', event.threadID, event.messageID);
        }
    } catch (chillimansiError) {
        console.error('Error fetching GPT-4 response:', chillimansiError);
        api.sendMessage('⚠️ An error occurred while fetching the GPT-4 response.', event.threadID, event.messageID);
    }
};
