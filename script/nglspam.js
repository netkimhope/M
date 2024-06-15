const axios = require('axios');

module.exports.config = {
  name: 'nglspammer',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['ngl', 'spam'],
  description: "NGL Spammer Command",
  usage: "nglSpammer [username] [message] [amount]",
  credits: 'Developer: https://www.facebook.com/Churchill.Dev4100',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const [username, message, amount] = args;
  const responseDiv = { className: '', textContent: '' };
  const logs = [];

  if (!username || !message || isNaN(amount) || amount <= 0) {
    responseDiv.className = 'error';
    responseDiv.textContent = 'Please fill out all fields';
    api.sendMessage(responseDiv.textContent, event.threadID, event.messageID);
    return;
  }

  responseDiv.textContent = 'Sending messages...';
  api.sendMessage(responseDiv.textContent, event.threadID, event.messageID);

  for (let i = 0; i < amount; i++) {
    try {
      const response = await axios.get(`https://nas-api-end.onrender.com/ngl`, {
        params: {
          username,
          message,
          deviceId: 'defaultDeviceId',
          amount: 1
        }
      });
      const data = response.data;
      console.log('Response:', data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      logs.push(`Message ${i + 1} sent successfully`);
      await new Promise(resolve => setTimeout(resolve, 2000));  // Sleep for 2 seconds
    }
  }

  responseDiv.className = 'success';
  responseDiv.textContent = `All messages successfully sent.`;
  api.sendMessage(responseDiv.textContent, event.threadID, event.messageID);
  api.sendMessage(logs.join('\n'), event.threadID, event.messageID);
};
