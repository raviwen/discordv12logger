const Discord = require('discord.js');
const config = require('./config.json')
const client = new Discord.Client();
require('events').EventEmitter.defaultMaxListeners = Infinity; 


client.on("ready", async () => {
  client.user.setPresence({ activity: { name: config.Settings.Durum }, status: "idle" });
  let botVoiceChannel = client.channels.cache.get(config.Settings.VoiceID);
  if (botVoiceChannel) botVoiceChannel.join().catch(err => console.error("Bot ses kanalına bağlanamadı!"));});


client.login(config.Settings.Token).catch(err => console.log('Tokene bağlanamadım. Lütfen değiştir veya yeni token gir'));
client.once('ready', () => {
  console.log('Bot Başarıyla Aktifleştirildi.')
})
//// Sunucu Güncelleme

client.on("guildUpdate", async (oldGuild, newGuild) => {
    let yetkili = await newGuild.fetchAuditLogs({type: 'GUILD_UPDATE'}).then(audit => audit.entries.first());
    if (!yetkili || !yetkili.executor ) return;


      const sunucuisim = new Discord.MessageEmbed()
      .setTitle('**[Sunucu Güncellendi]**')
      .setDescription(`Sunucuyu Güncelleyen: ${yetkili.executor} \`${yetkili.executor.id}\``)
      .setColor("#00ffdd")
      .setTimestamp()
      .setFooter('Raviwen The LUCIFER')
      let kanal = client.channels.cache.get(config.Channels.sunucugüncelleme);
      kanal.send(sunucuisim).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. raviwen.js / 31. Satır '));
  });

//// Kanal Oluşturma

