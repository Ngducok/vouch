const Discord = require('discord.js')
const {EmbedBuilder} = require("discord.js");
const {MessageType} = require("discord-api-types/v9");

module.exports = {
    data: new  Discord.SlashCommandBuilder()
        .setName('vouch')
        .setDescription('Vouch')
        .addAttachmentOption((option)=> option
            .setName("image")
            .setDescription("Bằng chứng")),
    async execute(interaction) {
        if (interaction.channel.id !== config.channel_id) return interaction.reply({
            content: "Không thể vouch tại kênh này",
            ephemeral: true
        })
        const image = interaction.options.getAttachment("image");
        const embed = new EmbedBuilder()
            .setDescription(`${interaction.user} +1 legit`);
        if (image && ['image/jpeg', 'image/png'].includes(image.contentType)) {
            embed.setImage(image.url);
        }
        let channelName = config.channel_name;
        const channel = interaction.channel;
        await interaction.deferReply({
            ephemeral: true
        })
        await interaction.channel.send({
            embeds: [embed]
        })
        const msg_sums = await lots_of_messages_getter(channel, 1000);
        let json = [];
        for (let messages of msg_sums) {
            messages = messages.filter((msg) => msg.author.id === process.env.BOT_ID);
            json.push(...messages);
        }
        channelName = channelName.replace("{count}", json.length);
        try {
            channel.setName(channelName)
        }
        catch (error) {
            console.error(error)
        }
        await interaction.editReply({
            content: "Vouch thành công!",
        })
    }
}

async function lots_of_messages_getter(channel, limit = 500) {
    const sum_messages = [];
    let last_id;

    while (true) {
        const options = { limit: 100 };
        if (last_id) {
            options.before = last_id;
        }

        const messages = await channel.messages.fetch(options);
        sum_messages.push(messages);
        if (messages.last() === undefined) {
            break;
        }
        last_id = messages.last().id;

        if (messages.size !== 100 || sum_messages >= limit) {
            break;
        }
    }

    return sum_messages;
}
