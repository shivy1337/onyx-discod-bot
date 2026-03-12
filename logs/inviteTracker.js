const fs = require("fs")

const invites = new Map()

const INV_DB = "./database/invites.json"
const JOIN_DB = "./database/joined.json"
const STATS_DB = "./database/inviteStats.json"

function load(file) {
    if (!fs.existsSync(file)) fs.writeFileSync(file, "{}")
    return JSON.parse(fs.readFileSync(file))
}

function save(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

module.exports = (client) => {

    client.once("clientReady", async () => {

        for (const guild of client.guilds.cache.values()) {

            const fetched = await guild.invites.fetch().catch(() => null)
            if (!fetched) continue

            invites.set(
                guild.id,
                new Map(fetched.map(i => [i.code, i.uses]))
            )

        }

        console.log("[READY] Invite tracker ready")

    })


    client.on("inviteCreate", invite => {

        const guildInvites = invites.get(invite.guild.id)
        if (!guildInvites) return

        guildInvites.set(invite.code, invite.uses)

    })


    client.on("inviteDelete", invite => {

        const guildInvites = invites.get(invite.guild.id)
        if (!guildInvites) return

        guildInvites.delete(invite.code)

    })


    client.on("guildMemberAdd", async member => {

        const guild = member.guild
        let inviter = null

        try {

            const newInvites = await guild.invites.fetch()
            const oldInvites = invites.get(guild.id)

            if (oldInvites) {

                const usedInvite = newInvites.find(inv => {
                    const oldUses = oldInvites.get(inv.code) || 0
                    return inv.uses > oldUses
                })

                if (usedInvite) inviter = usedInvite.inviter

            }

            invites.set(
                guild.id,
                new Map(newInvites.map(i => [i.code, i.uses]))
            )

        } catch (err) {
            console.log("Invite detection error:", err)
        }

        const inviteData = load(INV_DB)
        const joined = load(JOIN_DB)
        const stats = load(STATS_DB)

        let inviterId = inviter?.id || "unknown"

        joined[member.id] = {
            inviter: inviterId,
            inviterName: inviter?.username || "Unknown",
            time: Date.now()
        }

        if (inviter) {

            if (!stats[inviter.id]) {
                stats[inviter.id] = { joins: 0, leaves: 0, fakes: 0 }
            }

            stats[inviter.id].joins++

            const accountAge = Date.now() - member.user.createdTimestamp
            const isFake = accountAge < 1000 * 60 * 60 * 24 * 7

            if (isFake) {

                stats[inviter.id].fakes++

            } else {

                inviteData[inviter.id] = (inviteData[inviter.id] || 0) + 1

            }

        }

        save(INV_DB, inviteData)
        save(JOIN_DB, joined)
        save(STATS_DB, stats)

        const channel = guild.channels.cache.find(
            c => c.name === "invite-logs" && c.isTextBased()
        )

        if (!channel) return

        if (inviter) {

            channel.send(
                `📥 **${member.user.username}** joined using **${inviter.username}'s** invite — they now have **${inviteData[inviter.id] || 0} invites**.`
            )

        } else {

            channel.send(
                `📥 **${member.user.username}** joined — inviter unknown.`
            )

        }

    })


    client.on("guildMemberRemove", member => {

        const inviteData = load(INV_DB)
        const joined = load(JOIN_DB)
        const stats = load(STATS_DB)

        const joinData = joined[member.id]

        const guild = member.guild

        const channel = guild.channels.cache.find(
            c => c.name === "invite-logs" && c.isTextBased()
        )

        if (!joinData) {

            if (channel) {
                channel.send(`📤 **${member.user.username}** left the server — inviter unknown.`)
            }

            return
        }

        const inviterId = joinData.inviter
        const inviterName = joinData.inviterName || "Unknown"

        if (inviterId !== "unknown") {

            inviteData[inviterId] = Math.max(0, (inviteData[inviterId] || 0) - 1)

            if (!stats[inviterId]) {
                stats[inviterId] = { joins: 0, leaves: 0, fakes: 0 }
            }

            stats[inviterId].leaves++

        }

        delete joined[member.id]

        save(INV_DB, inviteData)
        save(JOIN_DB, joined)
        save(STATS_DB, stats)

        if (channel) {

            channel.send(
                `📤 **${member.user.username}** left — invited by **${inviterName}** — they now have **${inviteData[inviterId] || 0} invites**.`
            )

        }

    })

}
