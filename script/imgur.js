const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

module.exports.config = {
  name: 'imgur',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['imgur'],
  description: "Imgur intonlimk",
  usage: "imgur [path-to-image]",
  credits: 'churchill',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const hatdog = args[0];
  const chillimansi = { className: '', textContent: '' };

  if (!hatdog) {
    chillimansi.className = 'error';
    chillimansi.textContent = 'Usage: imgur [path-to-image]';
    api.sendMessage(chillimansi.textContent, event.threadID, event.messageID);
    return;
  }

  chillimansi.textContent = 'Uploading image...';
  api.sendMessage(chillimansi.textContent, event.threadID, event.messageID);

  try {
    const form = new FormData();
    form.append('image', fs.createReadStream(hatdog));

    const response = await axios.post('https://markdevs-api.onrender.com/api/imgur', form, {
      headers: {
        ...form.getHeaders(),
      }
    });

    const chilli = response.data;
    chillimansi.className = 'success';
    chillimansi.textContent = `Uploaded successfully ${chilli.successfullyUploaded} image(s)\nFailed to upload: ${chilli.failedToUpload}\nImage link: ${chilli.link}`;
    api.sendMessage(chillimansi.textContent, event.threadID, event.messageID);
  } catch (error) {
    console.error('Error:', error);
    chillimansi.className = 'error';
    chillimansi.textContent = 'An error occurred while uploading your image.';
    api.sendMessage(chillimansi.textContent, event.threadID, event.messageID);
  }
};
