/* Importing the modules. */
const { exec } = require("child_process");
import DiscordJS, { AnyChannel, Channel, ColorResolvable, User } from 'discord.js'
import dotenv from 'dotenv';
import fs from 'fs';
const express = require('express');
import chalk from 'chalk';
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
 * @returns true if data has that key.
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
    Database: new Database('JSON/Database.json'),
    Version: new Database('JSON/python.json').Read()["Version"],
    Author: "609445260606701593",
    RequiredPerms: [
        "ADMINISTRATOR"
    ]
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
 * Create a Slash command and Add It To Help Command.
 * @param {JSON} Command - Command Data
 * @param {string} Name - The name of the command
 * @param {string} description - The Description of the command
 */
async function CreateCommand(Command: DiscordJS.ApplicationCommandData, Name: string, description: string)
{
    CommandHandler?.create(Command);
    console.log(chalk.cyan('Command') + ": " + chalk.blue(Name)+chalk.cyan(" Added,"))
    CurrentCommands += "**/" + Name + "**: ***" + description + "***,\n"
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
    }, "Ping", 'Gets The Ping Of The Bot')
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
    }, "Level", 'Get The Current Level Of A User')
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
    }, "XP", 'Get The Current XP Of A User')
    //#endregion

    //#region server leaderboard
    CreateCommand({
        name: 'server-leaderboard',
        description: 'Displays a Leaderboard From The Current Server',
    }, "Server-Leaderboard", 'Displays a Leaderboard From The Current Server')
    //#endregion

    //#region global leaderboard
    CreateCommand({
        name: 'global-leaderboard',
        description: 'Displays a Leaderboard From The Current Server',
    }, "Global-Leaderboard", 'Displays a Leaderboard From The Current Server')
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
    }, "BotInfo", 'Displays a Infomation About The Bot')
    //#endregion

    //#region BotInfo
    CreateCommand({
        name: 'invite-programme',
        description: 'Join or Op-out of the Invite-Programme',
        options: 
        [
            {
                name: 'subcommand',
                description: "Join, Op-out, info",
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
                required: false,
                choices: 
                [
                    {
                        "name": "Yes",
                        "value": "yes"
                    },
                    {
                        "name": "No",
                        "value": "no"
                    },
                    {
                        "name": "Information",
                        "value": "info"
                    },
                ]
            }
        ]
    }, "Invite-Programme", 'Join or Op-out of the Invite-Programme')
    //#endregion


    //#region execute
    CreateCommand(
        {
            name: "execute",
            description: "Excutes server side",
            options: [
                {
                    name: "command",
                    description: "execute TypeScript",
                    type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
                    required: true,
                }
            ]
        }
        ,
        "Execute",
        "Executes typescript Server Side, Owner Only"
    )
    //#endregion

    //#region eco
    CreateCommand(
        {
            name: "echo",
            description: "Sends A Chat Message",
            options: [
                {
                    name: "message",
                    description: "string",
                    type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
                    required: true,
                }
            ]
        }
        ,
        "echo",
        "Sends A Chat Message"
    )

}



