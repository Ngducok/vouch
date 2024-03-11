const Discord = require("discord.js");
const { GatewayIntentBits, Partials } = require('discord.js');
const { Routes } = require('discord-api-types/v10');
const fs = require("fs");
const {BaseLogger} = require("./logger/BaseLogger");
const {CancelCrash} = require("./crash/CancelCrash");

class Client {

    constructor() {
        this.bot = new Discord.Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.MessageContent
            ],
            partials: [
                Partials.User,
                Partials.Channel,
                Partials.Reaction,
                Partials.Message
            ]
        });
        this.logger = new BaseLogger();
        new CancelCrash();
    }

    registerEvents() {
        const eventDir = fs.readdirSync('./src/events');
        for (const dir of eventDir) {
            const eventFiles = fs.readdirSync(`./src/events/${dir}`).filter(file => file.endsWith('.js'));
            for (const file of eventFiles) {
                const event = require(`./events/${dir}/${file}`);
                if (event.once) {
                    this.bot.once(event.name, (...args) => event.execute(...args));
                } else {
                    this.bot.on(event.name, (...args) => event.execute(...args));
                }
            }
        }
        this.logger.info(`Registered ${eventDir.length} events!`);
    }

    async registerCommands() {
        this.bot.commands = new Discord.Collection();
        const commandDir = fs.readdirSync('./src/commands');
        let commands = [];
        for (const dir of commandDir) {
            const commandFiles = fs.readdirSync(`./src/commands/${dir}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`./commands/${dir}/${file}`);
                await this.bot.commands.set(command.data.name, command)
                console.log(`Command ${command.data.name} loaded!`)
                commands.push(command.data.toJSON());
            }
        }
        try {
            const rest = new Discord.REST({version: '10'}).setToken(process.env.BOT_TOKEN);
            try {
                await rest.put(
                    Routes.applicationCommands(process.env.BOT_ID),
                    {body: commands},
                )
            } catch (e) {
                console.log(e.message);
            }
        } catch (e) {
            console.log(e.message)
        }
        this.logger.info(`Registered ${this.bot.commands.size} commands!`);
    }

    async login(token) {
        await this.bot.login(token);
        await this.registerEvents();
        await this.registerCommands();
    }
}

module.exports = {
    Client
}