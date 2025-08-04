const { Client, GatewayIntentBits, Events } = require("discord.js");

const express = require("express");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("보루 Discord Bot is running!");
});

app.listen(PORT, () => {
  console.log(`HTTP 서버가 포트 ${PORT}에서 실행 중입니다.`);
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! ${readyClient.user.tag}에 로그인했습니다.`);
});

client.on(Events.MessageCreate, (message) => {
  if (message.author.bot) return;

  if (message.content === "!안녕") {
    message.reply("안녕하세요! 보루봇입니다 🤖");
  }

  if (message.content === "!명령어") {
    message.reply({
      content:
        "**사용 가능한 명령어:**\n`!안녕` - 인사하기\n`!명령어` - 명령어 목록 보기\n`!핑` - 핑 확인하기",
    });
  }

  if (message.content === "!핑") {
    message.reply(
      `🏓 퐁! 레이턴시: ${Date.now() - message.createdTimestamp}ms`
    );
  }
});

client.on(Events.Error, (error) => {
  console.error("Discord 클라이언트 오류:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("처리되지 않은 Promise 거부:", error);
});

client.login(process.env.DISCORD_TOKEN);
