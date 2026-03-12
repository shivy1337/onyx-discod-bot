const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")
const fs = require("fs")

const HISTORY_DB = "./database/history.json"
const STAFF_LOGS = "1479942076396474510"

function loadHistory() {
  if (!fs.existsSync(HISTORY_DB)) fs.writeFileSync(HISTORY_DB, "{}")
  return JSON.parse(fs.readFileSync(HISTORY_DB))
}

function saveHistory(data) {
  fs.writeFileSync(HISTORY_DB, JSON.stringify(data, null, 2))
}

module.exports = {

  data: new SlashCommandBuilder()
    .setName("clearhistory")
    .setDescription("Clear moderation history of a user")

    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("User")
        .setRequired(true)
    )

    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {

    const user = interaction.options.getUser("user")

    const history = loadHistory()

    if (!history[user.id]) {
      return interaction.reply({
        content: `❌ ${user.tag} has no history.`,
        ephemeral: true
      })
    }

    delete history[user.id]

    saveHistory(history)

    const embed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle("🧹 History Cleared")
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "User", value: user.tag },
        { name: "Cleared By", value: interaction.user.tag }
      )
      .setTimestamp()

    await interaction.reply({
      content: `🧹 History for **${user.tag}** has been cleared.`
    })

    const logChannel = interaction.guild.channels.cache.get(STAFF_LOGS)

    if (logChannel) {
      logChannel.send({ embeds: [embed] })
    }

  }

}
