const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {

  category: 'General',

  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('View a user avatar')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to view')
        .setRequired(false)
    ),

  async execute(interaction) {

    const user = interaction.options.getUser('user') || interaction.user

    const avatarURL = user.displayAvatarURL({
      size: 1024,
      dynamic: true
    })

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle(`👤 ${user.username}'s Avatar`)
      .setImage(avatarURL)
      .setFooter({ text: `Requested by ${interaction.user.username}` })
      .setTimestamp()

    interaction.reply({ embeds: [embed] })

  }

}
