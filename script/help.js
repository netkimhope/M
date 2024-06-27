const axios = require('axios');

module.exports.config = {
    name: 'help',
    version: '1.0.0',
    role: 0,
    hasPrefix: false,
    aliases: ['help'],
    description: "Beginner's guide",
    usage: "Help [page] or [command]",
    credits: 'Developer',
};

module.exports.run = async function ({ api, event, enableCommands, args, Utils, prefix }) {
    const input = args.join(' ');

    try {
        const eventCommands = enableCommands[1].handleEvent;
        const commands = enableCommands[0].commands;

        const fetchRandomBibleVerse = async () => {
            try {
                const response = await axios.get('https://deku-rest-api-gadz.onrender.com/bible');
                return `📖 ${response.data.verse}\n- ${response.data.reference}`;
            } catch (error) {
                console.error('Error fetching Bible verse:', error);
                return 'An error occurred while fetching the Bible verse.';
            }
        };

        const randomBibleVerse = await fetchRandomBibleVerse();

        if (!input || !isNaN(input)) {
            const commandsPerPage = 10;
            const page = input ? parseInt(input) : 1;
            const totalPages = Math.ceil(commands.length / commandsPerPage);

            if (page < 1 || page > totalPages) {
                return api.sendMessage(`Page ${page} does not exist. Please choose a page between 1 and ${totalPages}.`, event.threadID, event.messageID);
            }

            const start = (page - 1) * commandsPerPage;
            const end = Math.min(start + commandsPerPage, commands.length);

            let helpMessage = `🔴🟢🟡\n\n====『 AUTOBOT COMMANDS 』==\n`;
            for (let i = start; i < end; i++) {
                helpMessage += `➜ ${commands[i]}\n`;
            }

            helpMessage += `\n====『FEATURE LIST』====\n`;
            eventCommands.forEach((eventCommand, index) => {
                helpMessage += `➜ ${eventCommand}\n`;
            });

            helpMessage += `\nPage: ${page}/${totalPages}\nTo view information about a specific command, type '${prefix}help command name.'\n\n𝗥𝗔𝗡𝗗𝗢𝗠 𝗕𝗜𝗕𝗟𝗘 𝗩𝗘𝗥𝗦𝗘:\n${randomBibleVerse}`;
            api.sendMessage(helpMessage, event.threadID, event.messageID);
        } else {
            const command = [...Utils.handleEvent, ...Utils.commands].find(([key]) => key.includes(input?.toLowerCase()))?.[1];
            if (command) {
                const {
                    name,
                    version,
                    role,
                    aliases = [],
                    description,
                    usage,
                    credits,
                    cooldown,
                    hasPrefix
                } = command;
                const roleMessage = role !== undefined ? (role === 0 ? '➛ Permission: user' : (role === 1 ? '➛ Permission: admin' : (role === 2 ? '➛ Permission: thread Admin' : (role === 3 ? '➛ Permission: super Admin' : '')))) : '';
                const aliasesMessage = aliases.length ? `➛ Aliases: ${aliases.join(', ')}\n` : '';
                const descriptionMessage = description ? `Description: ${description}\n` : '';
                const usageMessage = usage ? `➛ Usage: ${usage}\n` : '';
                const creditsMessage = credits ? `➛ Credits: ${credits}\n` : '';
                const versionMessage = version ? `➛ Version: ${version}\n` : '';
                const cooldownMessage = cooldown ? `➛ Cooldown: ${cooldown} second(s)\n` : '';
                const message = `「 Command 」\n\n➛ Name: ${name}\n${versionMessage}${roleMessage}\n${aliasesMessage}${descriptionMessage}${usageMessage}${creditsMessage}${cooldownMessage}`;
                api.sendMessage(message, event.threadID, event.messageID);
            } else {
                api.sendMessage('Command not found.', event.threadID, event.messageID);
            }
        }
    } catch (error) {
        console.log(error);
    }
};
