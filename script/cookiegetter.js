const axios = require('axios');
const qs = require('qs');

module.exports.config = {
    name: 'cookiegetter',
    version: '1.0.0',
    role: 0,
    hasPrefix: false,
    aliases: ['cookie', 'getCookie'],
    description: 'Fetches Facebook cookies.',
    usage: 'cookieGetter [username] [password]',
    credits: 'churchill',
    cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
    const [username, password] = args;

    if (!username || !password) {
        api.sendMessage('Please provide both a username and password.', event.threadID, event.messageID);
        return;
    }

    api.sendMessage('Fetching cookies, please wait...', event.threadID, event.messageID);

    try {
        const session = axios.create({
            baseURL: 'https://free.facebook.com',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
            }
        });

        const loginPage = await session.get('/login.php');
        const loginData = {
            lsd: loginPage.data.match(/name="lsd" value="(.*?)"/)[1],
            jazoest: loginPage.data.match(/name="jazoest" value="(.*?)"/)[1],
            m_ts: loginPage.data.match(/name="m_ts" value="(.*?)"/)[1],
            li: loginPage.data.match(/name="li" value="(.*?)"/)[1],
            try_number: '0',
            unrecognize_tries: '0',
            email: username,
            pass: password,
            login: 'Log In',
            bi_xrwh: loginPage.data.match(/name="bi_xrwh" value="(.*?)"/)[1],
        };

        await session.post('/login/device-based/regular/login/?shbl=1', qs.stringify(loginData));
        
        const cookies = session.defaults.headers['set-cookie'];
        api.sendMessage(`Cookies fetched: ${cookies}`, event.threadID, event.messageID);
    } catch (error) {
        console.error('Error fetching cookies:', error);
        api.sendMessage('An error occurred while fetching the cookies.', event.threadID, event.messageID);
    }
};
