const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  category: 'Fun',

  
  data: new SlashCommandBuilder()
    .setName("tiktok")
    .setDescription("Download a TikTok video")
    .addStringOption(option =>
      option
        .setName("url")
        .setDescription("TikTok link")
        .setRequired(true)
    ),

  async execute(interaction) {

    const url = interaction.options.getString("url");
    const encoded = encodeURIComponent(url);

    await interaction.deferReply();

    try {

      const res = await axios.get(
        `https://api.tiklydown.eu.org/api/download?url=${encoded}`
      );

      const video = res.data.video.noWatermark;

      await interaction.editReply({
        files: [video]
      });

    } catch (err) {

      console.log("TikTok error:", err.response?.status);

      await interaction.editReply({
        content: "❌ Couldn't download that TikTok."
      });

    }

  }
};
