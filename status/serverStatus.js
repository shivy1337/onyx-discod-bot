const Gamedig = require('gamedig')
const { ActivityType } = require('discord.js')

let toggle = false

async function updateStatus(client) {

  try {

    const state = await Gamedig.query({
      type: 'cs16',
      host: '146.19.215.131',
      port: 27015
    })

    const name = !toggle
      ? `👀 ${state.map} • ${state.players.length}/${state.maxplayers}`
      : `🎮 Join: zmx.onyrex.com`

    await client.user.setPresence({
      activities: [{ name, type: ActivityType.Watching }],
      status: 'dnd'
    })

    toggle = !toggle

  } catch {

    await client.user.setPresence({
      activities: [{ name: '🔴 Server Offline', type: ActivityType.Watching }],
      status: 'dnd'
    })

  }

}

module.exports = updateStatus
