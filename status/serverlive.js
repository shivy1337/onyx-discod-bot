const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const Gamedig = require('gamedig')

const CHANNEL_ID = "1479706091817533523" // ID-ul canalului
const IP = "146.19.215.131"
const PORT = 27015

module.exports = (client) => {

  let messageId = null

  async function updateServer() {

    const channel = await client.channels.fetch(CHANNEL_ID)

    try {

      const state = await Gamedig.query({
        type: 'cs16',
        host: IP,
        port: PORT
      })

      const players = state.players

      let scoreboard = "Server empty"

      if (players.length > 0) {

        const numberEmojis = [
          "1️⃣","2️⃣","3️⃣","4️⃣","5️⃣",
          "6️⃣","7️⃣","8️⃣","9️⃣","🔟"
        ]

        const maxPlayersShown = 15

        scoreboard = players
          .slice(0, maxPlayersShown)
          .map((p, i) => {
            const num = numberEmojis[i] || `${i+1}.`
            return `${num} ${p.name || "Unknown"}`
          })
          .join("\n")

        if (players.length > maxPlayersShown) {
          scoreboard += `\n\n➕ ${players.length - maxPlayersShown} more players...`
        }

      }

      const embed = new EmbedBuilder()
        .setColor("#2b8cff")
        .setTitle("🎮 ZMX.ONYREX.COM")
        .addFields(
          { name: "👥 Players", value: `${players.length}/${state.maxplayers}`, inline: true },
          { name: "🗺️ Map", value: state.map || "Unknown", inline: true },
          { name: "⚔️ Online Players", value: scoreboard }
        )
        .setFooter({ text: "Updates every 5 minutes" })
        .setTimestamp()

      const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("🌐 Website")
          .setStyle(ButtonStyle.Link)
          .setURL('https://onyrex.com')
      )

      if (!messageId) {

        const msg = await channel.send({ embeds: [embed], components: [button] })
        messageId = msg.id

      } else {

        const msg = await channel.messages.fetch(messageId)
        await msg.edit({ embeds: [embed], components: [button] })

      }

    } catch {

      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("🔴 ZMX.Onyrex CS 1.6")
        .setDescription("Server is currently OFFLINE")
        .addFields(
          { name: "🌐 IP", value: `${IP}:${PORT}` }
        )
        .setFooter({ text: "Updates every 5 minutes" })
        .setTimestamp()

      if (!messageId) {

        const msg = await channel.send({ embeds: [embed] })
        messageId = msg.id

      } else {

        const msg = await channel.messages.fetch(messageId)
        await msg.edit({ embeds: [embed] })

      }

    }

  }

  updateServer()
  setInterval(updateServer, 300000) 

}
