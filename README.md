![Onyrex Discord Bot](./onyrex_discord_bot_thumbnail.png)
# Onyrex Discord Bot

A feature-rich Discord bot for the Onyrex Network with moderation tools, fun commands, and utility features.

---

## Requirements

- [Node.js](https://nodejs.org/) v18 or higher
- A Discord bot token ([Discord Developer Portal](https://discord.com/developers/applications))

---

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shivy1337/onyx-discod-bot.git
   cd onyx-discod-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```env
   TOKEN=your_discord_bot_token_here
   CLIENT_ID=your_bot_client_id_here
   ```

4. **Start the bot**
   ```bash
   node onyrex.js
   ```

---

## Commands

### ⚙️ Administrator
| Command | Description |
|---------|-------------|
| `/say` | Make the bot send a message |
| `/restart` | Restart the bot (owner only) |

### 🛡️ Moderation
| Command | Description |
|---------|-------------|
| `/ban` | Ban a user |
| `/unban` | Unban a user |
| `/nuke` | Nuke the current channel |
| `/clear` | Delete messages from the channel |
| `/history` | View a user's moderation history |

### 🗒️ General
| Command | Description |
|---------|-------------|
| `/help` | Shows all available commands |
| `/avatar` | View a user's avatar |
| `/banner` | View a user's banner |
| `/invites` | Invite system |
| `/server` | Check the live CS 1.6 server status |
| `/impersonate` | Send a message as another user |
| `/clearhistory` | Clear moderation history of a user |

### 🎉 Fun
| Command | Description |
|---------|-------------|
| `/ship` | Ship two users |
| `/tiktok` | Download a TikTok video |

### ⚙️ Bot
| Command | Description |
|---------|-------------|
| `/bot` | Shows advanced bot information |
| `/reload` | Reload a command |

---

## Project Structure

```
onyx-discod-bot/
├── commands/       # Slash command handlers
├── database/       # Database logic
├── events/         # Discord event handlers
├── logs/           # Bot logs
├── status/         # Status handling
├── onyrex.js       # Main entry point
└── .env            # Environment variables (not included in repo)
```

---

## Support

- Discord: `0fm`
- Website: [onyrex.com](https://onyrex.com/index.php?/profile/1-shivy/)

---

## License

This project is open-source. Feel free to use and modify it.
