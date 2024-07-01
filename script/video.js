const axios = require('axios');
const ytdl = require('@distube/ytdl-core');
const YouTubeAPI = require('simple-youtube-api');
const fs = require('fs-extra');

module.exports.config = {
    name: 'video',
    version: '1.0.0',
    hasPermssion: 0,
    credits: 'CatalizCS mod video by Đăng',
    description: 'Play video from YouTube',
    usePrefix: true,
    commandCategory: 'music',
    usages: 'video [Text]',
    cooldowns: 10,
    dependencies: {
        '@distube/ytdl-core': '',
        'simple-youtube-api': '',
        'fs-extra': '',
        'axios': ''
    },
    envConfig: {
        'YOUTUBE_API': 'AIzaSyDEE1-zZSRVI8lTaQOVsIAQFgL-_BJKvhk'
    }
};

module.exports.handleReply = async function({ api, event, handleReply }) {
    const ytdl = require('@distube/ytdl-core');
    const { createReadStream, createWriteStream, unlinkSync, statSync } = require('fs-extra');

    try {
        const res = await ytdl.getInfo(handleReply.link[event.body - 1]);
        const body = res.videoDetails.title;

        api.sendMessage(`Downloading Video!\n❍━━━━━━━━━━━━❍\n${body}\n❍━━━━━━━━━━━━❍\nThis may take a while!`, event.threadID, (err, info) =>
            setTimeout(() => { api.unsendMessage(info.messageID); }, 100000));

        ytdl(handleReply.link[event.body - 1])
            .pipe(createWriteStream(__dirname + `/cache/${handleReply.link[event.body - 1]}.mp4`))
            .on('close', () => {
                if (statSync(__dirname + `/cache/${handleReply.link[event.body - 1]}.mp4`).size > 26214400) {
                    return api.sendMessage('The file could not be sent because it is larger than 25MB.', event.threadID, () => unlinkSync(__dirname + `/cache/${handleReply.link[event.body - 1]}.mp4`), event.messageID);
                } else {
                    return api.sendMessage({ body: `${body}`, attachment: createReadStream(__dirname + `/cache/${handleReply.link[event.body - 1]}.mp4`) }, event.threadID, () => unlinkSync(__dirname + `/cache/${handleReply.link[event.body - 1]}.mp4`), event.messageID);
                }
            })
            .on('error', (error) => api.sendMessage(`There was a problem while processing the request, error: \n${error}`, event.threadID, event.messageID));
    } catch (error) {
        api.sendMessage("Your request could not be processed!", event.threadID, event.messageID);
    }
    return api.unsendMessage(handleReply.messageID);
};

module.exports.run = async function({ api, event, args }) {
    const ytdl = require('@distube/ytdl-core');
    const YouTubeAPI = require('simple-youtube-api');
    const { createReadStream, createWriteStream, unlinkSync, statSync } = require('fs-extra');
    const youtube = new YouTubeAPI(process.env.YOUTUBE_API);
    const keyapi = process.env.YOUTUBE_API;

    if (args.length == 0 || !args) {
        return api.sendMessage('Search cannot be left blank!', event.threadID, event.messageID);
    }

    const keywordSearch = args.join(' ');
    const videoPattern = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm;
    const urlValid = videoPattern.test(args[0]);

    if (urlValid) {
        try {
            let id = args[0].split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
            id = (id[2] !== undefined) ? id[2].split(/[^0-9a-z_\-]/i)[0] : id[0];

            ytdl(args[0])
                .pipe(createWriteStream(__dirname + `/cache/${id}.mp4`))
                .on('close', () => {
                    if (statSync(__dirname + `/cache/${id}.mp4`).size > 26214400) {
                        return api.sendMessage('The file could not be sent because it is larger than 25MB.', event.threadID, () => unlinkSync(__dirname + `/cache/${id}.mp4`), event.messageID);
                    } else {
                        return api.sendMessage({ attachment: createReadStream(__dirname + `/cache/${id}.mp4`) }, event.threadID, () => unlinkSync(__dirname + `/cache/${id}.mp4`), event.messageID);
                    }
                })
                .on('error', (error) => api.sendMessage(`There was a problem while processing the request, error: \n${error}`, event.threadID, event.messageID));
        } catch {
            api.sendMessage("Your request could not be processed!", event.threadID, event.messageID);
        }
    } else {
        try {
            let link = [], msg = "", num = 0, numb = 0;
            let imgthumnail = [];
            const results = await youtube.searchVideos(keywordSearch, 6);

            for (let value of results) {
                if (typeof value.id === 'undefined') return;
                link.push(value.id);

                const datab = (await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${value.id}&key=${keyapi}`)).data;
                const gettime = datab.items[0].contentDetails.duration;
                const time = gettime.slice(2);

                const datac = (await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${value.id}&key=${keyapi}`)).data;
                const channel = datac.items[0].snippet.channelTitle;

                const folderthumnail = __dirname + `/cache/${numb += 1}.png`;
                const linkthumnail = `https://img.youtube.com/vi/${value.id}/maxresdefault.jpg`;
                const getthumnail = (await axios.get(`${linkthumnail}`, { responseType: 'arraybuffer' })).data;

                fs.writeFileSync(folderthumnail, Buffer.from(getthumnail, 'utf-8'));
                imgthumnail.push(fs.createReadStream(__dirname + `/cache/${numb}.png`));

                msg += (`${num += 1}. ${value.title}\nTime: ${time}\nChannel: ${channel}\n❍━━━━━━━━━━━━❍\n`);
            }

            const body = `There are ${link.length} results matching your search keyword:\n\n${msg}\nPlease reply (feedback) to choose one of the above searches.`;
            return api.sendMessage({ attachment: imgthumnail, body: body }, event.threadID, (error, info) => global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                link
            }), event.messageID);

        } catch (error) {
            api.sendMessage(`There was a problem processing the request: ${error.message}`, event.threadID, event.messageID);
        } finally {
            for (let ii = 1; ii < 7; ii++) {
                unlinkSync(__dirname + `/cache/${ii}.png`);
            }
        }
    }
};
