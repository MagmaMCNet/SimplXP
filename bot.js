
                let Discord;
                let Database;
                if(typeof window !== "undefined"){
                    Discord = DiscordJS;
                    Database = EasyDatabase;
                } else {
                    Discord = require("discord.js");
                    Database = require("easy-json-database");
                }
                const delay = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));
                const s4d = {
                    Discord,
                    client: null,
                    tokenInvalid: false,
                    reply: null,
                    joiningMember: null,
                    database: new Database("./db.json"),
                    checkMessageExists() {
                        if (!s4d.client) throw new Error('You cannot perform message operations without a Discord.js client')
                        if (!s4d.client.readyTimestamp) throw new Error('You cannot perform message operations while the bot is not connected to the Discord API')
                    }
                };
                s4d.client = new s4d.Discord.Client({
                    fetchAllMembers: true
                });
                s4d.client.on('raw', async (packet) => {
                    if(['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)){
                        const guild = s4d.client.guilds.cache.get(packet.d.guild_id);
                        if(!guild) return;
                        const member = guild.members.cache.get(packet.d.user_id) || guild.members.fetch(d.user_id).catch(() => {});
                        if(!member) return;
                        const channel = s4d.client.channels.cache.get(packet.d.channel_id);
                        if(!channel) return;
                        const message = channel.messages.cache.get(packet.d.message_id) || await channel.messages.fetch(packet.d.message_id).catch(() => {});
                        if(!message) return;
                        s4d.client.emit(packet.t, guild, channel, message, member, packet.d.emoji.name);
                    }
                });
                var member_xp, member_level;

function colourRandom() {
  var num = Math.floor(Math.random() * Math.pow(2, 24));
  return '#' + ('00000' + num.toString(16)).substr(-6);
}


s4d.client.on('message', async (s4dmessage) => {
  if (!((s4dmessage.member).user.bot)) {
    member_xp = s4d.database.get(String(('xp-' + String(s4dmessage.author.id))));
    member_level = s4d.database.get(String(('level-' + String(s4dmessage.author.id))));
    if (!member_xp) {
      member_xp = 0;
    } else if (!member_level) {
      member_level = 0;
    }
    s4d.database.set(String(('xp-' + String(s4dmessage.author.id))), (member_xp + 1));
    member_xp = member_xp + 1;
    if (s4d.database.get(String(('level-' + String(s4dmessage.author.id)))) <= 1) {
      if (member_xp > 50) {
        if (member_xp < 52) {
          s4d.database.set(String(('level-' + String(s4dmessage.author.id))), (member_level + 1));
          member_level = member_level + 1;
          s4dmessage.channel.send(
                  {
                      embed: {
                          title: (String(s4dmessage.member)),
                          color: (colourRandom()),
                          image: { url: null },
                          description: (['Congratulations, ','','You Have Leveld Up to level ',member_level,'!!'].join(''))
                      }
                  }
              );
        }
      }
    } else if (s4d.database.get(String(('level-' + String(s4dmessage.author.id)))) >= 2) {
      if (member_xp > 200) {
        if (member_xp < 202) {
          s4d.database.set(String(('level-' + String(s4dmessage.author.id))), (member_level + 1));
          member_level = member_level + 1;
          s4dmessage.channel.send(
                  {
                      embed: {
                          title: (String(s4dmessage.member)),
                          color: (colourRandom()),
                          image: { url: null },
                          description: (['Congratulations, ','','You Have Leveld Up to level ',member_level,'!!'].join(''))
                      }
                  }
              );
        }
      }
    }
    if ((s4dmessage.content) == '!!level') {
      s4dmessage.channel.send(String(([s4dmessage.member,', you are currently level: ',member_level].join(''))));
    } else if ((s4dmessage.content) == '!!xp') {
      if (member_level == 1) {
        s4dmessage.channel.send(String(([s4dmessage.member,', You Need ',50 - member_xp,' More XP To Level Up To ',member_level + 1].join(''))));
      } else if (member_level >= 2) {
        s4dmessage.channel.send(String(([s4dmessage.member,', You Need ',200 - member_xp,' More XP To Level Up To ',member_level + 1].join(''))));
      }
    }
  }

});

s4d.client.login(s4d.database.get(String('Token'))).catch((e) => { s4d.tokenInvalid = true; s4d.tokenError = e; });

s4d.client.on('message', async (s4dmessage) => {
  if ((s4dmessage.content) == '!!ownerID') {
    s4dmessage.channel.send(
            {
                embed: {
                    title: 'Owner ID',
                    color: null,
                    image: { url: null },
                    description: s4d.database.get(String('OwnerID'))
                }
            }
        );
  }

});

s4d.client.on('message', async (s4dmessage) => {
  if ((s4dmessage.content) == '!!version') {
    s4dmessage.channel.send(
            {
                embed: {
                    title: 'Bot Version',
                    color: null,
                    image: { url: null },
                    description: ('Bot Version - ' + String(s4d.database.get(String('Version'))))
                }
            }
        );
  }

});

s4d.client.on('ready', async () => {
  s4d.client.user.setActivity(String('With Magma Block\'s'));

});

s4d.client.on('message', async (s4dmessage) => {
  if (member_level == 1) {
    if (member_xp > 50) {
      if (member_xp < 52) {
        s4d.database.set(String(('xp-' + String(s4dmessage.author.id))), 2);
        member_level = member_level + 1;
        member_xp = 2;
      }
    }
  } else if (false) {
  }

});

s4d.client.on('message', async (s4dmessage) => {
  if ((s4dmessage.content) == s4d.database.get(String('Help'))) {
    s4dmessage.channel.send(
            {
                embed: {
                    title: 'Commands',
                    color: '#33ffff',
                    image: { url: null },
                    description: (['Help Command - ',s4d.database.get(String('Help')),'\n','XP Command - !!xp','\n','Level Command - !!level','\n',' -----','\n','Bot Info Command - !!info','\n','Bot Version Command - !!version','\n','Bot Owner Command - !!ownerID'].join(''))
                }
            }
        );
  }

});

s4d.client.on('message', async (s4dmessage) => {
  if ((s4dmessage.content) == '!!info') {
    s4dmessage.channel.send(
            {
                embed: {
                    title: 'Bot Info',
                    color: (colourRandom()),
                    image: { url: null },
                    description: (['Bot Version - ',s4d.database.get(String('Version')),'\n','Owner ID - ',s4d.database.get(String('OwnerID'))].join(''))
                }
            }
        );
  }

});

s4d.client.on('message', async (s4dmessage) => {
  if ((s4dmessage.content) == '!!Levelup') {
    if ((s4dmessage.member).hasPermission('ADMINISTRATOR')) {
      s4d.database.set(String(('level-' + String(s4dmessage.author.id))), (member_level + 1));
      s4dmessage.channel.send(
              {
                  embed: {
                      title: (String(s4dmessage.member)),
                      color: (colourRandom()),
                      image: { url: null },
                      description: ('Leveled Up To ' + String(String(member_level + 1)))
                  }
              }
          );
      member_level = member_level + 1;
    } else {
      s4dmessage.channel.send(
              {
                  embed: {
                      title: (String(s4dmessage.member)),
                      color: '#cc0000',
                      image: { url: null },
                      description: ('Sorry You Do Not Have Perms To do That Command' + '')
                  }
              }
          );
    }
  }

});

s4d.client.on('message', async (s4dmessage) => {
  if ((s4dmessage.content) == '!!ping') {
    s4dmessage.channel.send(String(('pong! - ' + String(s4d.client.ws.ping))));
  }

});

s4d.client.on('message', async (s4dmessage) => {
  if ((s4dmessage.content) == '!!kick') {
    (s4dmessage.mentions.members.first()).kick();
  }

});

s4d.client.on('message', async (s4dmessage) => {
  if ((s4dmessage.content) == '!!ban') {
    (s4dmessage.mentions.members.first()).ban();
  }

});

                s4d;
            