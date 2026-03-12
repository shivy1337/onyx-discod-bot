const { SlashCommandBuilder, EmbedBuilder, version: djsVersion } = require('discord.js')
const os = require('os')

module.exports = {
	category: 'Bot',


  data: new SlashCommandBuilder()
    .setName('bot')
    .setDescription('Shows advanced bot information'),

  async execute(interaction) {

    const client = interaction.client

    const ping = client.ws.ping
    const apiLatency = Date.now() - interaction.createdTimestamp

    const usedMemory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
    const totalMemory = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2)

    const uptime = process.uptime()
    const days = Math.floor(uptime / 86400)
    const hours = Math.floor(uptime / 3600) % 24
    const minutes = Math.floor(uptime / 60) % 60
    const seconds = Math.floor(uptime % 60)

    const totalUsers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('🤖 Onyrex Bot')
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription('Advanced statistics and system information.')

      .addFields(
        {
          name: '📊 Statistics',
          value:
          `🏠 **Servers:** ${client.guilds.cache.size}\n` +
          `👥 **Users:** ${totalUsers}\n` +
          `💬 **Channels:** ${client.channels.cache.size}\n` +
          `📦 **Commands:** ${client.commands.size}`,
          inline: false
        },

        {
          name: '\n⚡ Performance',
          value:
          `📡 **Gateway Ping:** ${ping}ms\n` +
          `🛰 **API Latency:** ${apiLatency}ms\n` +
          `💾 **Memory:** ${usedMemory}MB / ${totalMemory}GB`,
          inline: false
        },

        {
          name: '\n🖥 System',
          value:
          `🧠 **CPU:** ${os.cpus()[0].model}\n` +
          `⚙️ **CPU Cores:** ${os.cpus().length}\n` +
          `💻 **Platform:** ${os.platform()}\n` +
          `🖥 **Node.js:** ${process.version}\n` +
          `📚 **discord.js:** v${djsVersion}`,
          inline: false
        },

        {
          name: '\n⏱ Runtime',
          value:
          `⚡ **Uptime:** ${days}d ${hours}h ${minutes}m ${seconds}s`,
          inline: false
        }
      )

      .setFooter({ text: 'Onyrex Network' })
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })

  }
}
