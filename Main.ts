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
    G_Database: new Database("./.env.json"),
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
        description: 'Gets The Ping Of The Bot',
        options: [
            {
                name: 'type',
                description: "Get Ping Of API, Message",
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING

            }
        ]
    })
    //#endregion

    console.log(colors.data("Command: ping Added,"))
}


async function SendCommand(Command: any) 
{
    const { commandName, options } = Command;

    if (commandName == "ping" && options.getString('type') == "API") 
    {
        Command.reply({
            content: `${Math.round(MMC.Client.ws.ping)}ms`,
        })
    }
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
function GetUser(ServerID: any, UserID: string)
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


MMC.Client.on('message', async (message) => {OnMessage(message)});
MMC.Client.on('interactionCreate', async (inter) => {
    if(!inter.isCommand()){
        return;
    }
    SendCommand(inter);
})



MMC.Client.login(process.env.TOKEN);