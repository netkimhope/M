const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "artist",
    aliases: [],
    version: "1.0",
    author: "ST | Sheikh Tamim", // m.me/sheikh.tamim.lover for contact if there any issue
    role: 0,
    countDown: 15,
    category: "Artist AI",
    usage: `
{prefix}artist <prompt> | <model> | <style>
Model Name :-
1. lumina-v1
2. stable-diffusion-v1-5

All the style name :-      
1. Painting
2. Artistic Portrait
3. Magical
4. Cyberpunk
5. Steampunk
6. Photo
7. Oil Painting
8. Unreal Engine
9. Anime
10. Animation
11. Ghibli
12. Digital Painting
13. Game Art
14. Concept Painting
15. Futuristic
16. Drawing
17. Cinematic
18. 3D
19. Vaporwave
20. Synthwave
21. Psychedelic
22. Watercolor
23. Medieval Portrait
24. Blade Runner
25. Comic
26. Picasso
27. Super Hero
28. Van Gogh
29. Pixel Art
30. Charcoal
31. Landscape Painting
32. Concept Art
33. Video Game
34. Mosaic
35. Pro Photography
36. Nature Portrait
37. Fire Portrait
38. Floral Portrait
39. Fantasy Elf
40. Cyberpunk Street
41. Dreamy Impressionism
42. Fairy
43. Underwater Portrait
44. Autumn Girl
45. Fairytale Princess
46. Fairytale Prince
47. Glowwave Portrait
48. Vice City
49. Warrior Dwarf
50. Mythical DND Portrait
51. DND Portrait
52. Queen of Death
53. Game Arts Character
54. DND Characters
55. Watercolor Portraits
56. Steampunk Engineer
57. Zombie
58. Trippy Alien
59. Character Illustration
60. Professional Portraits
61. Greek Gods
62. Cybernetic Humanoid
63. Surreal Mountains
64. Solarpunk City
65. Dream Architecture
66. Futuristic City
67. RPG Animals
68. Cel Shaded
69. Dystopian Masked
70. Warrior Women
71. Tarot Cards
72. Interior Background
73. Interior Design
74. Themed Rooms
75. Intricate Interiors
76. Real Estate Interiors
77. Modern Rooms
78. 3D House
79. Tiny Dollhouses
80. 3D Fantasy Game
81. Mini Rooms
82. Origami Animals
83. Ancient Greek Marble
84. Low Poly Animals
85. 3D Fakemon
86. Round Object Render
87. 3D Animated
88. Floral Prints
89. Cute Sticker
90. Retro Butterflies
91. Fun Doodles`
  },

  onStart: async function ({ api, event, args }) {
    try {
      if (args.length < 3) {
        await api.sendMessage("⚠️ | Please provide a prompt, model number (1-2), and style number (1-91).", event.threadID, event.messageID);
        return;
      }

      const input = args.join(" ").split("|").map(arg => arg.trim());
      const [prompt, model, style] = input;

      const modelNo = parseInt(model, 10);
      const styleNo = parseInt(style, 10);

      if (isNaN(modelNo) || modelNo < 1 || modelNo > 2) {
        await api.sendMessage("⚠️ | Invalid model number. Please provide a number between 1 and 2.", event.threadID, event.messageID);
        return;
      }

      if (isNaN(styleNo) || styleNo < 1 || styleNo > 91) {
        await api.sendMessage("⚠️ | Invalid style number. Please provide a number between 1 and 91.", event.threadID, event.messageID);
        return;
      }

      const waitingMessage = await api.sendMessage(
        `⏳ | Processing your imagination

Prompt: ${prompt}
Model: ${modelNo}
Style: ${styleNo}

Please wait a few seconds...`, event.threadID);

      const apiUrl = `https://artistai.onrender.com/generateImages?prompt=${encodeURIComponent(prompt)}&model=${modelNo}&style=${styleNo}`;
      const response = await axios.get(apiUrl);

      if (response.status !== 200) {
        throw new Error(`Failed to fetch images from API. Status: ${response.status}`);
      }

      const images = response.data;
      const attachments = [];

      for (let i = 0; i < images.length; i++) {
        const base64String = images[i];
        const imageBuffer = Buffer.from(base64String, 'base64');
        const tempFilePath = path.join(__dirname, `generated_image_${i + 1}.jpg`);
        fs.writeFileSync(tempFilePath, imageBuffer);
        const imageStream = fs.createReadStream(tempFilePath);
        attachments.push(imageStream);
      }

      await api.unsendMessage(waitingMessage.messageID);

      await api.sendMessage({
        attachment: attachments,
        body: `
Your Prompt: "${prompt}"
Model: ${modelNo}
Style: ${styleNo}

Here are your generated images`,
      }, event.threadID);

      for (let i = 0; i < images.length; i++) {
        const tempFilePath = path.join(__dirname, `generated_image_${i + 1}.jpg`);
        fs.unlinkSync(tempFilePath);
      }

    } catch (error) {
      console.error('Error in artist command:', error);
      await api.sendMessage("⚠️ | Failed to generate or send images. Please try again later.", event.threadID, event.messageID);
    }
  }
};
