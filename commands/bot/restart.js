const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js')

const OWNER_ID = '1105542823501119539'

module.exports = {
  category: 'Administrator',

  data: new SlashCommandBuilder()
    .setName('restart')
    .setDescription('Restart the bot (owner only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {

    
    if (interaction.user.id !== OWNER_ID) {
      return interaction.reply({
        content: '❌ You are not allowed to restart the bot.',
        flags: MessageFlags.Ephemeral
      })
    }

    const embed = new EmbedBuilder()
      .setColor('#FFA500')
      .setTitle('🔄 Bot Restarting')
      .setDescription(`Bot is restarting as requested by <@${OWNER_ID}>.`)
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })

    
    setTimeout(() => {
      process.exit(0)
    }, 1000)

  }
}
