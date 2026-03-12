const { EmbedBuilder } = require('discord.js')

module.exports = (client) => {

const staffCommands = [
'ban',
'kick',
'timeout',
'clear',
'vmute',
'nuke',
'vunmute'
]

client.on('interactionCreate', async interaction => {

if (!interaction.isChatInputCommand()) return


if (staffCommands.includes(interaction.commandName)) return

const logChannel = interaction.guild?.channels.cache.find(
c => c.name === 'bot-logs'
)

if (!logChannel) return

let args = []

for (const option of interaction.options.data) {

let value = option.value

if (option.user) value = `<@${option.user.id}>`
if (option.member) value = `<@${option.member.id}>`
if (option.role) value = `<@&${option.role.id}>`
if (option.channel) value = `<#${option.channel.id}>`

args.push(`**${option.name}**: ${value}`)

}

const argsText = args.length ? args.join('\n') : "None"

const embed = new EmbedBuilder()
.setColor('Blue')
.setTitle('Command Used')
.addFields(
{ name: 'User', value: `${interaction.user}`, inline: true },
{ name: 'Command', value: `/${interaction.commandName}`, inline: true },
{ name: 'Channel', value: `${interaction.channel}`, inline: true },
{ name: 'Arguments', value: argsText }
)
.setTimestamp()

logChannel.send({ embeds: [embed] })

})

}
