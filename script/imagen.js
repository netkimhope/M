const axios = require('axios');

module.exports.config = {
  name: 'image',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['imagen', 'generateImage'],
  description: "imaging eating what?",
  usage: "image [prompt] [model]",
  credits: 'chillingbing',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const prompt = args.slice(0, -1).join(' ');
  const model = args.slice(-1)[0];

  if (!prompt || !model) {
    api.sendMessage('Please provide a prompt and model for image generation. Models available: v1, v2, v2-beta, v3, lexica, prodia, simurg, animefy, raava, shonin.', event.threadID, event.messageID);
    return;
  }

  const validModels = ['v1', 'v2', 'v2-beta', 'v3', 'lexica', 'prodia', 'simurg', 'animefy', 'raava', 'shonin'];
  if (!validModels.includes(model)) {
    api.sendMessage('Invalid model. Please use one of the following models: v1, v2, v2-beta, v3, lexica, prodia, simurg, animefy, raava, shonin.', event.threadID, event.messageID);
    return;
  }

  api.sendMessage(`🎨 Generating image for: "${prompt}" using model: "${model}", please wait...`, event.threadID, event.messageID);

  try {
    const dodong = await axios.post('https://openapi-idk8.onrender.com/imagen', {
      prompt: prompt,
      model: model,
      n: 1,
      size: '1024x1024'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const imageUrl = dodong.data.generated_images[0];

    const nognog = await api.getUserInfo(event.senderID);
    const pogi = nognog[event.senderID].name;

    api.sendMessage({
      body: `Here is the generated image for: "${prompt}"\nModel: ${model}\n\nRequested by: ${pogi}`,
      attachment: await axios.get(imageUrl, { responseType: 'stream' }).then(res => res.data)
    }, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage('An error occurred while generating the image.', event.threadID, event.messageID);
  }
};
