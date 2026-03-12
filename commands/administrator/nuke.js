const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')

module.exports = {
  category: 'Moderation',

  data: new SlashCommandBuilder()
    .setName('nuke')
    .setDescription('Nuke the current channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {

    const channel = interaction.channel

    const newChannel = await channel.clone()

    await newChannel.setPosition(channel.position)

    await interaction.reply({ content: '💥 Nuking channel...' })

    await channel.delete()

    await newChannel.send({
      content: `💥 **Channel nuked by <@${interaction.user.id}>**`,
    })

    await newChannel.send('https://media.giphy.com/media/oe33xf3B50fsc/giphy.gif')


    
    const logChannel = interaction.guild.channels.cache.find(
      c => c.name === "staff-logs"
    )

    if (logChannel) {

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("💥 Channel Nuked")
        .addFields(
          { name: "Moderator", value: `<@${interaction.user.id}>`, inline: true },
          { name: "Channel", value: `${newChannel}`, inline: true },
          { name: "Old Channel ID", value: `${channel.id}`, inline: false },
          { name: "New Channel ID", value: `${newChannel.id}`, inline: false }
        )
        .setTimestamp()

      logChannel.send({ embeds: [embed] })

    }

  }
}
