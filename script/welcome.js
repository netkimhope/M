const { api } = require('chat-api');
const fs = require('fs');

let autoWelcomeActive = false;

module.exports.config = {
    name: "Welcome",
    version: "1.0.0",
    role: 1,
    hasPrefix: true,
    aliases: ['welcome'],
    description: "Toggle automatic welcome message for new group members",
    usage: "toggleAutoWelcome [on/off]",
    credits: 'Developer',
};

module.exports.run = async function({ api, event, args }) {
    const toggleOption = args[0];

    if (toggleOption === 'on') {
        autoWelcomeActive = true;
        api.sendMessage("Automatic welcome messages activated.", event.threadID, event.messageID);
    } else if (toggleOption === 'off') {
        autoWelcomeActive = false;
        api.sendMessage("Automatic welcome messages deactivated.", event.threadID, event.messageID);
    } else {
        api.sendMessage("Invalid option. Please use 'on' or 'off'.", event.threadID, event.messageID);
    }
};

module.exports.handleEvent = async function({ api, event }) {
    if (autoWelcomeActive && event.type === 'event' && event.logMessageType === 'log:subscribe') {
        const addedUserIDs = event.logMessageData.addedParticipants.map(participant => participant.userFbId);

        try {
            const threadInfo = await api.getThreadInfo(event.threadID);
            const memberCount = threadInfo.participantIDs.length;
            const groupName = threadInfo.threadName || "this group";

            for (let userID of addedUserIDs) {
                const userInfo = await api.getUserInfo(userID);
                const userName = userInfo[userID].name;

                const welcomeMessage = `Hello @${userName}! Welcome to ${groupName}. You are the ${memberCount}th member of this group.`;
                const mentions = [{
                    tag: `@${userName}`,
                    id: userID
                }];

                api.sendMessage({ body: welcomeMessage, mentions }, event.threadID);
            }
        } catch (error) {
            console.error(`Failed to send welcome message:`, error);
        }
    }
};
