const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const fs = require("fs")

const MOD_ROLE = "1479136392775860316"
const DB = "./database/history.json"

function load() {
  if (!fs.existsSync(DB)) fs.writeFileSync(DB, "{}")
  return JSON.parse(fs.readFileSync(DB))
}

module.exports = {

  category: "Moderation",

  data: new SlashCommandBuilder()
    .setName("history")
    .setDescription("View a user's moderation history")

    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("User")
        .setRequired(true)
    ),

  async execute(interaction) {

  if (!interaction.member.roles.cache.has(MOD_ROLE) &&!interaction.member.permissions.has("BanMembers")) {return interaction.reply({content: "❌ You don't have permission"
  })
}

    const user = interaction.options.getUser("user")

    const data = load()
    const history = data[user.id]

    if (!history || history.length === 0) {
      return interaction.reply({
        content: `📜 **${user.username}** has no moderation history.`
      })
    }

    let text = ""

    history.slice(-10).reverse().forEach((entry, i) => {

      text += `**${i + 1}.** ${entry.action} • ${entry.reason} • <@${entry.mod}> • <t:${Math.floor(entry.time / 1000)}:R>\n`

    })

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle(`📜 Moderation History — ${user.tag}`)
      .setDescription(text)
      .setThumbnail(user.displayAvatarURL())
      .setTimestamp()

    interaction.reply({ embeds: [embed] })

  }

}
