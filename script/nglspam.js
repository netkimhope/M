const axios = require('axios');

module.exports.config = {
  name: 'nglspamm',
  version: '1.0.1',
  role: 0,
  hasPrefix: false,
  aliases: ['ngl', 'spam'],
  description: "NGL Spammer Command",
  usage: "nglspamm [username] [message] [amount]",
  credits: 'churchill',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const [username, message, amount] = args;
  const responseDiv = { className: '', textContent: '' };
  const logs = [];

  if (!username || !message || isNaN(amount) || amount <= 0) {
    responseDiv.className = 'error';
    responseDiv.textContent = 'nglspamm username message amount';
    api.sendMessage(responseDiv.textContent, event.threadID, event.messageID);
    return;
  }

  responseDiv.textContent = 'Sending messages...';
  api.sendMessage(responseDiv.textContent, event.threadID, event.messageID);

  for (let i = 0; i < amount; i++) {
    try {
      const response = await axios.get(`https://nash-api-end.onrender.com/ngl`, {
        params: {
          username,
          message,
          deviceId: 'myDevice',
          amount: 1
        }
      });
      const data = response.data;
      console.log('Response:', data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      logs.push(`Message ${i + 1} sent successfully`);
      await new Promise(resolve => setTimeout(resolve, 2000));  
    }
  }

  responseDiv.className = 'success';
  responseDiv.textContent = `All messages successfully sent.`;
  api.sendMessage(responseDiv.textContent, event.threadID, event.messageID);
  api.sendMessage(logs.join('\n'), event.threadID, event.messageID);
};
