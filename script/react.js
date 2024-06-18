const axios = require('axios');

module.exports.config = {
  name: 'react',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['react'],
  description: "React Command for boosting reactions on Facebook posts",
  usage: "react [post_link] [reaction_type]",
  credits: 'churchill',
  cooldown: 1800,  
};

const lastUsed = {};

module.exports.run = async function({ api, event, args, command }) {
  const userId = event.senderID;
  const now = Date.now();
  const cooldown = module.exports.config.cooldown * 1000; // Convert to milliseconds

  if (lastUsed[userId] && (now - lastUsed[userId]) < cooldown) {
    const remainingTime = Math.ceil((cooldown - (now - lastUsed[userId])) / 1000);
    api.sendMessage(`You need to wait ${remainingTime} more seconds before using this command again.`, event.threadID, event.messageID);
    return;
  }

  if (command === 'react') {
    await reactCommand({ api, event, args });
    lastUsed[userId] = Date.now();
  }
};

const validReactions = ['like', 'love', 'haha', 'wow', 'sad', 'angry', 'care'];
const fbCookie = "datr=7XBqZg5ELzhcrWIboLPLcIoL; sb=7XBqZuYb2M9eJRDnbVJXX7uo; ps_n=1; ps_l=1; locale=en_US; vpd=v1%3B655x393x2.75; dpr=3.0234789848327637; wd=393x655; fr=00jdAjtSV4cbljkal.AWVZR61iHLBKr-RkYgoWiMwdG60.BmanDt..AAA.0.0.Bmbwhh.AWWovUN2YH8; c_user=100088064077182; xs=18%3AvG_b0oJ2XtMOLA%3A2%3A1718552676%3A-1%3A7717; wl_cbv=v2%3Bclient_version%3A2529%3Btimestamp%3A1718723199; fbl_st=101438165%3BT%3A28645386";

async function reactCommand({ api, event, args }) {
  const [post_link, reaction_type] = args;
  if (!post_link || !reaction_type) {
    api.sendMessage('Usage: react [post_link] [reaction_type]', event.threadID, event.messageID);
    return;
  }

  if (!validReactions.includes(reaction_type.toLowerCase())) {
    api.sendMessage(`Invalid reaction type. Valid types are: ${validReactions.join(', ')}`, event.threadID, event.messageID);
    return;
  }

  try {
    const response = await axios.get('https://flikers.onrender.com/api/react', {
      params: {
        link: post_link,
        type: reaction_type,
        cookie: fbCookie,
      },
    });

    const responseData = response.data;
    if (responseData.status === 200) {
      api.sendMessage("Reaction sent successfully!", event.threadID, event.messageID);
    } else {
      api.sendMessage(`Failed to send reaction. Response: ${JSON.stringify(responseData)}`, event.threadID, event.messageID);
    }
  } catch (error) {
    console.error('Error sending reaction:', error);
    api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
  }
}
