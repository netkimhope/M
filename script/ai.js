const axios = require('axios');
const fs = require('fs').promises;

const storageFile = 'user_data.json';
const axiosStatusFile = 'axios_status.json';

const apiUrl = 'https://cprojectapisjonellv2.adaptable.app/api/ai?query=';

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    role: 0,
    description: "EDUCATIONAL",
    hasPrefix: false,
    aliases: ["gpt", "ai"],
    usages: "[question]",
    cooldowns: 5,
    hasPermission: 0,
    commandCategory: "boxchat",
    usage: "[question]",
    usePrefix: false,
    cooldowns: 3,
};

module.exports.run = async function ({ api, event, args }) {
    const content = encodeURIComponent(args.join(" "));
    const uid = event.senderID;

    if (!content) {
        return api.sendMessage("Please provide your question.\n\nExample: ai what is the solar system?", event.threadID, event.messageID);
    }

    try {
        api.sendMessage(`🔍 | AI is searching for your answer. Please wait...`, event.threadID, event.messageID);

        const response = await axios.get(`${apiUrl}${content}`);
        const result = response.data.message;

        if (!result) {
            throw new Error("No response from API");
        }

        const userData = await getUserData(uid);
        userData.requestCount = (userData.requestCount || 0) + 1;
        userData.responses = userData.responses || [];
        userData.responses.push({ question: content, response: result });
        await saveUserData(uid, userData);

        const userNames = await getUserNames(api, uid);
        const responseMessage = `${result}\n\n👤 Question Asked by: ${userNames.join(', ')}\n\n𝐂𝐑𝐄𝐀𝐓𝐄 𝐘𝐎𝐔𝐑 𝐎𝐖𝐍 𝐁𝐎𝐓 𝐇𝐄𝐑𝐄: https://bingchurchill.onrender.com/`;

        api.sendMessage(responseMessage, event.threadID, event.messageID);
        await saveAxiosStatus('New Axios');

    } catch (error) {
        console.error("Error in AI command:", error.message);
        api.sendMessage(`An error occurred while processing your request: ${error.message}`, event.threadID);
        await saveAxiosStatus('Unknown');
    }
};

async function getUserData(uid) {
    try {
        const data = await fs.readFile(storageFile, 'utf-8');
        const jsonData = JSON.parse(data);
        return jsonData[uid] || {};
    } catch (error) {
        console.error('Error reading user data:', error.message);
        return {};
    }
}

async function saveUserData(uid, data) {
    try {
        const existingData = await getUserData(uid);
        const newData = { ...existingData, ...data };
        const allData = await getAllUserData();
        allData[uid] = newData;
        await fs.writeFile(storageFile, JSON.stringify(allData, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error saving user data:', error.message);
    }
}

async function getUserNames(api, uid) {
    try {
        const userInfo = await api.getUserInfo([uid]);
        return Object.values(userInfo).map(user => user.name || `User${uid}`);
    } catch (error) {
        console.error('Error getting user names:', error.message);
        return [];
    }
}

async function getAllUserData() {
    try {
        const data = await fs.readFile(storageFile, 'utf-8');
        return JSON.parse(data) || {};
    } catch (error) {
        console.error('Error reading all user data:', error.message);
        return {};
    }
}

async function saveAxiosStatus(apiName) {
    try {
        await fs.writeFile(axiosStatusFile, JSON.stringify({ axiosUsed: apiName }), 'utf-8');
    } catch (error) {
        console.error('Error saving Axios status:', error.message);
    }
}
