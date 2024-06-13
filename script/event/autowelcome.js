const { api } = require('chat-api'); 
const fs = require('fs');

module.exports.config = {
    name: "autowelcome",
    version: "1.2.0",
};

module.exports.handleEvent = async function({ api, event }) {
    if (event.type === 'event' && event.logMessageType === 'log:subscribe') {
        const addedUserIDs = event.logMessageData.addedParticipants.map(participant => participant.userFbId);

        try {
            const threadInfo = await api.getThreadInfo(event.threadID);
            const memberCount = threadInfo.participantIDs.length;
            const groupName = threadInfo.threadName || "this group"; // Default to "this group" if no name is set

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
