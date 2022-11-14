// Import 
import DiscordJS, { User } from 'discord.js'
import dotenv from 'dotenv';
import Database from "easy-json-database";
var colors = require('colors');
const MMC = 
{
    Client: new DiscordJS.Client({
        intents: [DiscordJS.Intents.FLAGS.GUILDS, DiscordJS.Intents.FLAGS.GUILD_MESSAGES]
    }),
    Database: new Database("./Database.json"),
    GlobalPrefix: null,
};

// Main
var CommandHandler: any;
async function AddCommands() 
{

    //#region Ping
    CommandHandler?.create({
        name: 'ping',
        description: 'Gets The Ping Of The Bot'
    })
    console.log(colors.data("Command: ping Added,"))
    //#endregion

    //#region level
    CommandHandler?.create({
        name: 'level',
        description: 'Get The Current Level Of A User',
        options: [
            {
                name: 'user',
                description: "User",
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER

            }
        ]
    })
    console.log(colors.data("Command: level Added,"))
    //#endregion

    //#region xp
    CommandHandler?.create({
        name: 'xp',
        description: 'Get The Current XP Of A User',
        options: [
            {
                name: 'user',
                description: "User",
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER

            }
        ]
    })
    console.log(colors.data("Command: XP Added,"))
    //#endregion

}


async function SendCommand(Command: DiscordJS.CommandInteraction) 
{
    const { commandName, options } = Command;

    if (commandName == "ping") {
        const embed = new DiscordJS.MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Ping")
        .setDescription("Message Ping: "+(Date.now()-Command.createdTimestamp).toString()+"ms\nAPI Ping: "+MMC.Client.ws.ping.toString()+"ms");
        Command.reply({
           
            embeds: [embed]
        })
    }

    else if (commandName == "level") 
    {
        if (!options.getUser('user')?.bot) {

            var userid: any = options.getUser("user")?.id;
            GetUser(Command.guild?.id, userid);
            
            const embed = new DiscordJS.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Level")
            .setDescription("Current Level Of '"+options.getUser('user')?.username+"': "+GetUser(Command.guildId, userid)["Level"]);
            Command.reply({
               
                embeds: [embed]
            })
        } else {
            Command.reply({
                ephemeral: true,
                content:`bruh` 
            })
        }
    }
    else if (commandName == "xp") 
    {
        if (!options.getUser('user')?.bot) {
            var userid: any = options.getUser("user")?.id;
            UserCheck(Command.guild?.id, userid)
            Command.reply({
                content: `${GetUser(Command.guild?.id, userid)["XP"]}`,
            })
        } else {
            Command.reply({
                ephemeral: true,
                content:`bruh` 
            })
        }
    }
}
async function UserCheck(serverid: any, userid: any) 
{
    try {GetUser(serverid.id, userid)["Level"];}catch{AddNewUser(serverid.id, userid)}
}
async function OnMessage(message: DiscordJS.Message)
{
    var Server:any = message.guildId;
    var UserID:string = message.author.id;
    if (message.author.bot) return "IsBot";
    if (GetUser(Server, UserID) == null) return
    AddXP(Server, UserID);
}

function AddXP(ServerID: any, UserID: string)
{
    var server:any = MMC.Database.get(ServerID.toString());
    var user = server["Users"][UserID];
    user["XP"]+= 1;
    if (user["Level"]*user["Level"]*100*1.5 <= user["XP"])
    {
        user["XP"] = 1;
        user["Leve"] += 1;
    }
    MMC.Database.set(ServerID.toString(), server);
}
function GetUser(ServerID: any, UserID: any)
{
    
    try {
    var server: any = MMC.Database.get(ServerID.toString());
    if (UserID != null) {
        return server["Users"][UserID.toString()];
    } else {
        return server["Users"];
    }
    } catch {
        AddNewUser(ServerID, UserID);
        return null;
    }
}
function AddNewUser(ServerID: any, UserID: string)
{
    try {
    var newuser: any = MMC.Database.get(ServerID.toString());
    newuser["Users"][UserID.toString()] =
    {
        "Level": 1,
        "XP": 1
    };
    MMC.Database.set(ServerID.toString(), newuser);
    } catch {
        MMC.Database.set(ServerID.toString(), {"Users": {}})
        AddNewUser(ServerID, UserID);
    }
}





// Startup
dotenv.config();
var isReplit: boolean = false;
if (process.env.REPLIT?.toLowerCase() == "yes") {
    isReplit = true;
}
else if (process.env.REPLIT?.toLowerCase() == "true") {
    isReplit = true;
}
else if (process.env.REPLIT?.toLowerCase() == "1") {
    isReplit = true;
}
colors.setTheme(
{
    info: 'rainbow',
    prompt: 'grey',
    data: 'blue',
    warn: 'yellow',
    error: 'red'
});

MMC.Client.on('ready', () =>
{
    if (MMC.Client.user?.bot) {
        console.clear();
        console.log("Logged In With Bot: '"+colors.info(`${MMC.Client.user?.username}`)+"'");
    } else {
        console.clear();
        console.log(colors.error("Error User Is Not A Bot"));
        console.log(colors.warn(MMC.Client.user));
        process.exit(1);
    }
    console.log('---------------------');
    console.log("Adding Commands");
    CommandHandler = MMC.Client.application?.commands;
    AddCommands();
});


MMC.Client.on('messageCreate', async (message) => {OnMessage(message)});
MMC.Client.on('interactionCreate', async (inter) => {
    if(!inter.isCommand()){
        return;
    }
    SendCommand(inter);
})


/* Checking if the bot is running on repl.it and if it is it will start a server on port 5454. */

MMC.Client.login(process.env.TOKEN);
if (isReplit) {
    const express = require('express');
    const server = express();
    server.all('/', (req:any, res:any) => {
        res.send('Your Bot Is Running');
    });

    server.listen(5454, () => {
        console.log("Server is Ready!");
    });

}