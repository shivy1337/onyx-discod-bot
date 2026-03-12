const { EmbedBuilder } = require('discord.js')

module.exports = (client) => {
  const channelId = '1479611001073569822'

  client.on('guildMemberRemove', (member) => {
    const channel = member.guild.channels.cache.get(channelId)
    if (!channel) return

    const leftAt = Math.floor(Date.now() / 1000)

    const embed = new EmbedBuilder()
      .setColor('#FF4D4D')
      .setTitle('👋 Member Left')
      .setDescription(
        `**${member.user.tag}** has left the server.\n\n` +
        `👥 **Member Count:** ${member.guild.memberCount}\n` +
        `🕒 **Left at:** <t:${leftAt}:F>`
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setFooter({ text: 'Onyrex Network', iconURL: member.guild.iconURL() })
      .setTimestamp()

    channel.send({ embeds: [embed] })
  })
}
