const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "join",
  version: "1.0.0",
  role: 0,
  hasPrefix: false,
  description: "Join a specified group chat by its ID",
  usages: "join <group_id>",
  credits: "chilli",
  cooldowns: 0
};

module.exports.run = async function({ api, event, args }) {
  try {
    const groupId = args[0];
    if (!groupId) {
      return api.sendMessage("Please provide a group chat ID to join.", event.threadID, event.messageID);
    }

    await api.addUserToGroup(api.getCurrentUserID(), groupId);
    api.sendMessage(`Successfully joined the group chat with ID: ${groupId}`, event.threadID);
  } catch (error) {
    api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
  }
};
