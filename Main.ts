
/* Importing the modules. */
import DiscordJS, { ColorResolvable, TextChannel } from 'discord.js'
import dotenv from 'dotenv';
import fs from 'fs';
const express = require('express');
const chalk = require('chalk');
import chalkAnimation from 'chalk-animation';
/* reads and writes JSON files. */
class Database 
{
    jsonfile = ""
    constructor(filename: string = "db.json")
    {
        this.jsonfile = filename
    }
    Read(): any
    {
        if (!fs.existsSync(this.jsonfile)) {
            fs.writeFileSync(this.jsonfile, JSON.stringify({}, null, 4), "utf-8");
        }
        return JSON.parse(fs.readFileSync(this.jsonfile, 'utf8'));
    }
    Write(data:Object, Indent:number = 4)
    {
        fs.writeFileSync(this.jsonfile, JSON.stringify(data, null, Indent), "utf-8");
    }
}
/**
 * It checks if a JSON object has a key.
 * @param {JSON} Data - The JSON object you want to check
 * @param {string} key - The key to check for
 * @returns A boolean.
 */
function JsonHas(Data:any, key:string)
{
    var returner:boolean = false;
    try {
        var _:any = Data[key];
        if (_ !== undefined) returner = true;
    } catch {}
    return returner;
}
const MMC = 
{
    Client: new DiscordJS.Client({
        intents: [DiscordJS.Intents.FLAGS.GUILDS, DiscordJS.Intents.FLAGS.GUILD_MESSAGES]
    }),
    Database: new Database('Database.json'),
    Version: "0.1",
    Author: "609445260606701593",
    HexColor: '#30018f'
};

/*
    ==============================================================================================================================================================
                                                                            Main
*/
var CommandHandler: any;

/**
 * It returns a new DiscordJS.MessageEmbed object with the color, title, and description set to the
 * parameters passed in.
 * @param {string} Title - The title of the embed.
 * @param {string} Description - The description of the embed.
 * @param {ColorResolvable} [HexColor=#0099ff] - The color of the embed.
 * @returns A DiscordJS.MessageEmbed object.
 */
function QuickEmbed(Title: string, Description: string, HexColor: ColorResolvable = "#0099ff", Image: string = ""): DiscordJS.MessageEmbed 
{
    return new DiscordJS.MessageEmbed()
    .setColor(HexColor)
    .setTitle(Title)
    .setDescription(Description)
    .setThumbnail(Image);
}

/**
 * It creates a Slash command.
 * @param Command - DiscordJS.ApplicationCommandData
 * @param {string} Name - The name of the command
 */
async function CreateCommand(Command: DiscordJS.ApplicationCommandData, Name: string)
{
    CommandHandler?.create(Command);
    console.log(chalk.cyan('Command')+": "+ chalk.blue(Name)+chalk.cyan(" Added,"))
    CurrentCommands+= "/"+Name+"\n"
}

var CurrentCommands:string = "";
/**
 * It creates commands with the given name and description, and then adds it to the client.
 */
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

    //#region server leaderboard
    CreateCommand({
        name: 'server-leaderboard',
        description: 'Displays a Leaderboard From The Current Server',
    }, "Server-Leaderboard")
    //#endregion

    //#region global leaderboard
    CreateCommand({
        name: 'global-leaderboard',
        description: 'Displays a Leaderboard From The Current Server',
    }, "Global-Leaderboard")
    //#endregion

    //#region BotInfo
    CreateCommand({
        name: 'botinfo',
        description: 'Displays a Infomation About The Bot',
        options: 
        [
            {
                name: 'info',
                description: "Get Info Of",
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
                required: true,
                choices: 
                [
                    {
                        "name": "Version",
                        "value": "version"
                    },
                    {
                        "name": "Author",
                        "value": "author"
                    },
                    {
                        "name": "Commands",
                        "value": "commands"
                    }
                ]
            }
        ]
    }, "BotInfo")
    //#endregion
}



