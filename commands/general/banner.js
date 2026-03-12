const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')

module.exports = {

  category: 'General',

  data: new SlashCommandBuilder()
    .setName('banner')
    .setDescription('View a user banner')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to view')
        .setRequired(false)
    ),

  async execute(interaction) {

    const user = interaction.options.getUser('user') || interaction.user

    const fetchedUser = await interaction.client.users.fetch(user.id, { force: true })

    if (!fetchedUser.banner) {
      return interaction.reply({
        content: '❌ This user has no banner.',
        flags: MessageFlags.Ephemeral
      })
    }

    const bannerURL = fetchedUser.bannerURL({
      size: 1024,
      dynamic: true
    })

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle(`🖼️ ${user.username}'s Banner`)
      .setImage(bannerURL)
      .setFooter({ text: `Requested by ${interaction.user.username}` })
      .setTimestamp()

    interaction.reply({ embeds: [embed] })

  }

}
