
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
                var member_xp, member_level, close2, Counting, member_xp_X, counting_c;

function colourRandom() {
  var num = Math.floor(Math.random() * Math.pow(2, 24));
  return '#' + ('00000' + num.toString(16)).substr(-6);
}


s4d.client.login(s4d.database.get(String('Token'))).catch((e) => { s4d.tokenInvalid = true; s4d.tokenError = e; });

s4d.client.on('message', async (s4dmessage) => {
  if (!((s4dmessage.member).user.bot)) {
    member_xp = s4d.database.get(String((['xp-',s4dmessage.author.id,'-Server-',(s4dmessage.guild || {}).id].join(''))));
    member_level = s4d.database.get(String((['level-',s4dmessage.author.id,'-Server-',(s4dmessage.guild || {}).id].join(''))));
    if (!(s4d.database.get(String((['xp-',s4dmessage.author.id,'-Server-',(s4dmessage.guild || {}).id].join('')))) % 1 == 0)) {
      member_xp = 1;
      s4d.database.set(String((['xp-',s4dmessage.author.id,'-Server-',(s4dmessage.guild || {}).id].join(''))), 1);
    }
    if (!s4d.database.has(String(('Counting-Enabled-' + String((s4dmessage.guild || {}).id))))) {
      s4d.database.set(String(('Counting-Enabled-' + String((s4dmessage.guild || {}).id))), false);
    }
    if (!s4d.database.has(String((['xp-',s4dmessage.author.id,'-Server-',(s4dmessage.guild || {}).id].join(''))))) {
      member_xp = 1;
      s4d.database.set(String((['xp-',s4dmessage.author.id,'-Server-',(s4dmessage.guild || {}).id].join(''))), 1);
    }
    if (!(s4d.database.get(String((['level-',s4dmessage.author.id,'-Server-',(s4dmessage.guild || {}).id].join('')))) % 1 == 0)) {
      member_xp = 1;
      s4d.database.set(String((['xp-',s4dmessage.author.id,'-Server-',(s4dmessage.guild || {}).id].join(''))), 1);
    }
    if (!s4d.database.has(String((['level-',s4dmessage.author.id,'-Server-',(s4dmessage.guild || {}).id].join(''))))) {
      s4d.database.set(String((['level-',s4dmessage.author.id,'-Server-',(s4dmessage.guild || {}).id].join(''))), 0);
    }
    if (!member_xp) {
      member_xp = 0;
    } else if (!member_level) {
      member_level = 0;
    }
    s4d.database.set(String((['xp-',s4dmessage.author.id,'-Server-',(s4dmessage.guild || {}).id].join(''))), (member_xp + s4d.database.get(String(('XP-X-' + String((s4dmessage.guild || {}).id))))));
    if (!s4d.database.has(String(('command-' + String((s4dmessage.guild || {}).id))))) {
      s4dmessage.channel.send(String('automatically set prefix to !!'));
      s4d.database.set(String(('command-' + String((s4dmessage.guild || {}).id))), '!!');
    }
    if (!s4d.database.has(String(('XP-On-' + String((s4dmessage.guild || {}).id))))) {
      s4d.database.set(String(('XP-On-' + String((s4dmessage.guild || {}).id))), true);
    }
    if (!s4d.database.has(String(('XP-X-' + String((s4dmessage.guild || {}).id))))) {
      s4d.database.set(String(('XP-X-' + String((s4dmessage.guild || {}).id))), 1);
    }
    if (s4d.database.get(String((['level-',s4dmessage.author.id,'-Server-',(s4dmessage.guild || {}).id].join('')))) >= 1) {
      if (member_xp > member_level * 25) {
        s4d.database.set(String((['level-',s4dmessage.author.id,'-Server-',(s4dmessage.guild || {}).id].join(''))), (member_level + 1));
        member_level = member_level + 1;
        s4d.database.set(String((['xp-',s4dmessage.author.id,'-Server-',(s4dmessage.guild || {}).id].join(''))), 1);
        member_xp = 1;
        s4dmessage.channel.send(
                {
                    embed: {
                        title: (s4dmessage.author.username),
                        color: (colourRandom()),
                        image: { url: null },

                        description: (['Congratulations, ',s4dmessage.author.username,' You Have Leveled Up to level ',member_level,'!!'].join('')),
                        footer: { text: null },
                        thumbnail: { url: null }

                    }
                }
            );
      }
    } else if (s4d.database.get(String((['level-',s4dmessage.author.id,'-Server-',(s4dmessage.guild || {}).id].join('')))) == 0) {
      if (member_xp > 10) {
        s4d.database.set(String((['level-',s4dmessage.author.id,'-Server-',(s4dmessage.guild || {}).id].join(''))), (member_level + 1));
        member_level = member_level + 1;
        s4d.database.set(String((['xp-',s4dmessage.author.id,'-Server-',(s4dmessage.guild || {}).id].join(''))), 1);
        member_xp = 1;
        s4dmessage.channel.send(
                {
                    embed: {
                        title: (String(s4dmessage.author.username)),
                        color: (colourRandom()),
                        image: { url: null },

                        description: (['Congratulations, ',s4dmessage.author.username,' You Have Leveled Up to level ',member_level,'!!'].join('')),
                        footer: { text: null },
                        thumbnail: { url: null }

                    }
                }
            );
      }
    }
    if ((s4dmessage.content) == String(s4d.database.get(String(('command-' + String((s4dmessage.guild || {}).id))))) + 'level') {
      s4dmessage.channel.send(String(([s4dmessage.member,', you are currently level: ',member_level].join(''))));
    } else if ((s4dmessage.content) == String(s4d.database.get(String(('command-' + String((s4dmessage.guild || {}).id))))) + 'xp') {
      if (member_level == 0) {
        s4dmessage.channel.send(String(([s4dmessage.member,', You Need ',10 - member_xp,' More XP To Level Up To ',member_level + 1].join(''))));
      } else {
        s4dmessage.channel.send(String(([s4dmessage.member,', You Need ',member_level * 25 - member_xp,' More XP To Level Up To ',member_level + 1].join(''))));
      }
    }
  }

});

