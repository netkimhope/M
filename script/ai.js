const axios = require('axios');

module.exports.config = {
    name: 'ai',
    version: '1.0.0',
    role: 0,
    hasPrefix: false,
    aliases: ['ai'],
    description: "Ask AI anything",
    usage: "ai [question]",
    credits: 'churchill',
};

module.exports.run = async function ({ api, event, args }) {
    const input = args.join(' ');

    if (!input) {
        return api.sendMessage('Please provide a question for the AI.', event.threadID, event.messageID);
    }

    try {
        const fetchAIResponse = async (question, uid) => {
            try {
                const response = await axios.get(`https://deku-rest-api-3ijr.onrender.com/gpt4`, {
                    params: {
                        prompt: question,
                        uid: uid
                    }
                });
                console.log('API Response:', response.data); // Log the API response
                if (response.data && response.data.response) {
                    return response.data.response;
                } else {
                    console.error('Unexpected API response structure:', response.data);
                    return 'Unexpected API response structure.';
                }
            } catch (error) {
                console.error('Error fetching AI response:', error);
                return 'An error occurred while fetching the AI response.';
            }
        };

        const uid = event.senderID; // Using senderID as the uid
        const aiResponse = await fetchAIResponse(input, uid);

        // Get user info to display the name
        api.getUserInfo(event.senderID, (err, userInfo) => {
            if (err) {
                console.error('Error fetching user info:', err);
                return api.sendMessage('An error occurred while fetching user information.', event.threadID, event.messageID);
            }
            const userName = userInfo[event.senderID].name;
            const responseMessage = `${aiResponse}\n\nQuestion asked by: ${userName}`;
            api.sendMessage(responseMessage, event.threadID, event.messageID);
        });
    } catch (error) {
        console.log(error);
        api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
    }
};
