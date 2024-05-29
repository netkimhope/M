const axios = require('axios');
const cheerio = require('cheerio');

module.exports.config = {
    name: 'lyrics',
    version: '1.0.0',
    hasPermision: 0,
    credits: 'cat',
    usePrefix: true,
    description: 'Fetch and display the lyrics of a song',
    commandCategory: 'fun',
    usages: '<song title>',
    cooldowns: 10
};

module.exports.run = async ({ api, event, args }) => {
    const songTitle = args.join(' ');
    
    if (!songTitle) {
        return api.sendMessage('Please provide a song title.', event.threadID, event.messageID);
    }

    const searchUrl = `https://lyrics.fandom.com/wiki/Special:Search?query=${encodeURIComponent(songTitle)}`;

    try {
        // Fetch the search results page
        const searchResponse = await axios.get(searchUrl);
        const $ = cheerio.load(searchResponse.data);

        // Extract the first search result link
        const firstResultLink = $('.unified-search__result__title a').attr('href');
        
        if (!firstResultLink) {
            return api.sendMessage('No lyrics found for this song.', event.threadID, event.messageID);
        }

        // Fetch the lyrics page
        const lyricsPageResponse = await axios.get(`https://lyrics.fandom.com${firstResultLink}`);
        const $$ = cheerio.load(lyricsPageResponse.data);

        // Extract the lyrics text
        const lyrics = $$('.lyricbox').text().trim();

        if (!lyrics) {
            return api.sendMessage('Lyrics not found on the page.', event.threadID, event.messageID);
        }

        // Send the lyrics or part of them if too long
        const message = lyrics.length > 2000 ? lyrics.slice(0, 2000) + '...' : lyrics;

        await api.sendMessage(`🎵 Lyrics for "${songTitle}":\n\n${message}`, event.threadID, event.messageID);
    } catch (error) {
        console.error('Error fetching lyrics:', error);
        api.sendMessage('An error occurred while fetching the lyrics.', event.threadID, event.messageID);
    }
};
