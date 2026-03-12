const { SlashCommandBuilder, MessageFlags } = require('discord.js')

const OWNER_ID = '1105542823501119539'
const cooldowns = new Map()

module.exports = {
  category: 'General',

  data: new SlashCommandBuilder()
    .setName('impersonate')
    .setDescription('Send a message as another user')
    .addUserOption(option =>
      option
        .setName('target')
        .setDescription('User to impersonate')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('Message to send')
        .setRequired(true)),

  async execute(interaction) {
    try {

      const target = interaction.options.getUser('target')
      const message = interaction.options.getString('message')
      const author = interaction.user
      const now = Date.now()
      const cooldownTime = 5 * 60 * 1000

     
      if (target.bot) {
        return interaction.reply({
          content: '❌ You cannot impersonate bots.',
          flags: MessageFlags.Ephemeral
        })
      }

      
      if (target.id === OWNER_ID) {
        return interaction.reply({
          content: '❌ You cannot impersonate the server owner.'
        })
      }

      
      const last = cooldowns.get(target.id) || 0

      if (author.id !== OWNER_ID && now - last < cooldownTime) {

        const remaining = Math.ceil((cooldownTime - (now - last)) / 1000)

        return interaction.reply({
          content: `⏳ You can impersonate this member again in ${remaining}s.`
        })
      }

      cooldowns.set(target.id, now)

      await interaction.reply({
        content: 'Done 😎',
        flags: MessageFlags.Ephemeral
      })

      setTimeout(() => {
        interaction.deleteReply().catch(() => {})
      }, 5000)

      const channel = interaction.channel

      const member = interaction.guild.members.cache.get(target.id)
      const displayName = member?.nickname || member?.displayName || target.username

      const webhook = await channel.createWebhook({
        name: displayName,
        avatar: target.displayAvatarURL(),
        reason: `Impersonate by ${author.tag}`
      })

      await webhook.send({
        content: message
      })

      setTimeout(async () => {
        try {
          await webhook.delete()
        } catch {}
      }, 5000)

    } catch (err) {

      console.error('[ERROR] Impersonate command:', err)

      if (!interaction.replied) {
        await interaction.reply({
          content: '❌ Something went wrong.',
          flags: MessageFlags.Ephemeral
        })
      }

    }
  }
}