async function SendCommand(Command: DiscordJS.CommandInteraction) 
{
    const { commandName, options } = Command;
    if (Command.channel!.type == "DM") return;

    if (commandName == "botinfo") {
        
        const option:string = options.getString("info", true);
        if (option == "author")
        {
            
            Command.channel?.sendTyping();
            const author =  MMC.Client.users.cache.find(user => user.id === MMC.Author);
            const _Description: string = "Username: "+ author?.tag +"\n" +
                                         "ID: " + MMC.Author
            setTimeout(() => {
                Command.reply({
                    embeds: [QuickEmbed("Author", _Description, "#30018f", author?.displayAvatarURL())]
                })
            }, 500);
        }
        else if (option == "version")
        {
            
            Command.channel?.sendTyping();
            const author =  MMC.Client.users.cache.find(user => user.id === MMC.Author);
            const _Description: string = "Current Version Of '"+MMC.Client.user?.username+"': "+MMC.Version
            setTimeout(() => {
                Command.reply({
                    embeds: [QuickEmbed("Version", _Description, "#0099ff")]
                })
            }, 500);
        }
        if (option == "commands")
        {
            setTimeout(() => {
                Command.reply({
                    embeds: [QuickEmbed("Author", CurrentCommands, "#0099ff")]
                })
            }, 500);
        }
    }


    if (commandName == "ping") {
        const MessagePing = (Date.now()-Command.createdTimestamp).toString()+"ms";
        const APIPing = MMC.Client.ws.ping.toString()+"ms";
        const _Description: string = "Message Ping: "+MessagePing+"\n"+
                                     "API Ping: " + APIPing;
        Command.channel?.sendTyping();
        setTimeout(() => {
            Command.reply({
                embeds: [QuickEmbed("Ping", _Description)]
            })
        }, 500);
    }

    else if (commandName == "level" && Command.channel!.type == "GUILD_TEXT") 
    {
        var User:DiscordJS.User = options.getUser("user", true);
        if (!User.bot) {

            Command.channel?.sendTyping();
            const Guild:DiscordJS.Guild = Command.guild!;
            const UserDB:any = GetUserDB(Guild, User);
            const NextLevel:number = (UserDB["Level"]*UserDB["Level"]*20);
            const _Description = User?.username+" Is Currently Level: " + UserDB["Level"] + "\n"+
                                "And Only Needs " + (NextLevel-UserDB["XP"]).toString()+" More XP To Level Up To: "+(UserDB["Level"]+1).toString();
        
        setTimeout(() => {
            Command.reply({
                embeds: [QuickEmbed("Level", _Description)]
            })
        }, 500);
        } else {
            Command.reply({
                ephemeral: true,
                content:`That Is A Bot Not A User` 
            })
        }
    }
    else if (commandName == "xp") 
    {

        var User:DiscordJS.User = options.getUser("user", true);
        /* Checking if the user is a bot or not. */
        if (!User.bot) {

            Command.channel?.sendTyping();
            const User:DiscordJS.User = options.getUser('user', true);
            const Guild:DiscordJS.Guild = Command.guild!;
            const UserDB:any = GetUserDB(Guild, User);
            const NextLevel:number = (UserDB["Level"]*UserDB["Level"]*20);
            const _Description = User?.username+" Has: " + UserDB["XP"] + "\n"+
                                "And Only Needs " + (NextLevel-UserDB["XP"]).toString()+" More XP To Level Up To: "+(UserDB["Level"]+1).toString();

        setTimeout(() => {
            Command.reply({
                embeds: [QuickEmbed("XP", _Description)]
            })
        }, 500);
        } else {
            Command.reply({
                ephemeral: true,
                content:`That Is A Bot Not A User` 
            })
        }
    }
    else if (commandName == "global-leaderboard") 
    {

    /* Checking if the user is a bot or not. */

    Command.channel?.sendTyping();
    let Users:string = "";
    let AllUsers:any = 
    {

    }
    for (var serverkey in MMC.Database.Read()) {
        for (var key in (MMC.Database.Read()[serverkey]["Users"])) {
            var name:any = MMC.Database.Read()[serverkey]["Users"][key]["Name"];
            var level:string = MMC.Database.Read()[serverkey]["Users"][key]["Level"];
            AllUsers[key] = {"Level": level, "Name": name};
        }
    }
    var items = Object.keys(AllUsers).map(function(key) {
        return [key, AllUsers[key]];
      });
      
    // Sort the array based on the second element
    items.sort(function(first, second) {
      return second[1] - first[1];
    });
    AllUsers = items.slice(0, 5);
    for ( var key in AllUsers )
    {
        console.log(AllUsers[key]);
        Users += AllUsers[key][1]["Name"]+": "+AllUsers[key][1]["Level"]+"\n";
    }
    setTimeout(() => {
        Command.reply({
            embeds: [QuickEmbed("Global Leaderboard", Users)]
        })
    }, 500);
    }
    else if (commandName == "server-leaderboard") 
    {

        /* Checking if the user is a bot or not. */

        Command.channel?.sendTyping();
        const User:DiscordJS.User = options.getUser('user', true);
        const Guild:DiscordJS.Guild = Command.guild!;
        const UserDB:any = GetUserDB(Guild, User);
        const NextLevel:number = (UserDB["Level"]*UserDB["Level"]*20);
        const _Description = User?.username+" Has: " + UserDB["XP"] + "\n"+
                            "And Only Needs " + (NextLevel-UserDB["XP"]).toString()+" More XP To Level Up To: "+(UserDB["Level"]+1).toString();

        setTimeout(() => {
            Command.reply({
                embeds: [QuickEmbed("XP", _Description)]
            })
        }, 500);
    }
}
function GetUserDB(Guild: DiscordJS.Guild, User: DiscordJS.User):any
{
    if (Guild === undefined || User === undefined) return undefined;

    var DB:any = MMC.Database.Read();
    if (JsonHas(DB, Guild.id)) 
    {
        if (!JsonHas(DB[Guild.id]["Users"], User.id)) 
        {
            // Does Not Have User In Users In ServerID
            DB[Guild.id]["Users"][User.id] = {
                "Name": User.username,
                "Level": 1,
                "XP": 1
            };
            MMC.Database.Write(DB);
            return GetUserDB(Guild, User);
        } else {
            
            return DB[Guild.id]["Users"][User.id];
        }
        
    } 
     else
    {
        // Does not have ServerID
        DB[Guild.id] = {
            "Name": Guild.name,
            "Icon": Guild.iconURL,
            "Users": {}
        }
        MMC.Database.Write(DB);
        return GetUserDB(Guild, User);
    } 
}

