const { PermissionsBitField, EmbedBuilder } = require('discord.js')

module.exports = (client) => {

  console.log('[ANTI-LINK] System loaded')

  client.on('messageCreate', async (message) => {

    if (!message.guild) return
    if (message.author.bot) return


    console.log(`[ANTI-LINK] Message: ${message.content}`)


    
    if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      console.log('[ANTI-LINK] Admin bypass')
      return
    }


    const linkRegex = /(https?:\/\/|discord\.gg|www\.|discord\.com\/invite)/i

    const detected = linkRegex.test(message.content)

    console.log(`[ANTI-LINK] Link detected? ${detected}`)

    if (!detected) return


    console.log('[ANTI-LINK] Punishing user')


    const link = message.content


    
    await message.delete().catch(err => {
      console.log('[ANTI-LINK] Delete failed:', err)
    })


    
    await message.member.timeout(5 * 60 * 1000, 'Sending links').catch(err => {
      console.log('[ANTI-LINK] Timeout failed:', err)
    })


    
    message.channel.send({
      content: `🚫 **${message.author.tag}** tried to send a link and has been **muted for 5 minutes**.`
    })


    
    const logChannel = message.guild.channels.cache.find(
      c => c.name === 'staff-logs'
    )


    if (!logChannel) {

      console.log('[ANTI-LINK] staff-logs channel not found')
      return

    }


    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setAuthor({
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL()
      })
      .setTitle('🚫 Anti-Link Detection')
      .addFields(
        { name: '👤 User', value: `<@${message.author.id}>`, inline: true },
        { name: '📍 Channel', value: `<#${message.channel.id}>`, inline: true },
        { name: '🔗 Link Sent', value: link }
      )
      .setThumbnail(message.author.displayAvatarURL())
      .setFooter({
        text: `User ID: ${message.author.id}`
      })
      .setTimestamp()


    logChannel.send({ embeds: [embed] })


    console.log(`[ANTI-LINK] ${message.author.tag} punished for link`)

  })

}