s4d.client.on('message', async (s4dmessage) => {
  if ((s4dmessage.content) == String(s4d.database.get(String(('command-' + String((s4dmessage.guild || {}).id))))) + 'ownerID') {
    s4dmessage.channel.send(
            {
                embed: {
                    title: 'Owner ID',
                    color: null,
                    image: { url: null },

                    description: s4d.database.get(String('OwnerID')),
                    footer: { text: null },
                    thumbnail: { url: null }

                }
            }
        );
  } else if ((s4dmessage.content) == String(s4d.database.get(String(('command-' + String((s4dmessage.guild || {}).id))))) + 'version') {
    s4dmessage.channel.send(
            {
                embed: {
                    title: 'Bot Version',
                    color: null,
                    image: { url: null },

                    description: ('Bot Version - ' + String(s4d.database.get(String('Version')))),
                    footer: { text: null },
                    thumbnail: { url: null }

                }
            }
        );
  }
  if ((s4dmessage.content) == String(s4d.database.get(String(('command-' + String((s4dmessage.guild || {}).id))))) + 'info') {
    s4dmessage.channel.send(
            {
                embed: {
                    title: 'Bot Info',
                    color: (colourRandom()),
                    image: { url: null },

                    description: (['Bot Version - ',s4d.database.get(String('Version')),'\n','Owner ID - ',s4d.database.get(String('OwnerID')),'\n','','\n','','\n'].join('')),
                    footer: { text: null },
                    thumbnail: { url: null }

                }
            }
        );
  } else if ((s4dmessage.content) == String(s4d.database.get(String(('command-' + String((s4dmessage.guild || {}).id))))) + 'download') {
    s4dmessage.channel.send(
            {
                embed: {
                    title: (s4dmessage.author.username),
                    color: '#33ccff',
                    image: { url: null },

                    description: (' Download Simple Discord Bot - ' + 'https://github.com/SMLkaiellis08/Leveling-XP-discord-bot/releases'),
                    footer: { text: null },
                    thumbnail: { url: null }

                }
            }
        );
  } else if ((s4dmessage.content) == String(s4d.database.get(String(('command-' + String((s4dmessage.guild || {}).id))))) + 'ping') {
    s4dmessage.channel.send(String(('pong! - ' + String(s4d.client.ws.ping))));
  } else if ((s4dmessage.content) == String(s4d.database.get(String(('command-' + String((s4dmessage.guild || {}).id))))) + 'levelup') {
    if ((s4dmessage.member).hasPermission('ADMINISTRATOR')) {
      s4d.database.set(String((['level-',s4dmessage.author.id,'-Server-',(s4dmessage.guild || {}).id].join(''))), (member_level + 1));
      s4dmessage.channel.send(
              {
                  embed: {
                      title: (String(s4dmessage.author.username)),
                      color: (colourRandom()),
                      image: { url: null },

                      description: ('Leveled Up To ' + String(String(member_level + 1))),
                      footer: { text: null },
                      thumbnail: { url: null }

                  }
              }
          );
      member_level = member_level + 1;
    } else {
      s4dmessage.channel.send(
              {
                  embed: {
                      title: (String(s4dmessage.author.username)),
                      color: '#cc0000',
                      image: { url: null },

                      description: ('Sorry You Do Not Have Perms To do That Command' + ''),
                      footer: { text: null },
                      thumbnail: { url: null }

                  }
              }
          );
    }
  } else if ((s4dmessage.content) == String(s4d.database.get(String(('command-' + String((s4dmessage.guild || {}).id))))) + 'gameping') {
    if ((s4dmessage.member).hasPermission('ADMINISTRATOR')) {
      if (s4d.database.get(String('Game Ping')) == 'True') {
        s4d.database.set(String('Game Ping'), 'False');
        s4dmessage.channel.send(String((String(s4dmessage.member) + ', Playing Ping To False')));
      } else if (s4d.database.get(String('Game Ping')) == 'False') {
        s4d.database.set(String('Game Ping'), 'True');
        s4dmessage.channel.send(String((String(s4dmessage.member) + ', Playing Ping To True')));
      }
    } else {
      s4dmessage.channel.send(
              {
                  embed: {
                      title: (String(s4dmessage.author.username) + ''),
                      color: '#ff0000',
                      image: { url: null },

                      description: 'Sorry You Do Not Have Admin Perms',
                      footer: { text: null },
                      thumbnail: { url: null }

                  }
              }
          );
    }
  }
  if ((s4dmessage.content) == String(s4d.database.get(String(('command-' + String((s4dmessage.guild || {}).id))))) + 'help') {
    s4dmessage.channel.send(
            {
                embed: {
                    title: 'Commands',
                    color: '#33ffff',
                    image: { url: null },

                    description: (['Help Command - ',s4d.database.get(String('Help')),'\n','XP Command - !!xp','\n','Level Command - !!level','\n','The Role Of The Member - !!role','\n',' -----','\n','Bot New Update - !!bot info','\n','Bot Info Command - !!info','\n','Bot Version Command - !!version','\n','Bot Owner Command - !!ownerID','\n','-Admin-','\n','Create a text channel - !!create textchannel','\n','Create a Voice channel - !!create voicechannel','\n','Create a category - !!create category','\n','Levelup One Level - !!Levelup','\n','download Simple Bot - !!download','\n','SteveDJ Setup Pannel - !!setup','\n','SteveDJ Setup Verify - !!setup verify','\n','SteveDJ Setup xp - !!setup xp','\n','SteveDJ Setup Counting - !!setup counting','\n','SteveDJ Settings Counting - !!settings counting'].join('')),
                    footer: { text: null },
                    thumbnail: { url: null }

                }
            }
        );
  }

});

