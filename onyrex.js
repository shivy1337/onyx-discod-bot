require('dotenv').config({ quiet: true })

const { Client, GatewayIntentBits, Collection, REST, Routes, MessageFlags } = require('discord.js')
const fs = require('fs')
const path = require('path')
const updateStatus = require('./status/serverStatus')
const serverLive = require('./status/serverlive')

console.log(`
╔══════════════════════╗
       ONYREX BOT
╚══════════════════════╝
`)

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

require('./events/welcome')(client)
require('./events/leave')(client)

require('./events/antilink')(client)

require('./logs/inviteTracker')(client)
require('./logs/onyrexLogs')(client)

console.log('[CORE] Events loaded')

client.commands = new Collection()
let totalCommands = 0

function loadCommands(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {

    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      loadCommands(fullPath)
    }

    else if (entry.isFile() && entry.name.endsWith('.js')) {

      try {

        const command = require(fullPath)

        if ('data' in command && 'execute' in command) {
          client.commands.set(command.data.name, command)
          totalCommands++
        }

      } catch (err) {

        console.error(`[CORE] Failed to load command ${fullPath}:`, err)

      }

    }
  }
}

  loadCommands(path.join(__dirname, 'commands'))
  console.log(`[CORE] ${totalCommands} command(s) loaded`)

  
  client.once('clientReady', async () => {


  console.log(`[DISCORD] Logged in as ${client.user.tag}`)

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)
  const commands = client.commands.map(cmd => cmd.data.toJSON())

  try {

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    )

    console.log('[API] Slash commands registered')

  } catch (err) {

    console.error('[API] Error registering commands:', err)

  }


  updateStatus(client)
  setInterval(() => updateStatus(client), 30000)

  serverLive(client)

  console.log('[SERVER] Status updater started')
  console.log('[READY] Bot online')

  
  const memory = process.memoryUsage().heapUsed / 1024 / 1024
  const ping = client.ws.ping
  const node = process.version

  console.log(`[SYSTEM] Node: ${node}`)
  console.log(`[SYSTEM] Memory: ${memory.toFixed(2)} MB`)
  console.log(`[SYSTEM] Ping: ${ping} ms`)

})



client.on('interactionCreate', async interaction => {

  if (!interaction.isChatInputCommand()) return

  const command = client.commands.get(interaction.commandName)
  if (!command) return

  try {

    await command.execute(interaction)

  } catch (err) {

    console.error('[ERROR]', err)

    if (interaction.replied || interaction.deferred) {

      await interaction.followUp({
        content: 'There was an error executing this command.',
        flags: MessageFlags.Ephemeral
      })

    } else {

      await interaction.reply({
        content: 'There was an error executing this command.',
        flags: MessageFlags.Ephemeral
      })

    }

  }

})

client.login(process.env.TOKEN)