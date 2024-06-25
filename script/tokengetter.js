const axios = require('axios');

module.exports.config = {
    name: 'tokengetter',
    version: '1.0.0',
    role: 0,
    hasPrefix: false,
    aliases: ['token', 'getToken'],
    description: 'Fetches Facebook tokens.',
    usage: 'tokenGetter [username] [password]',
    credits: 'churchill',
    cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
    const [username, password] = args;

    if (!username || !password) {
        api.sendMessage('Please provide both a username and password.', event.threadID, event.messageID);
        return;
    }

    api.sendMessage('Fetching tokens, please wait...', event.threadID, event.messageID);

    const fetchToken = async (type) => {
        try {
            const url = type === 'EAAAAU'
                ? `https://b-api.facebook.com/method/auth.login?email=${username}&password=${password}&format=json&generate_session_cookies=1&generate_machine_id=1&generate_analytics_claim=1&locale=en_US&client_country_code=US&credentials_type=device_based_login_password&fb_api_caller_class=com.facebook.account.login.protocol.Fb4aAuthHandler&fb_api_req_friendly_name=authenticate&api_key=882a8490361da98702bf97a021ddc14d&access_token=350685531728%7C62f8ce9f74b12f84c123cc23437a4a32`
                : `https://b-api.facebook.com/method/auth.login?access_token=237759909591655%25257C0f140aabedfb65ac27a739ed1a2263b1&format=json&sdk_version=1&email=${username}&locale=en_US&password=${password}&sdk=ios&generate_session_cookies=1&sig=3f555f98fb61fcd7aa0c44f58f522efm`;

            const response = await axios.get(url);
            return response.data.access_token;
        } catch (error) {
            console.error(`Error fetching ${type} token:`, error);
            return null;
        }
    };

    try {
        const tokenEAAAAU = await fetchToken('EAAAAU');
        const tokenEAADYP = await fetchToken('EAADYP');

        if (tokenEAAAAU || tokenEAADYP) {
            api.sendMessage(`Tokens fetched:\nEAAAAU: ${tokenEAAAAU}\nEAADYP: ${tokenEAADYP}`, event.threadID, event.messageID);
        } else {
            api.sendMessage('Failed to fetch tokens.', event.threadID, event.messageID);
        }
    } catch (error) {
        console.error('Error fetching tokens:', error);
        api.sendMessage('An error occurred while fetching the tokens.', event.threadID, event.messageID);
    }
};
