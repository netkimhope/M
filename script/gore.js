const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: 'gore',
    version: '1.0.0',
    role: 0,
    hasPrefix: true,
    aliases: ['gore'],
    description: 'Fetches a random gore video',
    usage: 'gore',
    credits: 'Developer',
};

module.exports.run = async function({ api, event }) {
    try {
        const chilliResponse = await axios.get('https://nash-rest-api.replit.app/gore');
        const bingchilliVideoUrl = chilliResponse.data.url; // dito yung na rereturn ng fieldname

        if (bingchilliVideoUrl) {
            // Download the video
            const videoPath = path.resolve(__dirname, 'tempVideo.mp4');
            const response = await axios({
                url: bingchilliVideoUrl,
                method: 'GET',
                responseType: 'stream'
            });

            const writer = fs.createWriteStream(videoPath);

            response.data.pipe(writer);

            writer.on('finish', () => {
                api.sendMessage({ 
                    body: '🎥 Fetching random gore content...', 
                    attachment: fs.createReadStream(videoPath) 
                }, event.threadID, event.messageID, () => {
                    // Delete the temp video file after sending
                    fs.unlink(videoPath, (err) => {
                        if (err) {
                            console.error('Failed to delete temp video file:', err);
                        }
                    });
                });
            });

            writer.on('error', (error) => {
                console.error('Error writing video file:', error);
                api.sendMessage('❌ Failed to fetch the gore video. Please try again later.', event.threadID, event.messageID);
            });

        } else {
            api.sendMessage('❌ Failed to fetch the gore video. Please try again later.', event.threadID, event.messageID);
        }
    } catch (chillimansiError) {
        console.error('Error fetching gore video:', chillimansiError);
        api.sendMessage('⚠️ An error occurred while fetching the gore video.', event.threadID, event.messageID);
    }
};