s4d.client.on('ready', async () => {
  if (s4d.database.get(String('Game Ping')) == 'True') {
    s4d.client.user.setActivity(String((['Ping - ',s4d.client.ws.ping,'ms'].join(''))));
  } else if (s4d.database.get(String('Game Ping')) == 'False') {
    s4d.client.user.setActivity(String(s4d.database.get(String('Bot Is Playing'))));
  } else {
    s4d.client.user.setActivity(String('DB.json error'));
  }

});

s4d.client.on('message', async (s4dmessage) => {
  if (s4d.database.get(String('Game Ping')) == 'True') {
    s4d.client.user.setActivity(String(('Ping - ' + String(s4d.client.ws.ping))));
  } else if (s4d.database.get(String('Game Ping')) == 'False') {
    s4d.client.user.setActivity(String(s4d.database.get(String('Bot Is Playing'))));
  } else {
    s4d.client.user.setActivity(String('DB.json error'));
  }

});

s4d.client.on('message', async (s4dmessage) => {
  if ((s4dmessage.content) == '!!role') {
    if (((s4dmessage.guild).owner || await (s4dmessage.guild).members.fetch((s4dmessage.guild).ownerID)) == (s4dmessage.member)) {
      s4dmessage.channel.send(String('You Are Owner Of The Server'));
    } else if (s4d.database.get(String('OwnerID')) == (s4dmessage.member)) {
      s4dmessage.channel.send(String('You Are Owner Of The Bot'));
    } else if ((s4dmessage.member).hasPermission('ADMINISTRATOR')) {
      s4dmessage.channel.send(String('You Are Admin Of The Server'));
    } else {
      s4dmessage.channel.send(String('You Are A member Of The Server'));
    }
  }
  if ((s4dmessage.content) == String(s4d.database.get(String(('command-' + String((s4dmessage.guild || {}).id))))) + 'bot info') {
    s4dmessage.channel.send(
            {
                embed: {
                    title: ('Bot Version - ' + String(s4d.database.get(String('Version')))),
                    color: '#3333ff',
                    image: { url: null },

                    description: (['Bug Fixes / Added','\n','\n',s4d.database.get(String('B.F.L1')),'\n',s4d.database.get(String('B.F.L2')),'\n',s4d.database.get(String('B.F.L3')),'\n',s4d.database.get(String('B.F.L4')),'\n',s4d.database.get(String('B.F.L5')),'\n','Bugs','\n',s4d.database.get(String('F.B.L1')),'\n',s4d.database.get(String('F.B.L2')),'\n',s4d.database.get(String('F.B.L3'))].join('')),
                    footer: { text: null },
                    thumbnail: { url: null }

                }
            }
        );
  }
  if ((s4dmessage.content) == String(s4d.database.get(String(('command-' + String((s4dmessage.guild || {}).id))))) + 'setup xp') {
    if ((s4dmessage.member).hasPermission('MANAGE_GUILD')) {
      (s4dmessage.channel).send(
              {
                  embed: {
                      title: 'SteveDJ Setup pannel',
                      color: '#ff6600',
                      image: { url: null },

                      description: (['Xp enabled = ',s4d.database.get(String(('XP-On-' + String((s4dmessage.guild || {}).id)))),'\n','Enable Or Disable Xp'].join('')),
                      footer: { text: null },
                      thumbnail: { url: null }

                  }
              }
          );
      (s4dmessage.channel).awaitMessages((m) => m.author.id === (s4dmessage.member).id, { time: (1*60*1000), max: 1 }).then(async (collected) => { s4d.reply = collected.first().content;
         if ((s4d.reply) == 'false') {
          s4d.database.set(String(('XP-On-' + String((s4dmessage.guild || {}).id))), false);
          s4dmessage.channel.send(String('Xp Has Been Disabled'));
        } else if ((s4d.reply) == 'true') {
          s4d.database.set(String(('XP-On-' + String((s4dmessage.guild || {}).id))), true);
          s4dmessage.channel.send(String('Xp Has Been Enabled'));
        } else {
          s4dmessage.channel.send(String('Error Try true,false'));
        }

       s4d.reply = null; }).catch(async (e) => { console.error(e);  });} else {
      s4dmessage.channel.send(
              {
                  embed: {
                      title: (String(s4dmessage.author.username) + ''),
                      color: '#ff0000',
                      image: { url: null },

                      description: 'Sorry You Do Not Have Admin Perms',
                      footer: { text: null },
                      thumbnail: { url: null }

                  }
              }
          );
    }
  }
  if ((s4dmessage.content) == String(s4d.database.get(String(('command-' + String((s4dmessage.guild || {}).id))))) + 'settings xp') {
    if ((s4dmessage.member).hasPermission('MANAGE_GUILD')) {
      (s4dmessage.channel).send(
              {
                  embed: {
                      title: 'SteveDJ Setup pannel',
                      color: '#ff6600',
                      image: { url: null },

                      description: (['Beta Warning','\n',['Xp Multiplier is ',member_xp_X,' Set New Multiplier To','\n','x2','\n','x4','\n','x6'].join('')].join('')),
                      footer: { text: null },
                      thumbnail: { url: null }

                  }
              }
          );
      (s4dmessage.channel).awaitMessages((m) => m.author.id === (s4dmessage.member).id, { time: (1*60*1000), max: 1 }).then(async (collected) => { s4d.reply = collected.first().content;
         if ((s4d.reply) == 'x2') {
          member_xp_X = 2;
          s4dmessage.channel.send(
                  {
                      embed: {
                          title: 'SteveDJ Setup pannel',
                          color: '#ff6600',
                          image: { url: null },

                          description: ('Xp Multiplier now is ' + String(2)),
                          footer: { text: null },
                          thumbnail: { url: null }

                      }
                  }
              );
          s4d.database.set(String(('XP-X-' + String((s4dmessage.guild || {}).id))), 2);
        } else if ((s4d.reply) == 'x4') {
          member_xp_X = 4;
          s4dmessage.channel.send(
                  {
                      embed: {
                          title: 'SteveDJ Setup pannel',
                          color: '#ff6600',
                          image: { url: null },

                          description: ('Xp Multiplier now is ' + String(4)),
                          footer: { text: null },
                          thumbnail: { url: null }

                      }
                  }
              );
          s4d.database.set(String(('XP-X-' + String((s4dmessage.guild || {}).id))), 4);
        } else if ((s4d.reply) == 'x6') {
          member_xp_X = 6;
          s4dmessage.channel.send(
                  {
                      embed: {
                          title: 'SteveDJ Setup pannel',
                          color: '#ff6600',
                          image: { url: null },

                          description: ('Xp Multiplier now is ' + String(6)),
                          footer: { text: null },
                          thumbnail: { url: null }

                      }
                  }
              );
          s4d.database.set(String(('XP-X-' + String((s4dmessage.guild || {}).id))), 6);
        } else {
          s4dmessage.channel.send(
                  {
                      embed: {
                          title: 'SteveDJ Setup pannel',
                          color: '#ff6600',
                          image: { url: null },

                          description: 'Error Please Pick: x2 x4 or x6',
                          footer: { text: null },
                          thumbnail: { url: null }

                      }
                  }
              );
        }

       s4d.reply = null; }).catch(async (e) => { console.error(e);  });} else {
      s4dmessage.channel.send(
              {
                  embed: {
                      title: (String(s4dmessage.author.username) + ''),
                      color: '#ff0000',
                      image: { url: null },

                      description: 'Sorry You Do Not Have Admin Perms',
                      footer: { text: null },
                      thumbnail: { url: null }

                  }
              }
          );
    }
  }
  if ((s4dmessage.content) == String(s4d.database.get(String(('command-' + String((s4dmessage.guild || {}).id))))) + 'setup') {
    if ((s4dmessage.member).hasPermission('MANAGE_GUILD')) {
      s4dmessage.channel.send(
              {
                  embed: {
                      title: 'SteveDJ Setup pannel',
                      color: '#ff6600',
                      image: { url: null },

                      description: (['Setup verify - !!setup verify','\n','Setup xp - !!setup xp','\n','xp settings - !!settings xp','\n','Prefix settings - !!settings prefix','\n','Counting Setup - !!setup counting','\n',''].join('')),
                      footer: { text: null },
                      thumbnail: { url: null }

                  }
              }
          );
    }
  }
  if ((s4dmessage.content) == String(s4d.database.get(String(('command-' + String((s4dmessage.guild || {}).id))))) + 'settings prefix') {
    if ((s4dmessage.member).hasPermission('MANAGE_GUILD')) {
      (s4dmessage.channel).send(
              {
                  embed: {
                      title: 'SteveDJ Setup pannel',
                      color: '#ff6600',
                      image: { url: null },

                      description: 'Set SteveDJ\'s command Prefix',
                      footer: { text: null },
                      thumbnail: { url: null }

                  }
              }
          );
      (s4dmessage.channel).awaitMessages((m) => m.author.id === (s4dmessage.member).id, { time: (2*60*1000), max: 1 }).then(async (collected) => { s4d.reply = collected.first().content;
         s4d.database.set(String(('command-' + String((s4dmessage.guild || {}).id))), (s4d.reply));
        s4dmessage.channel.send(String(('Set Prefix To ' + String(s4d.reply))));

       s4d.reply = null; }).catch(async (e) => { console.error(e);  });} else {
      s4dmessage.channel.send(
              {
                  embed: {
                      title: (String(s4dmessage.author.username) + ''),
                      color: '#ff0000',
                      image: { url: null },

                      description: 'Sorry You Do Not Have Admin Perms',
                      footer: { text: null },
                      thumbnail: { url: null }

                  }
              }
          );
    }
  }
  if ((s4dmessage.content) == String(s4d.database.get(String(('command-' + String((s4dmessage.guild || {}).id))))) + 'setgame') {
    if (s4d.database.get(String('Game Ping')) == 'True') {
      if ((s4dmessage.member).hasPermission('ADMINISTRATOR')) {
        s4dmessage.channel.send(String((String(s4dmessage.member) + ', Playing Ping Is True Do \'!!gameping\' To Disable')));
      } else {
        s4dmessage.channel.send(
                {
                    embed: {
                        title: (String(s4dmessage.author.username) + ''),
                        color: '#ff0000',
                        image: { url: null },

                        description: 'Sorry You Do Not Have Admin Perms',
                        footer: { text: null },
                        thumbnail: { url: null }

                    }
                }
            );
      }
    } else if (s4d.database.get(String('Game Ping')) == 'False') {
      if ((s4dmessage.member).hasPermission('ADMINISTRATOR')) {
        (s4dmessage.channel).send(String('Please Type What You want the Game To Be'));
        (s4dmessage.channel).awaitMessages((m) => m.author.id === (s4dmessage.member).id, { time: (1*60*1000), max: 1 }).then(async (collected) => { s4d.reply = collected.first().content;
           s4d.database.set(String('Bot Is Playing'), (s4d.reply));
          s4dmessage.channel.send(
                  {
                      embed: {
                          title: (String(s4dmessage.author.username) + ''),
                          color: '#3366ff',
                          image: { url: null },

                          description: ('Game Has Been Set To Playing ' + String(s4d.reply)),
                          footer: { text: null },
                          thumbnail: { url: null }

                      }
                  }
              );
          s4d.client.user.setActivity(String(s4d.database.get(String('Bot Is Playing'))));

         s4d.reply = null; }).catch(async (e) => { console.error(e);   s4dmessage.channel.send(String('No Message Reply'));
         });} else {
        s4dmessage.channel.send(
                {
                    embed: {
                        title: (String(s4dmessage.author.username) + ''),
                        color: '#ff0000',
                        image: { url: null },

                        description: 'Sorry You Do Not Have Admin Perms',
                        footer: { text: null },
                        thumbnail: { url: null }

                    }
                }
            );
      }
    }
  } else if ((s4dmessage.content) == String(s4d.database.get(String(('command-' + String((s4dmessage.guild || {}).id))))) + 'create textchannel') {
    if ((s4dmessage.member).hasPermission('ADMINISTRATOR')) {
      (s4dmessage.channel).send(String('Create A Channel Name:'));
      (s4dmessage.channel).awaitMessages((m) => m.author.id === (s4dmessage.member).id, { time: (1*60*1000), max: 1 }).then(async (collected) => { s4d.reply = collected.first().content;
         s4dmessage.channel.send(
                {
                    embed: {
                        title: (String(s4dmessage.author.username) + ''),
                        color: '#6600cc',
                        image: { url: null },

                        description: ('Created A Channel Called: ' + String(s4d.reply)),
                        footer: { text: null },
                        thumbnail: { url: null }

                    }
                }
            );
        (s4dmessage.guild).channels.create((s4d.reply), {
                type: 'text'
            });

       s4d.reply = null; }).catch(async (e) => { console.error(e);   s4dmessage.channel.send(String('No Message Reply'));
       });} else {
      s4dmessage.channel.send(
              {
                  embed: {
                      title: (String(s4dmessage.author.username) + ''),
                      color: '#ff0000',
                      image: { url: null },

                      description: 'Sorry You Do Not Have Admin Perms',
                      footer: { text: null },
                      thumbnail: { url: null }

                  }
              }
          );
    }
  } else if ((s4dmessage.content) == String(s4d.database.get(String(('command-' + String((s4dmessage.guild || {}).id))))) + 'create category ') {
    if ((s4dmessage.member).hasPermission('ADMINISTRATOR')) {
      (s4dmessage.channel).send(String('Create A Category  Name:'));
      (s4dmessage.channel).awaitMessages((m) => m.author.id === (s4dmessage.member).id, { time: (1*60*1000), max: 1 }).then(async (collected) => { s4d.reply = collected.first().content;
         s4dmessage.channel.send(
                {
                    embed: {
                        title: (String(s4dmessage.author.username) + ''),
                        color: '#3333ff',
                        image: { url: null },

                        description: ('Created A Category Called: ' + String(s4d.reply)),
                        footer: { text: null },
                        thumbnail: { url: null }

                    }
                }
            );
        (s4dmessage.guild).channels.create((s4d.reply), {
                type: 'category'
            });

       s4d.reply = null; }).catch(async (e) => { console.error(e);   s4dmessage.channel.send(String('No Message Reply'));
       });} else {
      s4dmessage.channel.send(
              {
                  embed: {
                      title: (String(s4dmessage.author.username) + ''),
                      color: '#ff0000',
                      image: { url: null },

                      description: 'Sorry You Do Not Have Admin Perms',
                      footer: { text: null },
                      thumbnail: { url: null }

                  }
              }
          );
    }
  } else if ((s4dmessage.content) == String(s4d.database.get(String(('command-' + String((s4dmessage.guild || {}).id))))) + 'create voicechannel') {
    if ((s4dmessage.member).hasPermission('ADMINISTRATOR')) {
      (s4dmessage.channel).send(String('Create A Channel Name:'));
      (s4dmessage.channel).awaitMessages((m) => m.author.id === (s4dmessage.member).id, { time: (1*60*1000), max: 1 }).then(async (collected) => { s4d.reply = collected.first().content;
         s4dmessage.channel.send(
                {
                    embed: {
                        title: (String(s4dmessage.author.username) + ''),
                        color: '#3333ff',
                        image: { url: null },

                        description: ('Created A Channel Called: ' + String(s4d.reply)),
                        footer: { text: null },
                        thumbnail: { url: null }

                    }
                }
            );
        (s4dmessage.guild).channels.create((s4d.reply), {
                type: 'voice'
            });

       s4d.reply = null; }).catch(async (e) => { console.error(e);   s4dmessage.channel.send(String('No Message Reply'));
       });} else {
      s4dmessage.channel.send(
              {
                  embed: {
                      title: (String(s4dmessage.author.username) + ''),
                      color: '#ff0000',
                      image: { url: null },

                      description: 'Sorry You Do Not Have Admin Perms',
                      footer: { text: null },
                      thumbnail: { url: null }

                  }
              }
          );
    }
  } else if ((s4dmessage.content) == '!!ban') {
    if ((s4dmessage.member).hasPermission('ADMINISTRATOR')) {
      if ((s4dmessage.member).hasPermission('ADMINISTRATOR')) {
        s4dmessage.channel.send(String(('Banned ' + String(s4dmessage.mentions.members.first()))));
        (s4dmessage.mentions.members.first()).ban();
      } else {
        s4dmessage.channel.send(
                {
                    embed: {
                        title: (String(s4dmessage.author.username) + ''),
                        color: '#ff0000',
                        image: { url: null },

                        description: 'Sorry You Do Not Have Admin Perms',
                        footer: { text: null },
                        thumbnail: { url: null }

                    }
                }
            );
      }
    } else {
      s4dmessage.channel.send(
              {
                  embed: {
                      title: (String(s4dmessage.author.username) + ''),
                      color: '#ff0000',
                      image: { url: null },

                      description: 'Sorry You Do Not Have Admin Perms',
                      footer: { text: null },
                      thumbnail: { url: null }

                  }
              }
          );
    }
  } else if ((s4dmessage.content) == '!!kick') {
    if (!s4d.database.has(String((['RK-',s4dmessage.guild,'-',s4dmessage.member].join(''))))) {
      s4dmessage.channel.send(String('Do \'!!rk\' to add some one to be kicked'));
    } else {
      if ((s4dmessage.member).hasPermission('ADMINISTRATOR')) {
        s4dmessage.channel.send(String(('kicked ' + String(s4d.database.get(String((['RK-',s4dmessage.guild,'-',s4dmessage.member].join(''))))))));
        s4d.database.get(String((['RK-',s4dmessage.guild,'-',s4dmessage.member].join('')))).kick();
        s4d.database.delete(String(s4d.database.get(String((['RK-',s4dmessage.guild,'-',s4dmessage.member].join(''))))));
      } else {
        s4dmessage.channel.send(
                {
                    embed: {
                        title: (String(s4dmessage.author.username) + ''),
                        color: '#ff0000',
                        image: { url: null },

                        description: 'Sorry You Do Not Have Admin Perms',
                        footer: { text: null },
                        thumbnail: { url: null }

                    }
                }
            );
      }
    }
  } else if ((s4dmessage.content) == '!!rk') {
    if ((s4dmessage.member).hasPermission('ADMINISTRATOR')) {
      (s4dmessage.channel).send(String('Ready Kick:'));
      (s4dmessage.channel).awaitMessages((m) => m.author.id === (s4dmessage.member).id, { time: (1*60*1000), max: 1 }).then(async (collected) => { s4d.reply = collected.first().content;
         s4d.database.set(String((['RK-',s4dmessage.guild,'-',s4dmessage.member].join(''))), (s4d.reply));

       s4d.reply = null; }).catch(async (e) => { console.error(e);   s4dmessage.channel.send(String('No Message Reply'));
       });} else {
      s4dmessage.channel.send(
              {
                  embed: {
                      title: (String(s4dmessage.author.username) + ''),
                      color: '#ff0000',
                      image: { url: null },

                      description: 'Sorry You Do Not Have Admin Perms',
                      footer: { text: null },
                      thumbnail: { url: null }

                  }
              }
          );
    }
  }

});

