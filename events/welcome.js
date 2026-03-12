const { EmbedBuilder } = require('discord.js')

module.exports = (client) => {

  const channelId = '1479611001073569822'

  client.on('guildMemberAdd', member => {

    const channel = member.guild.channels.cache.get(channelId)
    if (!channel) return

    const embed = new EmbedBuilder()
      .setColor('#00AEFF')
      .setDescription(
        `👋 Welcome ${member}\n\n` +
        `You are our **${member.guild.memberCount}** member\n\n` +
        `🌐 **Website:** https://onyrex.com\n` +
        `🎮 **Server IP:** zmx.onyrex.com\n\n` +
        `*Enjoy your stay!*`
)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setFooter({
        text: 'Onyrex Network',
        iconURL: member.guild.iconURL()
      })
      .setTimestamp()

    channel.send({ embeds: [embed] })

  })

}
