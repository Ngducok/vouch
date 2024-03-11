const Discord = require('discord.js')

module.exports = {
    name: Discord.Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (!interaction.isCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            console.log(error)
            await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
        }
    }
}