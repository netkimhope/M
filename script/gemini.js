const axios = require("axios");
const tinyurl = require("tinyurl");

global.api = {
  s: "https://apis-samir.onrender.com"
};

const fm = {
  ' ': ' ',
  'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡',
  'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪',
  'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
  'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇',
  'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐',
  'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
};

function convertToFancy(text) {
  let convertedText = '';
  for (let char of text) {
    convertedText += fm[char] || char;
  }
  return convertedText;
}

function convertBoldAndItalic(text) {
  return text.replace(/\*(.*?)\*/g, (match, p1) => convertToFancy(p1));
}

module.exports = {
  config: {
    name: "gemini",
    aliases: ["bard"],
    version: "1.0",
    author: "Samir OE",
    countDown: 5,
    role: 0,
    category: "𝗔𝗜"
  },

  onStart: async function({ message, event, args, commandName }) {
    try {
      const senderID = event.senderID;
      let imageUrl;

      if (event.type === "message_reply" && ["photo", "sticker"].includes(event.messageReply.attachments?.[0]?.type)) {
        imageUrl = await tinyurl.shorten(event.messageReply.attachments[0].url);
      } else {
        const text = args.join(" ");
        const response = await axios.get(`${global.api.s}/Gemini?text=${encodeURIComponent(text)}&uid=${senderID}`);
        const data = response.data;

        if (data && data.candidates && data.candidates.length > 0) {
          const responseText = data.candidates[0].content.parts[0].text;
          const formattedText = convertBoldAndItalic(responseText);

          message.reply({
            body: formattedText
          }, (err, replyMessage) => {
            if (err) return;
            global.GoatBot.onReply.set(replyMessage.messageID, {
              commandName,
              messageID: replyMessage.messageID,
              author: senderID
            });
          });
          return;
        }
      }

      if (!imageUrl) {
        console.error("Error: Invalid message or attachment type");
        return;
      }

      const telegraphResponse = await axios.get(`${global.api.s}/telegraph?url=${encodeURIComponent(imageUrl)}&senderId=${senderID}`);
      const telegraphUrl = telegraphResponse.data.result.link;
      const text = args.join(" ");
      const geminiProResponse = await axios.get(`${global.api.s}/gemini-pro?text=${encodeURIComponent(text)}&url=${encodeURIComponent(telegraphUrl)}`);

      message.reply({
        body: geminiProResponse.data
      });

    } catch (error) {
      console.error("Error:", error.message);
    }
  },

  onReply: async function({ message, event, Reply, args }) {
    try {
      const { author, commandName } = Reply;
      if (event.senderID !== author) return;

      const text = args.join(" ");
      const response = await axios.get(`${global.api.s}/Gemini?text=${encodeURIComponent(text)}&uid=${event.senderID}`);
      const data = response.data;

      if (data && data.candidates && data.candidates.length > 0) {
        const responseText = data.candidates[0].content.parts[0].text;
        const formattedText = convertBoldAndItalic(responseText);

        message.reply({
          body: formattedText
        }, (err, replyMessage) => {
          if (err) return;
          global.GoatBot.onReply.set(replyMessage.messageID, {
            commandName,
            messageID: replyMessage.messageID,
            author: event.senderID
          });
        });
      }

    } catch (error) {
      console.error("Error:", error.message);
    }
  }
};
