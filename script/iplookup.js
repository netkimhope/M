const { get } = require('axios');

module.exports.config = {
    name: "iplookup",
    version: "1.0.0",
    role: 0,
    credits: "Deku",
    description: "Get information about an IP address",
    hasPrefix: false,
    usages: "[IP address]",
    cooldown: 0,
    aliases: ["ip"]
};

module.exports.run = async function({ api, event, args }) {
    function r(msg) {
        api.sendMessage(msg, event.threadID, event.messageID);
    }

    if (!args[0]) return r('Missing IP address! Please provide an IP address.');

    const ip = args[0];

    try {
        const response = await get(`https://deku-rest-api-gadz.onrender.com/iplookup?ip=${encodeURIComponent(ip)}`);
        const data = response.data;

        r(`Information for IP ${ip}:\n\n` +
          `Country: ${data.country}\n` +
          `Region: ${data.region}\n` +
          `City: ${data.city}\n` +
          `ISP: ${data.isp}\n` +
          `Latitude: ${data.latitude}\n` +
          `Longitude: ${data.longitude}`);
    } catch (e) {
        r(`Error: ${e.message}`);
    }
};
