const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')
const fs = require('fs')

const INV_DB = './database/invites.json'
const STATS_DB = './database/inviteStats.json'

function load(file) {
    if (!fs.existsSync(file)) fs.writeFileSync(file, "{}")
    return JSON.parse(fs.readFileSync(file))
}

function save(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

module.exports = {

    category: "General",

    data: new SlashCommandBuilder()
        .setName("invites")
        .setDescription("Invite system")

        .addSubcommand(sub =>
            sub.setName("check")
                .setDescription("Check a user's invites")
                .addUserOption(o =>
                    o.setName("user")
                        .setDescription("User")
                        .setRequired(false)
                )
        )

        .addSubcommand(sub =>
            sub.setName("leaderboard")
                .setDescription("Invite leaderboard")
        )

        .addSubcommand(sub =>
            sub.setName("stats")
                .setDescription("Invite statistics")
                .addUserOption(o =>
                    o.setName("user")
                        .setDescription("User")
                        .setRequired(false)
                )
        )

        .addSubcommand(sub =>
            sub.setName("rank")
                .setDescription("Invite rank")
                .addUserOption(o =>
                    o.setName("user")
                        .setDescription("User")
                        .setRequired(false)
                )
        )

        .addSubcommand(sub =>
            sub.setName("add")
                .setDescription("Add invites (Admin)")
                .addUserOption(o =>
                    o.setName("user")
                        .setDescription("User")
                        .setRequired(true)
                )
                .addIntegerOption(o =>
                    o.setName("amount")
                        .setDescription("Amount")
                        .setRequired(true)
                )
        )

        .addSubcommand(sub =>
            sub.setName("remove")
                .setDescription("Remove invites (Admin)")
                .addUserOption(o =>
                    o.setName("user")
                        .setDescription("User")
                        .setRequired(true)
                )
                .addIntegerOption(o =>
                    o.setName("amount")
                        .setDescription("Amount")
                        .setRequired(true)
                )
        ),

    async execute(interaction) {

        const data = load(INV_DB)
        const stats = load(STATS_DB)
        const sub = interaction.options.getSubcommand()

        
        if (sub === "check") {

            const user = interaction.options.getUser("user") || interaction.user
            const invites = data[user.id] || 0

            return interaction.reply({
                content: `📨 **${user.username}** currently has **${invites} invites**`
            })

        }


        
        if (sub === "leaderboard") {

            const sorted = Object.entries(data)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)

            if (!sorted.length) {
                return interaction.reply({ content: "No invites recorded yet." })
            }

            let board = ""

            sorted.forEach((x, i) => {

                const member = interaction.guild.members.cache.get(x[0])
                if (!member) return

                let medal = `**${i + 1}.**`
                if (i === 0) medal = "🥇"
                if (i === 1) medal = "🥈"
                if (i === 2) medal = "🥉"

                board += `${medal} **${member.user.username}** — ${x[1]} invites\n`

            })

            const embed = new EmbedBuilder()
                .setTitle("🏆 Invite Leaderboard")
                .setDescription(board)
                .setColor("#5865F2")
                .setFooter({ text: `Requested by ${interaction.user.username}` })
                .setTimestamp()

            interaction.reply({ embeds: [embed] })

        }


        
        if (sub === "stats") {

            const user = interaction.options.getUser("user") || interaction.user
            const s = stats[user.id] || { joins: 0, leaves: 0, fakes: 0 }

            const real = s.joins - s.leaves - s.fakes

            const embed = new EmbedBuilder()
                .setTitle("📊 Invite Statistics")
                .setThumbnail(user.displayAvatarURL())
                .setColor("#5865F2")
                .addFields(
                    { name: "✅ Real Invites", value: String(real), inline: true },
                    { name: "📥 Joins", value: String(s.joins), inline: true },
                    { name: "📤 Leaves", value: String(s.leaves), inline: true },
                    { name: "⚠️ Fake Invites", value: String(s.fakes), inline: true }
                )
                .setFooter({ text: user.username })
                .setTimestamp()

            interaction.reply({ embeds: [embed] })

        }


        
        if (sub === "rank") {

            const user = interaction.options.getUser("user") || interaction.user
            const invites = data[user.id] || 0

            const sorted = Object.entries(data).sort((a, b) => b[1] - a[1])
            const rank = sorted.findIndex(x => x[0] === user.id) + 1

            const embed = new EmbedBuilder()
                .setColor("#5865F2")
                .setTitle("🏅 Invite Rank")
                .setThumbnail(user.displayAvatarURL())
                .setDescription(`**User:** ${user.username}\n🏆 **Rank:** #${rank || "Unranked"}\n📨 **Invites:** ${invites}`)
                .setFooter({ text: `Requested by ${interaction.user.username}` })
                .setTimestamp()

            interaction.reply({ embeds: [embed] })

        }


        
        if (sub === "add") {

            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({ content: "❌ Administrator permission required." })
            }

            const user = interaction.options.getUser("user")
            const amount = interaction.options.getInteger("amount")

            data[user.id] = (data[user.id] || 0) + amount
            save(INV_DB, data)

            interaction.reply({
                content: `✅ Added **${amount} invites** to **${user.username}**`
            })

        }


        
        if (sub === "remove") {

            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({ content: "❌ Administrator permission required." })
            }

            const user = interaction.options.getUser("user")
            const amount = interaction.options.getInteger("amount")

            data[user.id] = Math.max(0, (data[user.id] || 0) - amount)
            save(INV_DB, data)

            interaction.reply({
                content: `✅ Removed **${amount} invites** from **${user.username}**`
            })

        }

    }

}
