const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')


const categoryEmojis = {
  Administrator: '🛠️',
  Moderation: '🛡️',
  General: '🧾',
  Fun:'🎉',
  Bot: '⚙️'
}


const categoryOrder = [
  'Administrator',
  'Moderation',
  'General',
  'Fun',
  'Bot'
]

module.exports = {
  category: 'General',

  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows all available commands'),

  async execute(interaction) {

    const commands = interaction.client.commands
    const categories = {}

    
    commands.forEach(cmd => {
      const cat = cmd.category || 'General'
      if (!categories[cat]) categories[cat] = []
      categories[cat].push(`\`/${cmd.data.name}\` - ${cmd.data.description}`)
    })

    
    const embed = new EmbedBuilder()
      .setColor('#5865F2') 
      .setTitle('📖 Onyrex Command Center')
      .setDescription('Browse all available commands easily by category:')
      .setFooter({ text: 'Onyrex Network | Use commands wisely' })
      .setTimestamp()

    let first = true

    for (const cat of categoryOrder) {
      if (!categories[cat]) continue

      const emoji = categoryEmojis[cat] || '📂'

      if (!first) {
        
        embed.addFields({ name: '\u200B', value: '\u200B' })
      }

      embed.addFields({
        name: `${emoji} ${cat}`,
        value: categories[cat].join('\n'),
        inline: false
      })

      first = false
    }

    await interaction.reply({ embeds: [embed] })
  }
}