s4d.client.on('message', async (s4dmessage) => {
  if (!s4d.database.has(String('leaderboard-2-level'))) {
    s4d.database.set(String('leaderboard-2-level'), 0);
  } else if (!s4d.database.has(String(('leaderboard-1-level-' + String((s4dmessage.guild || {}).id))))) {
    s4d.database.set(String(('leaderboard-1-level-' + String((s4dmessage.guild || {}).id))), 0);
  }
  if ((s4dmessage.content) == String(s4d.database.get(String(('command-' + String((s4dmessage.guild || {}).id))))) + 'leaderboard') {
    s4dmessage.channel.send(
            {
                embed: {
                    title: 'Leader-Boards',
                    color: '#ff6600',
                    image: { url: null },

                    description: (['- Public -','\n',s4d.database.get(String('leaderboard-2-user')),' - ',s4d.database.get(String('leaderboard-2-level')),' - ',s4d.database.get(String('leaderboard-2-server')),'\n','\n','- server -','\n',s4d.database.get(String(('leaderboard-1-user-' + String((s4dmessage.guild || {}).id)))),' - ',s4d.database.get(String(('leaderboard-1-level-' + String((s4dmessage.guild || {}).id))))].join('')),
                    footer: { text: null },
                    thumbnail: { url: null }

                }
            }
        );
  }
  if (s4d.database.get(String((['level-',s4dmessage.author.id,'-Server-',(s4dmessage.guild || {}).id].join('')))) > s4d.database.get(String('leaderboard-2-level'))) {
    s4d.database.set(String('leaderboard-2-level'), s4d.database.get(String((['level-',s4dmessage.author.id,'-Server-',(s4dmessage.guild || {}).id].join('')))));
    s4d.database.set(String('leaderboard-2-user'), (s4dmessage.author.username));
    s4d.database.set(String('leaderboard-2-server'), ((s4dmessage.guild || {}).name));
  } else if (s4d.database.get(String((['level-',s4dmessage.author.id,'-Server-',(s4dmessage.guild || {}).id].join('')))) > s4d.database.get(String(('leaderboard-1-level-' + String((s4dmessage.guild || {}).id))))) {
    s4d.database.set(String(('leaderboard-1-level-' + String((s4dmessage.guild || {}).id))), s4d.database.get(String((['level-',s4dmessage.author.id,'-Server-',(s4dmessage.guild || {}).id].join('')))));
    s4d.database.set(String(('leaderboard-1-user-' + String((s4dmessage.guild || {}).id))), (s4dmessage.author.username));
  }

});

