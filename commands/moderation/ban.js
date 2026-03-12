const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const fs = require("fs")

const MOD_ROLE = "1479136392775860316"
const STAFF_LOGS = "1479942076396474510"

const HISTORY_DB = "./database/history.json"

const cooldown = new Set()

function loadHistory() {
  if (!fs.existsSync(HISTORY_DB)) fs.writeFileSync(HISTORY_DB, "{}")
  return JSON.parse(fs.readFileSync(HISTORY_DB))
}

function saveHistory(data) {
  fs.writeFileSync(HISTORY_DB, JSON.stringify(data, null, 2))
}

function parseTime(time) {
  const match = time.match(/(\d+)([smhd])/)
  if (!match) return null

  const value = parseInt(match[1])
  const unit = match[2]

  if (unit === "s") return value * 1000
  if (unit === "m") return value * 60000
  if (unit === "h") return value * 3600000
  if (unit === "d") return value * 86400000
}

module.exports = {
  category: 'Moderation',

  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user")

    .addUserOption(option =>
      option.setName("user").setDescription("User").setRequired(true)
    )

    .addStringOption(option =>
      option.setName("time").setDescription("1m / 1h / 1d").setRequired(true)
    )

    .addStringOption(option =>
      option.setName("reason").setDescription("Reason").setRequired(true)
    ),

  async execute(interaction) {

  if (!interaction.member.roles.cache.has(MOD_ROLE) &&!interaction.member.permissions.has("BanMembers")) {
  return interaction.reply({
    content: "❌ You don't have permission"
    })
  }

    if (cooldown.has(interaction.user.id)) {
      return interaction.reply({
        content: "⏳ You must wait 1 minute before using this command again."
      })
    }

    cooldown.add(interaction.user.id)
    setTimeout(() => cooldown.delete(interaction.user.id), 60000)

    const user = interaction.options.getUser("user")
    const member = interaction.guild.members.cache.get(user.id)
    const reason = interaction.options.getString("reason")
    const time = interaction.options.getString("time")

    const duration = parseTime(time)

    if (!duration) {
      return interaction.reply({
        content: "❌ Invalid time. Use 1m / 1h / 1d"
      })
    }

    const dmEmbed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("🔨 You were banned")
      .addFields(
        { name: "Server", value: interaction.guild.name },
        { name: "Reason", value: reason },
        { name: "Duration", value: time }
      )
      .setFooter({ text: "Appeal at https://onyrex.com/" })

    try {
      await user.send({ embeds: [dmEmbed] })
    } catch {}

    await member.ban({ reason })

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("🔨 User Banned")
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "User", value: `${user.tag}` },
        { name: "Moderator", value: `${interaction.user.tag}` },
        { name: "Reason", value: reason },
        { name: "Duration", value: time }
      )
      .setTimestamp()

    await interaction.reply({content: `🔨 **${user.tag}** has been banned by **${interaction.user.tag}** | Reason: ${reason} | Duration: ${time}`})

    const logChannel = interaction.guild.channels.cache.get(STAFF_LOGS)

    if (logChannel) logChannel.send({ embeds: [embed] })

    const history = loadHistory()

    if (!history[user.id]) history[user.id] = []

    history[user.id].push({
      action: "BAN",
      reason: reason,
      mod: interaction.user.id,
      time: Date.now()
    })

    saveHistory(history)

    setTimeout(async () => {

    try {

    await interaction.guild.members.unban(user.id)

    const logChannel = interaction.guild.channels.cache.get(STAFF_LOGS)

    const unbanEmbed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("🔓 User Automatically Unbanned")
      .addFields(
        { name: "User", value: user.tag },
        { name: "Reason", value: "Ban expired" }
      )
      .setTimestamp()

    if (logChannel) logChannel.send({ embeds: [unbanEmbed] })

    const history = loadHistory()

    if (!history[user.id]) history[user.id] = []

    history[user.id].push({
      action: "AUTO UNBAN",
      reason: "Ban expired",
      mod: interaction.client.user.id,
      time: Date.now()
    })

    saveHistory(history)

    } catch (err) {
      console.log("Auto unban failed:", err)
    }

  }, duration)

  }
}
