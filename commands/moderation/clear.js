const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, EmbedBuilder } = require('discord.js')

module.exports = {
  category: 'Moderation',

  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Delete messages from the channel')
    .addIntegerOption(option =>
      option
        .setName('amount')
        .setDescription('Number of messages to delete (1-100)')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {

    const amount = interaction.options.getInteger('amount')

    if (amount < 1 || amount > 100) {
      return interaction.reply({
        content: '❌ Choose a number between **1 and 100**.',
        flags: MessageFlags.Ephemeral
      })
    }

    try {

      const deleted = await interaction.channel.bulkDelete(amount, true)

      await interaction.reply({
        content: `🧹 Deleted **${deleted.size}** messages.`,
        flags: MessageFlags.Ephemeral
      })

      
      const logChannel = interaction.guild.channels.cache.find(
        c => c.name === "staff-logs"
      )

      if (logChannel) {

        const embed = new EmbedBuilder()
          .setColor("Orange")
          .setTitle("🧹 Messages Cleared")
          .addFields(
            { name: "Moderator", value: `<@${interaction.user.id}>`, inline: true },
            { name: "Channel", value: `${interaction.channel}`, inline: true },
            { name: "Amount Deleted", value: `${deleted.size}`, inline: true }
          )
          .setTimestamp()

        logChannel.send({ embeds: [embed] })

      }

    } catch {

      await interaction.reply({
        content: '❌ Cannot delete messages older than **14 days**.',
        flags: MessageFlags.Ephemeral
      })

    }

  }
}
