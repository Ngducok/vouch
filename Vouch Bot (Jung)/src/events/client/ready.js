const Discord = require('discord.js');

module.exports = {
    name: Discord.Events.ClientReady,
    once: true,
    async execute(client) {
        main.logger.info(`Logged in as ${client.user.tag}`);
    }
}