client.on('channelCreate', (channel) => {
    if(!channel.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;
    if(!channel.guild) return;
    channel.guild.fetchAuditLogs().then(logs => { 
     let userID = logs.entries.first().executor.id;
       let kanaloluşturma = new Discord.MessageEmbed() 
       .setTitle('**[Kanal Oluşturuldu]**')
       .setColor('GREEN')
       .setDescription(`Kanal ID: \`${channel.id}\` \n Kanalı Oluşturan: <@!${userID}> \`${userID}\``)
       .addField("Kanal ismi:", channel.name, true)
       .addField("Kanal Tipi:", `\`${channel.type}\``, false)
       .setTimestamp()
       .setFooter('Raviwen The LUCIFER')
       let kanal = client.channels.cache.get(config.Channels.kanaloluşturma);
       kanal.send(kanaloluşturma).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. raviwen.js / 50. Satır '));
    })
  })
//// Kanal Düzenleme


client.on('channelUpdate', (oldChannel, newChannel) => {
    if(!oldChannel.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;
    oldChannel.guild.fetchAuditLogs().then(logs => { 
        if(oldChannel.name !== newChannel.name) {
     let userID = logs.entries.first().executor.id;
     let kanaldüzenleme = new Discord.MessageEmbed() 
       .setTitle('**[Kanal Güncellendi]**')
       .setColor('RED')
       .setDescription(`Kanal ID: \`${oldChannel.id}\` \n Kanalı Silen: <@!${userID}> \`${userID}\``)
       .addField("Eski Kanal İsmi:", oldChannel.name)
       .addField("Yeni Kanal İsmi:", newChannel.name)
       .setTimestamp()
       .setFooter('Raviwen The LUCIFER')
       let kanal = client.channels.cache.get(config.Channels.kanaldüzenleme);
       kanal.send(kanaldüzenleme).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. raviwen.js / 70. Satır '));
        }
    })
})

//// Kanal Sİlme

client.on('channelDelete', (channel) => {
    if(!channel.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;
    if(!channel.guild) return;
    channel.guild.fetchAuditLogs().then(logs => { 
     let userID = logs.entries.first().executor.id;
     let kanalsilme = new Discord.MessageEmbed() 
       .setTitle('**[Kanal Silindi]**')
       .setColor('RED')
       .setDescription(`Kanal ID: \`${channel.id}\` \n Kanalı Silen: <@!${userID}> \`${userID}\``)
       .addField("Kanal İsmi:", channel.name, true)
       .addField("Kanal Tipi:", channel.type, false)
       .setTimestamp()
       .setFooter('Raviwen The LUCIFER')
       let kanal = client.channels.cache.get(config.Channels.kanalsilme);
       kanal.send(kanalsilme).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. raviwen.js / 91. Satır '));
    })
  })
//// Ban Atma
client.on('guildBanAdd', async (guild, banatılan) => {
    let ban = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first());
    if(!ban || !ban.executor) return;

    const banatma = new Discord.MessageEmbed()
    .setTitle('**[Bir Kullanıcı Banlandı]**')
    .setColor('RED')
    .setDescription(`Banlanan Üye ID: \`${banatılan.id}\` \nÜyeyi Banlayan: ${ban.executor} \`${ban.executor.id}\``)
    .addField(`Banlanan Üye:`, banatılan)
    .setTimestamp()
    .setFooter('Raviwen The LUCIFER')
    let kanal = client.channels.cache.get(config.Channels.banatma);
    kanal.send(banatma).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. raviwen.js / 107. Satır '));
})
//// Ban Kaldırma
client.on('guildBanRemove', async (guild, unbanned) => {
    let bankaldır = await guild.fetchAuditLogs({type: 'MEMBER_BAN_REMOVE'}).then(audit => audit.entries.first());
    if(!bankaldır || !bankaldır.executor) return;

    const bankaldırma = new Discord.MessageEmbed()
    .setTitle('**[Bir Kullanıcını Banı Kaldırıldı]**')
    .setColor('RED')
    .setDescription(`Banı Kaldırılan ID: \`${unbanned.id}\` \nÜyeyinin Banını Kaldıran: ${bankaldır.executor} \`${bankaldır.executor.id}\``)
    .addField(`Banı Kaldırılan Üye:`, unbanned)
    .setTimestamp()
    .setFooter('Raviwen The LUCIFER')
    let kanal = client.channels.cache.get(config.Channels.bankaldırma);
    kanal.send(bankaldırma).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. raviwen.js / 122. Satır '));
})
//// Üye Rolü Güncelleme
client.on('guildMemberUpdate', async (oldMember, newMember) => {
    let Raviwen = await newMember.guild.fetchAuditLogs({type: 'MEMBER_ROLE_UPDATE'}).then(audit => audit.entries.first());
    if (!Raviwen || !Raviwen.executor) return;
    const rolverme = new Discord.MessageEmbed()
    .setTitle('**[Üyenin Rolü Güncellendi]**')
    .setColor('GREEN')
    .setDescription(`Rolü Güncellenen ID: \`${newMember.id}\` \n Rolünü Güncelleyen: ${Raviwen.executor} \`${Raviwen.executor.id}\``)
    .addField(`Rolü Güncellenen Üye:`, newMember)
    .setTimestamp()
    .setFooter('Raviwen The LUCIFER')
    let kanal = client.channels.cache.get(config.Channels.üyerolgüncelleme);
    kanal.send(rolverme).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. raviwen.js / 136. Satır '));
})
//// Bot Ekleme
client.on('guildMemberAdd', async botekleme => {
    let ravi = await botekleme.guild.fetchAuditLogs({type: 'BOT_ADD'}).then(audit => audit.entries.first());
    if (!botekleme.user.bot || !ravi || !ravi.executor) return;

    const eklenenbot = new Discord.MessageEmbed()
    .setTitle('**[Bot Eklendi]**')
    .setColor('GREEN')
    .setDescription(`Eklenen Bot ID: \`${botekleme.id}\` \n Botu Ekleyen: ${ravi.executor} \`${ravi.executor.id}\``)
    .addField('Eklenen Bot:', botekleme )
    .setTimestamp()
    .setFooter('Raviwen The LUCIFER')
    let kanal = client.channels.cache.get(config.Channels.botekleme);
    kanal.send(eklenenbot).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. raviwen.js / 151. Satır '));

})
//// Rol Oluşturma

client.on('roleCreate', (role) => {
    if(!role.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;
     role.guild.fetchAuditLogs().then(logs => { 
     let userID = logs.entries.first().executor.id;
     let rololuşturma = new Discord.MessageEmbed() 
       .setTitle('**[Rol Oluşturuldu]**')
       .setColor('GREEN')
       .addField("Oluşturulan Rol:", role.name, true)
       .setDescription(`Rol ID: \`${role.id}\` \n Rolü Oluşturan: **__<@!${userID}>__**  \`${userID} \``)
       .setTimestamp()
       .setFooter('Raviwen The LUCIFER')
       let kanal = client.channels.cache.get(config.Channels.rololuşturma);
       kanal.send(rololuşturma).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. raviwen.js / 168. Satır '));
    })
  })

//// Rol Güncelleme

client.on('roleUpdate', (oldRole, newRole) => {
    if(!oldRole.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;
    oldRole.guild.fetchAuditLogs().then(logs => { 
     let userID = logs.entries.first().executor.id;
     if(oldRole.name !== newRole.name) {
      let rolgüncelleme = new Discord.MessageEmbed() 
         .setTitle('**[Rol Güncellendi]**')
         .setColor('RED')
         .addField(`Eski İsmi:`, oldRole.name)
         .addField(`Yeni İsmi:`, newRole.name)
         .setDescription(`Rol ID: **${oldRole.id}**\n Rolü Güncelleyen: <@${userID}>  \`${userID}\``)
         .setTimestamp()
         .setFooter('Raviwen The LUCIFER')
         let kanal = client.channels.cache.get(config.Channels.rolgüncelleme);
         kanal.send(rolgüncelleme).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. raviwen.js / 188. Satır '));
      }
    })
   })
//// Rol Silme

client.on('roleDelete', (role) => {
    if(!role.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;
    role.guild.fetchAuditLogs().then(logs => {
     let userID = logs.entries.first().executor.id;
       let rolsilme = new Discord.MessageEmbed() 
       .setTitle('**[Rol Silindi]**')
       .setColor('RED')
       .addField("Silinen Rolün İsmi:", role.name, true)
       .setDescription(`Rol ID: \`${role.id}\` \n Rolü Silen: <@!${userID}> \`${userID}\`  `)
       .setTimestamp()
       .setFooter('Raviwen The LUCIFER')
       let kanal = client.channels.cache.get(config.Channels.rolsilme);
       kanal.send(rolsilme).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. raviwen.js / 206. Satır '));
    })
  })

//// Webhook Oluşturma
client.on('webhookUpdate', async webhook => {
      let webhookoluşturma = await webhook.guild.fetchAuditLogs({type: 'WEBHOOK_CREATE'}).then(audit => audit.entries.first());
      if(!webhookoluşturma || !webhookoluşturma.executor) return;
   const webhookcreate = new Discord.MessageEmbed()
   .setTitle('**[Webhook İşlemi Gerçekleştirildi]**')
   .setColor('GREEN')
   .addField('Webhook İşlemi Gerçekleşen Kanal', webhook)
   .setDescription(`Webhook İşlemi Gerçekleştiren Üye: ${webhookoluşturma.executor} \`${webhookoluşturma.executor.id}\``)
   .setTimestamp()
   .setFooter('Raviwen The LUCIFER')
   let kanal = client.channels.cache.get(config.Channels.webhook);
   kanal.send(webhookcreate).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. raviwen.js / 222. Satır '));
})
//// Emoji Oluşturma
client.on('emojiCreate', async emoji => {
    const raviwen = await emoji.guild.fetchAuditLogs({type: "EMOJI_CREATE"}).then(log => log.entries.first());
    if(!raviwen || !raviwen.executor) return;
    const emojioluşturma = new Discord.MessageEmbed()
    .setTitle('**[Bir Emoji Oluşturuldu]**')
    .setColor('GREEN')
    .setDescription(`Emoji Oluşturan Üye: ${raviwen.executor} \`${raviwen.executor.id}\``)
    .addField(`Oluşturulan Emoji İsmi:`, emoji.name)
    .addField(`Oluşturulan Emoji Görsel:`, emoji)
    .setTimestamp()
    .setFooter('Raviwen The LUCIFER')
    let kanal = client.channels.cache.get(config.Channels.emojioluşturma);
    kanal.send(emojioluşturma).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. raviwen.js / 237. Satır '));
})
//// Emoji Düzenleme
client.on('emojiUpdate', async (oldEmoji, newEmoji) => {
    const raviwen = await oldEmoji.guild.fetchAuditLogs({type: "EMOJI_UPDATE"}).then(log => log.entries.first());
    if(!raviwen || !raviwen.executor) return;
    const emojigüncelleme = new Discord.MessageEmbed()
    .setTitle('**[Bir Emoji Güncellendi]**')
    .setColor('GREEN')
    .setDescription(`Emojiyi Güncelleyen Üye: ${raviwen.executor} \`${raviwen.executor.id}\``)
    .addField(`Eski Emoji İsmi:`, oldEmoji.name )
    .addField(`Yeni Emoji İsmi:`, newEmoji.name)
    .setTimestamp()
    .setFooter('Raviwen The LUCIFER')
    let kanal = client.channels.cache.get(config.Channels.emojigüncelleme);
    kanal.send(emojigüncelleme).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. raviwen.js / 252. Satır '));
})
//// Emoji Silme
client.on('emojiDelete', async emoji => {
    const raviwen = await emoji.guild.fetchAuditLogs({type: "EMOJI_DELETE"}).then(log => log.entries.first());
    if(!raviwen || !raviwen.executor) return;
    
    const emojisilme = new Discord.MessageEmbed()
    .setTitle('**[Bir Emoji Silindi]**')
    .setColor('RED')
    .setDescription(`Emoji Silen Üye: ${raviwen.executor} \`${raviwen.executor.id}\``)
    .addField(`Silinen Emoji İsmi:`, emoji.name)
    .setTimestamp()
    .setFooter('Raviwen The LUCIFER')
    let kanal = client.channels.cache.get(config.Channels.emojisilme);
    kanal.send(emojisilme).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. raviwen.js / 267. Satır '));
})
//// Mesaj Silme Log
client.on('messageDelete', async mesajsilme=> {
  const raviwen = await mesajsilme.guild.fetchAuditLogs({type: "MESSAGE_DELETE"}).then(log => log.entries.first());
  if(!raviwen || !raviwen.executor) return;
  if (mesajsilme.author.bot) return;
  if (!mesajsilme.guild) return;
  const silinenmesaj = new Discord.MessageEmbed()
  .setTitle('**[Bir Mesaj Silindi]**')
  .setColor('RED')
  .setDescription(`Mesaj Silen Üye: ${raviwen.executor} \`${raviwen.executor.id}\``)
  .addField('Mesajı Silinen Üye:', mesajsilme.author)
  .addField(`Silinen Mesaj:`, mesajsilme)
  .setTimestamp()
  .setFooter('Raviwen The LUCIFER')
  let kanal = client.channels.cache.get(config.Channels.mesajsilme);
  kanal.send(silinenmesaj).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. raviwen.js / 282. Satır '));
})

//// Mesaj Düzenleme Log

client.on('messageUpdate', async (oldMessage, newMessage) => {
    const raviwen = await oldMessage.guild.fetchAuditLogs({type: "MESSAGE_UPDATE"}).then(log => log.entries.first());
    if(!raviwen || !raviwen.executor) return;
    if (oldMessage.author.bot) return;
    if (!oldMessage.guild) return;
    if (oldMessage.content == newMessage.content) return;

    const mesajgüncelleme = new Discord.MessageEmbed()
    .setTitle('**[Bir Mesaj Güncellendi]**')
    .setColor('GREEN')
    .setDescription(`Mesajı Güncelleyen Üye: ${raviwen.executor} \`${raviwen.executor.id}\``)
    .addField('Mesajın Önceki Hali:', oldMessage)
    .addField(`Mesajın Şimdiki Hali:`, newMessage)
    .setTimestamp()
    .setFooter('Raviwen The LUCIFER')
    let kanal = client.channels.cache.get(config.Channels.mesajdüzenleme);
    kanal.send(mesajgüncelleme).catch(err => console.log('Mesaj gönderceğim kanalı bulamadım veya Mesaj gönderemedim. raviwen.js / 303. Satır '));

})

