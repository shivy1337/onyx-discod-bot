const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const path = require('path');

const fontPath = path.join(process.cwd(), 'assets', 'font.ttf');
GlobalFonts.registerFromPath(fontPath, 'RobotoCustom');

module.exports = {
  	category: 'Fun',

  	data: new SlashCommandBuilder()

    .setName("ship")
    .setDescription("Ship two users")
    .addUserOption(o => o.setName("user1").setDescription("User 1").setRequired(true))
    .addUserOption(o => o.setName("user2").setDescription("User 2").setRequired(true)),

  async execute(interaction) {
    const user1 = interaction.options.getUser("user1");
    const user2 = interaction.options.getUser("user2");

    const m1 = await interaction.guild.members.fetch(user1.id);
    const m2 = await interaction.guild.members.fetch(user2.id);

    const nick1 = m1.displayName;
    const nick2 = m2.displayName;

    const percent = (Math.random() * 100).toFixed(1);

    const canvas = createCanvas(900, 400);
    const ctx = canvas.getContext("2d");

    const bg = await loadImage("./assets/bg.png");
    ctx.drawImage(bg, 0, 0, 900, 400);

    const avatar1 = await loadImage(user1.displayAvatarURL({ extension: "png", size: 256 }));
    const avatar2 = await loadImage(user2.displayAvatarURL({ extension: "png", size: 256 }));

    function avatar(img, x, y) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, 190, 190);
      ctx.clip();
      ctx.drawImage(img, x, y, 190, 190);
      ctx.restore();

      ctx.lineWidth = 6;
      ctx.strokeStyle = "#ff9ed6";
      ctx.strokeRect(x, y, 190, 190);
    }

    avatar(avatar1, 100, 110);
    avatar(avatar2, 610, 110);

    ctx.font = "24px RobotoCustom";
    ctx.fillStyle = "#ffc0e6";
    ctx.textAlign = "center";

    ctx.fillText(nick1, 195, 335);

    ctx.fillText(nick2, 705, 95);

    ctx.strokeStyle = "#ff9ed6";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(290, 300);
    ctx.lineTo(290, 350);
    ctx.lineTo(0, 350);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(610, 110);
    ctx.lineTo(610, 90);
    ctx.lineTo(610, 70);
    ctx.lineTo(610, 50);
    ctx.lineTo(900, 50);
    ctx.stroke();

    function heart(x, y, s) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x, y - s / 2, x - s, y - s / 2, x - s, y);
      ctx.bezierCurveTo(x - s, y + s, x, y + s, x, y + s * 1.4);
      ctx.bezierCurveTo(x, y + s, x + s, y + s, x + s, y);
      ctx.bezierCurveTo(x + s, y - s / 2, x, y - s / 2, x, y);
      ctx.closePath();
      ctx.fillStyle = "#ff6bb5";
      ctx.fill();
    }

    heart(450, 160, 45);

    ctx.font = "bold 28px RobotoCustom";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(`${percent}%`, 450, 185);

    const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: "ship.png" });

    interaction.reply({
      content: `💞 **SHIP NAME:** ${nick1.slice(0, 2) + nick2.slice(0, 2)}`,
      files: [attachment]
    });
  }
}