s4d.client.on('message', async (s4dmessage) => {
  if ((s4dmessage.content) == String(s4d.database.get(String(('command-' + String((s4dmessage.guild || {}).id))))) + 'setup verify') {
    if ((s4dmessage.member).hasPermission('MANAGE_GUILD')) {
      (s4dmessage.channel).send(
              {
                  embed: {
                      title: 'setup - verify',
                      color: '#ff6600',
                      image: { url: null },

                      description: (['1 - code','\n','2 - reaction'].join('')),
                      footer: { text: null },
                      thumbnail: { url: null }

                  }
              }
          );
      (s4dmessage.channel).awaitMessages((m) => m.author.id === (s4dmessage.member).id, { time: (2*60*1000), max: 1 }).then(async (collected) => { s4d.reply = collected.first().content;
         if ((s4d.reply) == '1') {
          (s4dmessage.channel).send(
                  {
                      embed: {
                          title: 'setup - verify',
                          color: '#ff6600',
                          image: { url: null },

                          description: (['Channel for verifying','\n','ID not name','\n','eg: 848331656740864020'].join('')),
                          footer: { text: null },
                          thumbnail: { url: null }

                      }
                  }
              );
          (s4dmessage.channel).awaitMessages((m) => m.author.id === (s4dmessage.member).id, { time: (2*60*1000), max: 1 }).then(async (collected) => { s4d.reply = collected.first().content;
             s4d.database.set(String(('verify-channel-' + String((s4dmessage.guild || {}).name))), (s4d.reply));
            (s4dmessage.channel).send(
                    {
                        embed: {
                            title: 'setup - verify',
                            color: '#ff6600',
                            image: { url: null },

                            description: (['Role given when verifyed','\n','ID not name','\n','eg: 841632567224696895'].join('')),
                            footer: { text: null },
                            thumbnail: { url: null }

                        }
                    }
                );
            (s4dmessage.channel).awaitMessages((m) => m.author.id === (s4dmessage.member).id, { time: (2*60*1000), max: 1 }).then(async (collected) => { s4d.reply = collected.first().content;
               s4d.database.set(String(('verify-role-' + String((s4dmessage.guild || {}).name))), (s4d.reply));
              (s4dmessage.channel).send(
                      {
                          embed: {
                              title: 'setup - verify',
                              color: '#ff6600',
                              image: { url: null },

                              description: (['Role given when verifyed','\n','ID not name','\n','eg: 841632567224696895'].join('')),
                              footer: { text: null },
                              thumbnail: { url: null }

                          }
                      }
                  );
              (s4dmessage.channel).awaitMessages((m) => m.author.id === (s4dmessage.member).id, { time: (2*60*1000), max: 1 }).then(async (collected) => { s4d.reply = collected.first().content;
                 s4d.database.set(String(('verify-code-' + String((s4dmessage.guild || {}).name))), (s4d.reply));

               s4d.reply = null; }).catch(async (e) => { console.error(e);  });
             s4d.reply = null; }).catch(async (e) => { console.error(e);  });
           s4d.reply = null; }).catch(async (e) => { console.error(e);  });} else if ((s4d.reply) == '2') {
        } else {
          s4dmessage.channel.send(
                  {
                      embed: {
                          title: 'setup - verify',
                          color: '#ff0000',
                          image: { url: null },

                          description: (['"',s4d.reply,'" is not a command try 1,2'].join('')),
                          footer: { text: null },
                          thumbnail: { url: null }

                      }
                  }
              );
        }

       s4d.reply = null; }).catch(async (e) => { console.error(e);  });} else {
      s4dmessage.channel.send(
              {
                  embed: {
                      title: (String(s4dmessage.author.username)),
                      color: '#ff0000',
                      image: { url: null },

                      description: 'Sorry You Do Not Have Admin Perms',
                      footer: { text: null },
                      thumbnail: { url: null }

                  }
              }
          );
    }
  }
  if ((s4dmessage.content) == s4d.database.get(String(('verify-code-' + String((s4dmessage.guild || {}).id))))) {
    if (((s4dmessage.channel || {}).id) == s4d.database.get(String(('verify-channel-' + String((s4dmessage.guild || {}).id))))) {
      if (s4d.database.has(String(('verify-role-' + String((s4dmessage.guild || {}).id))))) {
        s4dmessage.delete();
        (s4dmessage.member).roles.add(s4d.database.get(String(('verify-role-' + String((s4dmessage.guild || {}).id)))));
        s4dmessage.channel.send(String(([s4dmessage.author.username,', Welcome to ',(s4dmessage.guild).name].join(''))));
      }
    }
  }

});

