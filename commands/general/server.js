const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')
const Gamedig = require('gamedig')

module.exports = {
  category: 'General',

  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Check the live CS 1.6 server status'),

  async execute(interaction) {

    const channelId = '1479706091817533523'

    try {

      const state = await Gamedig.query({
        type: 'cs16',
        host: '188.212.101.10',
        port: 27015
      })

      const embed = new EmbedBuilder()
        .setTitle('🎮 ZMX.Onyrex CS 1.6')
        .setColor('#00AEFF')
        .addFields(
          { name: '🗺 Map', value: state.map, inline: true },
          { name: '👥 Players', value: `${state.players.length}/${state.maxplayers}`, inline: true },
          { name: '🔗 Join', value: 'zmx.onyrex.com' },
          { name: '📡 Live Status', value: `Check full live stats in <#${channelId}>` }
        )
        .setFooter({ text: 'Onyrex Network' })
        .setTimestamp()

      await interaction.reply({
        embeds: [embed],
        flags: 0
      })

    } catch {

      const embed = new EmbedBuilder()
        .setTitle('🔴 Server Offline')
        .setColor('#FF0000')
        .setDescription(`The server is currently offline.\n\nYou can check updates in <#${channelId}>`)
        .setTimestamp()

      await interaction.reply({
        embeds: [embed],
        flags: 0
      })

    }

  }
}
