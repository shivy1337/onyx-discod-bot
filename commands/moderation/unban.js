const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const fs = require("fs")

const MOD_ROLE = "1479136392775860316"
const STAFF_LOGS = "1479942076396474510"

const HISTORY_DB = "./database/history.json"

function loadHistory() {
  if (!fs.existsSync(HISTORY_DB)) fs.writeFileSync(HISTORY_DB, "{}")
  return JSON.parse(fs.readFileSync(HISTORY_DB))
}

function saveHistory(data) {
  fs.writeFileSync(HISTORY_DB, JSON.stringify(data, null, 2))
}

module.exports = {
  category: 'Moderation',
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user")

    .addStringOption(option =>
      option
        .setName("user")
        .setDescription("User ID or username")
        .setRequired(true)
    )

    .addStringOption(option =>
      option
        .setName("reason")
        .setDescription("Reason")
        .setRequired(true)
    ),

  async execute(interaction) {

    if (!interaction.member.roles.cache.has(MOD_ROLE) &&!interaction.member.permissions.has("BanMembers")) {
    return interaction.reply({
      content: "❌ You don't have permissions"
  })
}
    const input = interaction.options.getString("user")
    const reason = interaction.options.getString("reason")

    const bans = await interaction.guild.bans.fetch()

    const ban = bans.find(
      b => b.user.id === input || b.user.username.toLowerCase() === input.toLowerCase()
    )

    if (!ban) {
      return interaction.reply({
        content: "❌ User not found in bans."
      })
    }

    await interaction.guild.members.unban(ban.user.id)

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("🔓 User Unbanned")
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "User", value: ban.user.tag },
        { name: "Moderator", value: interaction.user.tag },
        { name: "Reason", value: reason }
      )
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })

    const logChannel = interaction.guild.channels.cache.get(STAFF_LOGS)

    if (logChannel) logChannel.send({ embeds: [embed] })

    const history = loadHistory()

    if (!history[ban.user.id]) history[ban.user.id] = []

    history[ban.user.id].push({
      action: "UNBAN",
      reason: reason,
      mod: interaction.user.id,
      time: Date.now()
    })

    saveHistory(history)

  }
}
