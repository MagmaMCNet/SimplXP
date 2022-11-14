// Import 
import DiscordJS, { User } from 'discord.js'
import dotenv from 'dotenv';
import Database from "easy-json-database";
const express = require('express');
const chalk = require('chalk');
import chalkAnimation from 'chalk-animation';
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

async function CreateCommand(func: any, Name: string)
{
    CommandHandler?.create(func);
    console.log(chalk.cyan('Command')+": "+ chalk.blue(Name)+chalk.cyan(" Added,"))
}

async function AddCommands() 
{
    //#region Ping
    CreateCommand({
        name: 'ping',
        description: 'Gets The Ping Of The Bot'
    }, "Ping")
    //#endregion

    //#region level
    CreateCommand({
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
    }, "Level")
    //#endregion

    //#region xp
    CreateCommand({
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
    }, "XP")
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
            .setDescription(options.getUser('user')?.username+" Is Currently Level: "+GetUser(Command.guildId, userid)["Level"]);
            Command.reply({
               
                embeds: [embed]
            })
        } else {
            Command.reply({
                ephemeral: true,
                content:`That Is A Bot Not A User` 
            })
        }
    }
    else if (commandName == "xp") 
    {
        if (!options.getUser('user')?.bot) {
            var userid: any = options.getUser("user")?.id;
            GetUser(Command.guild?.id, userid);
            const user: any = GetUser(Command.guildId, userid);
            const embeds:DiscordJS.MessageEmbed = new DiscordJS.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("XP")
            .setDescription(options.getUser('user')?.username+" Has "+user["XP"]+
                `XP,\n And Only Needs ${user["Level"]*user["Level"]*30*1.5/Number(process.env.XPMULTIPLIER)} More XP To Level Up To Level: ${user["Level"]+1}`);
            Command.reply({
               
                embeds: [embeds]
            })
        } else {
            Command.reply({
                ephemeral: true,
                content:`That Is A Bot Not A User` 
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
    AddXP(Server, UserID, message);
}

function AddXP(ServerID: any, UserID: string, Message: DiscordJS.Message)
{
    var server:any = MMC.Database.get(ServerID.toString());
    var user = server["Users"][UserID];
    user["XP"] += 1;
    if (user["Level"]*user["Level"]*30*1.5/Number(process.env.XPMULTIPLIER) <= user["XP"])
    {
        user["XP"] = 1;
        user["Level"] += 1;
        const embed = new DiscordJS.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("LevelUp")
            .setDescription("<@" + Message.author.id + ">"+" Just Leveled Up To: "+user["Level"]);
        Message.channel.send({ embeds: [embed] });
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


MMC.Client.on('ready', async () =>
{
    if (MMC.Client.user?.bot) {
        console.clear();
        console.log("Logged In With Bot: '"+chalk.blue(`${MMC.Client.user?.username}`)+"'");
    } else {
        console.clear();
        console.log(chalk.rgb(255,10,0)("Error User Is Not A Bot"));
        console.log(chalk.rgb(250,70,0)(MMC.Client.user));
        process.exit(1);
    }
    var isready: boolean = true;
    if (isReplit) {
        isready=false;
        const server = express();
        server.all('/', (req:any, res:any) => {
            res.send('Your Bot Is Running');
        });
        server.listen(5000, () => {
            isready = true;
        });
    }
    function checkFlag() {
        if(isready === false) {
           setTimeout(checkFlag, 100);
        } else {
            console.log("Listening On Port: '"+chalk.blue('5000')+"'");
            chalkAnimation.rainbow('---------------------').render();
            console.log("Adding Commands");
            CommandHandler = MMC.Client.application?.commands;
            AddCommands();
        }
    }
    checkFlag();
    
});


MMC.Client.on('messageCreate', async (message) => {OnMessage(message)});
MMC.Client.on('interactionCreate', async (inter) => {
    if(!inter.isCommand()){
        return;
    }
    SendCommand(inter);
})


MMC.Client.login(process.env.TOKEN);