async function OnMessage(message: DiscordJS.Message)
{
    
    if (message.channel!.type == "DM") return;
    var Guild:DiscordJS.Guild = message.guild!;
    var User:DiscordJS.User = message.author;
    if (message.author.bot) return "IsBot";
    AddXP(Guild, User, message);
}

function AddXP(Guild:DiscordJS.Guild, User:DiscordJS.User, Message: DiscordJS.Message)
{
    GetUserDB(Guild, User);
    var DB:any = MMC.Database.Read();
    DB[Guild.id]["Users"][User.id]["XP"] += 1;
    if (DB[Guild.id]["Users"][User.id]["Level"]*DB["Level"]*20/Number(process.env.XPMULTIPLIER) <= DB[Guild.id]["Users"][User.id]["XP"])
    {
        DB[Guild.id]["Users"][User.id]["XP"] = 1;
        DB[Guild.id]["Users"][User.id]["Level"] += 1;
        const _Description: string = "<@" + User.id + ">"+" Just Leveled Up To: "+DB[Message.guildId!]["Users"][User.id]["Level"];
        Message.channel.send({ embeds: [QuickEmbed("LevelUp", _Description)] });
    }
    MMC.Database.Write(DB);
}
/*
    ==============================================================================================================================================================
                                                                            StartUp
*/
dotenv.config();
var isReplit: boolean = false;
if (process.env.REPLIT?.toLowerCase() == "yes") isReplit = true;

async function OnClientReady() 
{
    if (MMC.Client.user?.bot) {
        console.clear();
        console.log("Logged In With Bot: '"+chalk.blue(`${MMC.Client.user?.username}`)+"'");
        MMC.Client.user.setStatus("idle");
    } else {
        console.clear();
        console.log(chalk.rgb(255,10,0)("Error User Is Not A Bot"));
        console.log(chalk.rgb(250,70,0)(MMC.Client.user?.username));
    }
    var ClientReady: boolean = true;
    if (isReplit) {
        ClientReady=false;
        const server = express();
        server.all('/', (req:any, res:any) => {
            res.send("{'status': 200}");
        });
        server.listen(Number(process.env.PORT), () => {
            ClientReady = true;
        });
    }
    CommandHandler = MMC.Client.application?.commands;
    function AfterLogin() {
        if(ClientReady === false) {
           setTimeout(AfterLogin, 100);
        } else {
            if (isReplit) console.log("Listening On Port: '"+chalk.blue(process.env.PORT)+"'");
            chalkAnimation.rainbow('---------------------').render();
            console.log("Adding Commands");
            AddCommands();
        }
    }
    AfterLogin();

}


/* The event handler for the discord.js client. */
MMC.Client.on('messageCreate', async (message) => {
    OnMessage(message)
});

MMC.Client.on('ready', async () => {
    OnClientReady()
});

MMC.Client.on('interactionCreate', async (inter) => {
    if(!inter.isCommand())return;
    SendCommand(inter);
})


MMC.Client.login(process.env.TOKEN);