s4d.client.on('message', async (s4dmessage) => {
  if ((s4dmessage.content) == String(s4d.database.get(String(('command-' + String((s4dmessage.guild || {}).id))))) + 'website') {
    s4dmessage.channel.send(String(('Website: ' + String(s4d.database.get(String('website'))))));
  }
  if ((s4dmessage.content) == String(s4d.database.get(String(('command-' + String((s4dmessage.guild || {}).id))))) + 'shutdown --true') {
    if ((s4dmessage.author.id) == s4d.database.get(String('OwnerID'))) {
      s4dmessage.channel.send(String('Shutting down....'));
      s4dmessage.channel.send(close2);
    }
  }
  if ((s4dmessage.content) == String(s4d.database.get(String(('command-' + String((s4dmessage.guild || {}).id))))) + 'bot-test -on') {
    s4d.database.set(String(('Apptest-' + String((s4dmessage.guild || {}).id))), true);
    s4dmessage.channel.send(
            {
                embed: {
                    title: 'SteveDJ App Testing.',
                    color: null,
                    image: { url: null },

                    description: ('SteveDJ App Testing Mode Enabled' + '\n'),
                    footer: { text: null },
                    thumbnail: { url: null }

                }
            }
        );
  } else if ((s4dmessage.content) == String(s4d.database.get(String(('command-' + String((s4dmessage.guild || {}).id))))) + 'bot-test -off') {
    s4d.database.set(String(('Apptest-' + String((s4dmessage.guild || {}).id))), false);
    s4dmessage.channel.send(
            {
                embed: {
                    title: 'SteveDJ App Testing.',
                    color: null,
                    image: { url: null },

                    description: ('SteveDJ App Testing Mode Disabled' + '\n'),
                    footer: { text: null },
                    thumbnail: { url: null }

                }
            }
        );
  }
  if (!((s4dmessage.member).user.bot)) {
    if ((s4dmessage.content) == String(s4d.database.get(String(('command-' + String((s4dmessage.guild || {}).id))))) + 'number') {
      s4dmessage.channel.send(
              {
                  embed: {
                      title: 'Number',
                      color: '#ff6600',
                      image: { url: null },

                      description: counting_c,
                      footer: { text: null },
                      thumbnail: { url: null }

                  }
              }
          );
    }
    if (((s4dmessage.channel || {}).id) == s4d.database.get(String(('Counting-channel-' + String((s4dmessage.guild || {}).id))))) {
      Counting = 0;
      if ((s4dmessage.content) >= Counting) {
        s4d.database.add(String(('Counting-level-' + String((s4dmessage.channel || {}).id))), parseInt(1));
        counting_c = s4d.database.get(String(('Counting-level-' + String((s4dmessage.channel || {}).id))));
        if ((s4dmessage.content) == counting_c) {
          s4dmessage.react('✔');} else if (counting_c == 0) {
          s4dmessage.react('✖');s4d.database.set(String(('Counting-level-' + String((s4dmessage.channel || {}).id))), 0);
        } else {
          s4dmessage.channel.send(
                  {
                      embed: {
                          title: 'Counting',
                          color: '#ff0000',
                          image: { url: null },

                          description: (['NO!! You Ruined It ',s4dmessage.author.username,' At ',counting_c].join('')),
                          footer: { text: null },
                          thumbnail: { url: null }

                      }
                  }
              );
          s4dmessage.react('✖');s4d.database.set(String(('Counting-level-' + String((s4dmessage.channel || {}).id))), 0);
        }
      }
    }
    if ((s4dmessage.content) == String(s4d.database.get(String(('command-' + String((s4dmessage.guild || {}).id))))) + 'setup counting') {
      if ((s4dmessage.member).hasPermission('ADMINISTRATOR')) {
        (s4dmessage.channel).send(
                {
                    embed: {
                        title: 'SteveDJ Setup pannel',
                        color: '#ff6600',
                        image: { url: null },

                        description: (['Setup Counting','\n','Enable/Disable Counting ','\n','Yes or No',''].join('')),
                        footer: { text: null },
                        thumbnail: { url: null }

                    }
                }
            );
        (s4dmessage.channel).awaitMessages((m) => m.author.id === (s4dmessage.member).id, { time: (2*60*1000), max: 1 }).then(async (collected) => { s4d.reply = collected.first().content;
           if ((s4d.reply) == 'yes') {
            s4dmessage.react('✔');s4d.database.set(String(('Counting-Enabled-' + String((s4dmessage.guild || {}).id))), true);
            s4d.database.set(String(('Counting-channel-' + String((s4dmessage.guild || {}).id))), ((s4dmessage.channel || {}).id));
          } else if ((s4d.reply) == 'no') {
            s4d.database.set(String(('Counting-Enabled-' + String((s4dmessage.guild || {}).id))), false);
            s4d.database.set(String(('Counting-channel-' + String((s4dmessage.guild || {}).id))), ((s4dmessage.channel || {}).id));
            s4dmessage.react('✖');} else {
          }

         s4d.reply = null; }).catch(async (e) => { console.error(e);   s4dmessage.react('❌'); });} else {
        s4dmessage.channel.send(
                {
                    embed: {
                        title: (String(s4dmessage.author.username) + ''),
                        color: '#ff0000',
                        image: { url: null },

                        description: 'Sorry You Do Not Have Admin Perms',
                        footer: { text: null },
                        thumbnail: { url: null }

                    }
                }
            );
      }
    }
  }

});

                s4d;
            