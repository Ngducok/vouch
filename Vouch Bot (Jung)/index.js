const {
    Client
} = require('./src/client')
require('dotenv').config();

global.main = new Client();
global.client = main.bot;
global.config = require("./config.json");
main.login(process.env.BOT_TOKEN);