import DiscordJS, { Snowflake } from 'discord.js';
import dotenv from 'dotenv';
var colors = require('colors');
const Database = require("easy-json-database");

// Startup
dotenv.config();
colors.setTheme(
{
    info: 'rainbow',
    prompt: 'grey',
    data: 'blue',
    warn: 'yellow',
    error: 'red'
});
   

const MMC = 
{
    Client: new DiscordJS.Client({
        intents: [Snowflake.Guilds, Snowflake.MessageContent ]
    }),
    G_Database: new Database("./.env.json"),
    Database: new Database("./Data.json"),
    GlobalPrefix: null,
};

MMC.Client.on('ready', () =>
{
    if (!MMC.Client.user?.bot) {
        console.clear();
        console.log("Logged In With Bot: '"+colors.info(`${MMC.Client.user?.username}`)+"'");
    } else {
        console.clear();
        console.log(colors.error("Error User Is Not A Bot"));
        console.log(colors.warn(MMC.Client.user));
        process.exit(1);
    }
    console.log('---------------------');

});


MMC.Client.login(process.env.TOKEN);