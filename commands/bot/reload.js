const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js')
const fs = require('fs')
const path = require('path')

module.exports = {
  category: 'Bot',

  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reload a command')
    .addStringOption(option =>
      option
        .setName('command')
        .setDescription('Command name')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {

    const name = interaction.options.getString('command')

    const command = interaction.client.commands.get(name)

    if (!command) {
      return interaction.reply({
        content: '❌ Command not found.',
        flags: MessageFlags.Ephemeral
      })
    }

    const commandsPath = path.join(__dirname, '..')
    const folders = fs.readdirSync(commandsPath)

    let filePath = null

    for (const folder of folders) {
      const folderPath = path.join(commandsPath, folder)

      if (!fs.lstatSync(folderPath).isDirectory()) continue

      const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'))

      const file = files.find(f => f.replace('.js', '') === name)

      if (file) {
        filePath = path.join(folderPath, file)
        break
      }
    }

    if (!filePath) {
      return interaction.reply({
        content: '❌ Command file not found.',
        flags: MessageFlags.Ephemeral
      })
    }

    delete require.cache[require.resolve(filePath)]

    try {

      const newCommand = require(filePath)
      interaction.client.commands.set(newCommand.data.name, newCommand)

      await interaction.reply({
        content: `✅ Command **${name}** reloaded.`,
        flags: MessageFlags.Ephemeral
      })

    } catch (err) {

      console.error(err)

      await interaction.reply({
        content: '❌ Error reloading command.',
        flags: MessageFlags.Ephemeral
      })

    }

  }
}