async function SendCommand(Command: DiscordJS.CommandInteraction) 
{
    const { commandName, options} = Command;
    if (Command.channel!.type == "DM") return;

    if (commandName == "execute")
    {
        let Channel:any = Command.channel!;
        let Author:User = Command.user;
        if (Author.id == MMC.Author) {
            let message:any = "sent";
            try {
            eval(options.getString("command", true));
            } catch(e) {message=e}
            Command.reply(
            {
                embeds: [
                    QuickEmbed("Execute", message.toString())
                ],
                ephemeral: true
            });
        }
         else
        {
            Command.reply(
            {
                embeds: [
                    QuickEmbed("Execute", "L: This Command Only Works For Bot Owner")
                ],
                ephemeral: true
            });
        }
    }
    else if (commandName == "echo")
    {
        let message:string = "sent";
        try {
        Command.channel?.send(options.getString("message", true));
        } catch(e:any) {message=e.toString()}
        Command.reply(
        {
            embeds: [
                QuickEmbed("Echo", message)
            ],
            ephemeral: true
        });
    }

    else if (commandName == "botinfo") {
        
        const option:string = options.getString("info", true);
        if (option == "author")
        {
            
            Command.channel?.sendTyping();
            const author =  MMC.Client.users.cache.find(user => user.id === MMC.Author);
            const _Description: string = "Username: "+ author?.tag +"\n" +
                                         "ID: " + MMC.Author
            setTimeout(() => {
                Command.reply({
                    embeds: [QuickEmbed("Author", _Description, "#310093", author?.displayAvatarURL())]
                })
            }, 500);
        }
        else if (option == "version")
        {
            
            Command.channel?.sendTyping();
            const author =  MMC.Client.users.cache.find(user => user.id === MMC.Author);
            const _Description: string = "Current Version Of SimplXP: "+MMC.Version
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
                    embeds: [QuickEmbed("Commands", CurrentCommands, "#0099ff")]
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
            const NextLevel:number = (UserDB["Level"]*UserDB["Level"]*Number(process.env.XPMULTIPLIER));
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
            const NextLevel:number = (UserDB["Level"]*UserDB["Level"]*Number(process.env.XPMULTIPLIER));
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
    /* Getting the top 5 users from the database and displaying them in a embed. */
    else if (commandName == "global-leaderboard") 
    {
        Command.channel?.sendTyping();

        let Users:string = "";
        let Servers:any = {}
        const DB:any = MMC.Database.Read();
        let ServerUsers:any = {}

        for (var ServerDB in DB) 
        {
            ServerUsers[ServerDB] = {};
            for (var UserID in DB[ServerDB]["Users"]) 
            {
                let name:string = DB[ServerDB]["Users"][UserID]["Name"];
                let level:number = DB[ServerDB]["Users"][UserID]["Level"];
                
                ServerUsers[ServerDB][UserID] = {"Level": level, "Name": name, "ServerName": DB[ServerDB]["Name"]};
            }
            ServerUsers[ServerDB]["Points"] = 0
            for (let ServerUser in ServerUsers[ServerDB]) 
            {
                if (ServerUser != "Points") {
                ServerUsers[ServerDB]["Points"] +=  ServerUsers[ServerDB][ServerUser]["Level"] * ServerUsers[ServerDB][ServerUser]["Level"];
                ServerUsers[ServerDB]["Name"] =  ServerUsers[ServerDB][ServerUser]["ServerName"];
                }
            } 
        }
        ServerUsers = Object.keys(ServerUsers).map(function(i) { return [i, ServerUsers[i]["Points"]]; }).sort(function(first, second) {return second[1] - first[1]; }).slice(0, 5);
        for ( var ServerID in ServerUsers )
        {
            Users += "**Name**: `"+DB[ServerUsers[ServerID][0]]["Name"]+"`, **Points**: `" + ServerUsers[ServerID][1] + "`\n";
            //Points += localServer[UserDB][1]["Level"] * Number(localServer[UserDB][1]["Level"] * localServer[UserDB][1]["Level"]);

        }
        setTimeout(() => {
            Command.reply({
                embeds: [QuickEmbed("Global Leaderboard", Users)]
            })
        }, 500);
    }
    else if (commandName == "server-leaderboard") 
    {
        Command.channel?.sendTyping();

        var Users:string = "";
        var localServer:any = {}
        const localServerDB:any = MMC.Database.Read()[Command.guild!.id]["Users"];

        for (var UsersDB in localServerDB) 
        {
            var name:any = localServerDB[UsersDB]["Name"];
            let level:string = localServerDB[UsersDB]["Level"];
            localServer[UsersDB] = {"Level": level, "Name": name};
        }

        localServer = Object.keys(localServer).map(function(i) { return [i, localServer[i]]; }).sort(function(first, second) {return second[1] - first[1]; }).slice(0, 10);
        var Points:number = 0;

        for ( var UserDB in localServer )
        {
            Users += "**Name**: `"+localServer[UserDB][1]["Name"]+"`, **Points**: `" + Number(localServer[UserDB][1]["Level"] * localServer[UserDB][1]["Level"]) + "`\n";
            Points += localServer[UserDB][1]["Level"] * Number(localServer[UserDB][1]["Level"] * localServer[UserDB][1]["Level"]);

        }
        setTimeout(() => {
            Command.reply({
                embeds: [QuickEmbed("Server Leaderboard", Users)]
            })
        }, 500);

    } else if (commandName == "invite-programme")
    {
        let db:any = MMC.Database.Read();
        let opt:string|null = options.getString("subcommand");
        if (opt == "no") {
            let _Description:any = "Leaving Invite-Programme";
            if (!db[Command.guild!.id]["InviteProgramme"])
                _Description = "Already Left The Invite-Programme";
            Command.reply({
                embeds: [QuickEmbed("Invite-Programme", _Description)]
            })
            db[Command.guild!.id]["InviteProgramme"] = false
            MMC.Database.Write(db);
        }
         else if (opt == "yes")
        {
            let _Description = "Joining Back In Invite-Programme";
            if (db[Command.guildId!]["InviteProgramme"])
                _Description = "Already In Invite-Programme";
            Command.reply({
                embeds: [QuickEmbed("Invite-Programme", _Description)]
                
            })
            db[Command.guild!.id]["InviteProgramme"] = true
            MMC.Database.Write(db);

        } 
         else if (opt == "info")
        {
            Command.reply({embeds: [QuickEmbed("Welcome To The Invite-Programme", "But Your May Ask What Is A Invite-Programme\nInvite-Programme Allows Small Servers To Get A Chance To Get New People Who Also Decided To Join The Invite-Programme")]})
        } 
         else
        {            
            if (db[Command.guild!.id]["InviteProgramme"])
                Command.reply({embeds: [QuickEmbed("Invite Programme", "Your Server Is In The Invite Programme")]})
            else
                Command.reply({embeds: [QuickEmbed("Invite Programme", "Your Server Is Not Currently In The Invite Programme")]})
        }
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
async function DebugMessage(Prefix:string, Important:any, Sufix:string)
{
    console.log(chalk.blue(Prefix+" \"")+chalk.hex("#f26700")(Important)+chalk.blue("\" "+Sufix))
}
async function OnMessage(message: DiscordJS.Message)
{
    if (message.channel!.type == "DM") return;
    if (message.author.bot) return "IsBot";
    var Guild:DiscordJS.Guild = message.guild!;
    var User:DiscordJS.User = message.author;
    let db:any = MMC.Database.Read();
    

    if (!JsonHas(db[Guild.id],"Invite")) {
        function getinvite(message: any) {
        return message.channel.createInvite(
            {
                maxAge: 0, // maximum time for the invite, in milliseconds
                maxUses: 0 // maximum times it can be used
            },
        )
        }



        let InviteLink:any = await getinvite(message);
        DebugMessage("New Server Added", Guild.name, "");
        db[Guild.id]["Invite"] = "Unset";
        db[Guild.id]["Invite"] = "https://discord.gg/"+InviteLink["code"];
        db[Guild.id]["Icon"] = Guild.iconURL()
        message.channel.send(
            {
                embeds: [
                    new DiscordJS.MessageEmbed()
                    .setColor("BLUE")
                    .setTitle("SimplXP Setup")
                    .setDescription("Thanks For Adding '"+MMC.Client.user!.username+"',\n Your Server Is Currently \nIn The **`Invite-Programme`**\n\nIf You Would Like To Leave Run \n`/invite-programme`\n\n Find More Commands And Info About The Bot With The Command `/botinfo`")
                    .setThumbnail(MMC.Client.user!.displayAvatarURL())
                ]
            }
        );
        db[Guild.id]["InviteProgramme"] = true;
        MMC.Database.Write(db, 4);
    }
    AddXP(Guild, User, message);
}

function AddXP(Guild:DiscordJS.Guild, User:DiscordJS.User, Message: DiscordJS.Message)
{
    GetUserDB(Guild, User);
    var DB:any = MMC.Database.Read();
    DB[Guild.id]["Users"][User.id]["XP"] += 1;
    if (DB[Guild.id]["Users"][User.id]["Level"]*DB[Guild.id]["Users"][User.id]["Level"]*Number(process.env.XPMULTIPLIER) <= DB[Guild.id]["Users"][User.id]["XP"])
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

async function OnClientStart()
{
    exec("Remove-Item 'package-lock.json'");
    console.log("Logging In...");
}
async function OnClientReady() 
{
    if (MMC.Client.user?.bot) {
        console.clear();
        console.log("Logged In With Bot: '"+chalk.blue(`${MMC.Client.user?.username}`)+"'");
        MMC.Client.user.setPresence({
            status: "online",
            activities: [
                {
                    
                    type: "LISTENING",
                    url: "https://github.com/SMLkaiellis08/SimplXP",
                    name: "/botinfo",
                }
            ]
          });
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


OnClientStart();
MMC.Client.login(process.env.TOKEN);