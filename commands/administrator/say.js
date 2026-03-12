const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js')

module.exports = {
  category: 'Administrator',

  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make the bot send a message')
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('Announcement message')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {

    let message = interaction.options.getString('message')

    let ping = null

    if (message.includes('@everyone')) {
      ping = '@everyone'
      message = message.replace('@everyone', '').trim()
    }

    if (message.includes('@here')) {
      ping = '@here'
      message = message.replace('@here', '').trim()
    }

    const embed = new EmbedBuilder()
      .setColor('#00AEFF')
      .setTitle('📢 Server Announcement')
      .setDescription(message)
      .setFooter({ text: 'Onyrex Network' })
      .setTimestamp()

    await interaction.reply({
      content: '✅ Sent.',
      flags: MessageFlags.Ephemeral
    })

    setTimeout(() => {
      interaction.deleteReply().catch(() => {})
    }, 2000)

    await interaction.channel.send({
      content: ping ?? undefined,
      embeds: [embed],
      allowedMentions: { parse: ['everyone'] }
    })

  }
}
