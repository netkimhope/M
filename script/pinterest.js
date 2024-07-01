const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
    name: "pinterest",
    version: "1.0.0",
    role: 0,
    credits: "Joshua Sy",
    description: "Image search",
    hasPrefix: false,
    commandCategory: "Search",
    usages: "[Text]",
    cooldowns: 0,
};

module.exports.run = async function({ api, event, args }) {
    const keySearch = args.join(" ");
    if (!keySearch.includes("-")) {
        return api.sendMessage('Please enter in the format, example: pinterest Coco Martin - 10 (20 limit only)', event.threadID, event.messageID);
    }

    const keySearchs = keySearch.substr(0, keySearch.indexOf('-')).trim();
    const numberSearch = Math.min(parseInt(keySearch.split("-").pop().trim()), 20) || 6; // Ensure it's a number and within limit

    try {
        const res = await axios.get(`https://gpt4withcustommodel.onrender.com/api/pin?title=${encodeURIComponent(keySearchs)}&count=20`);
        const data = res.data.data;

        if (!data || data.length === 0) {
            return api.sendMessage('No results found.', event.threadID, event.messageID);
        }

        let imgData = [];
        let num = 0;

        for (let i = 0; i < numberSearch; i++) {
            const path = `${__dirname}/cache/${num += 1}.jpg`;
            const imageBuffer = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
            fs.writeFileSync(path, Buffer.from(imageBuffer, 'utf-8'));
            imgData.push(fs.createReadStream(path));
        }

        api.sendMessage({
            attachment: imgData,
            body: `${numberSearch} search results for keyword: ${keySearchs}`
        }, event.threadID, event.messageID, async () => {
            // Clean up files after sending the message
            for (let i = 1; i <= num; i++) {
                const path = `${__dirname}/cache/${i}.jpg`;
                if (fs.existsSync(path)) {
                    fs.unlinkSync(path);
                }
            }
        });
    } catch (error) {
        console.error('Error fetching images:', error);
        api.sendMessage('An error occurred while fetching images. Please try again later.', event.threadID, event.messageID);
    }
};
