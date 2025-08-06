const { Client, GatewayIntentBits, Events } = require("discord.js");
const express = require("express");
const rateLimit = require("express-rate-limit");
const GoogleSheetsService = require("./googleSheets");

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

const limiter = rateLimit({
  windowMs: 15 * 1000,
  max: 10,
  message: "너무 많은 요청입니다. 잠시 후 다시 시도해주세요.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

const userCooldowns = new Map();

// Google Sheets 서비스 초기화
const sheetsService = new GoogleSheetsService();
let sheetsInitialized = false;

app.get("/", (req, res) => {
  res.send("보루 Discord Bot is running!");
});

app.listen(PORT, () => {
  console.log(`HTTP 서버가 포트 ${PORT}에서 실행 중입니다.`);
});

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Ready! ${readyClient.user.tag}에 로그인했습니다.`);

  // Google Sheets 서비스 초기화
  sheetsInitialized = await sheetsService.initialize();
  if (sheetsInitialized) {
    console.log("Google Sheets 연동이 성공적으로 초기화되었습니다.");
  } else {
    console.log(
      "Google Sheets 연동 초기화에 실패했습니다. 기본값을 사용합니다."
    );
  }
});

// 슬래시 명령어 핸들러
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  try {
    if (commandName === "안녕") {
      await interaction.reply({
        content: "인간 세상의 끝이 도래했다🤖",
        ephemeral: true,
      });
    } else if (commandName === "명령어") {
      await interaction.reply({
        content: `**사용 가능한 슬래시 명령어:**
\`/안녕\` - 인사하기
\`/명령어\` - 명령어 목록 보기  
\`/핑\` - 핑 확인하기
\`/픽토맨서\` - 픽토맨서 정보 보기
\`/암흑기사\` - 암흑기사 7.2 Gearsets 보기
\`/무도가\` - 무도가 7.2 BIS 보기

**텍스트 명령어:**
\`!골라줘 [옵션들]\` - 여러 옵션 중 랜덤 선택`,
        ephemeral: true,
      });
    } else if (commandName === "핑") {
      await interaction.reply({
        content: `🏓 퐁! 레이턴시: ${
          Date.now() - interaction.createdTimestamp
        }ms`,
        ephemeral: true,
      });
    } else if (commandName === "픽토맨서") {
      let content = "## 7.2 BIS\n";

      if (sheetsInitialized) {
        try {
          const jobInfo = await sheetsService.getJobInfo("픽토맨서");
          if (jobInfo) {
            content = sheetsService.formatJobMessage(jobInfo);
          } else {
            // 기본값 사용
            content = `## 7.2 BIS
[최종](https://xivgear.app/?page=sl%7Cc48f85d8-9b93-4f96-bfc4-1e0e30e98a8c)
[PROG](https://xivgear.app/?page=sl%7Cd968ecc8-019a-4ea4-976e-083f0b8b8df3)
[절 에덴](https://xivgear.app/?page=sl%7C6e51083b-3b75-4236-9036-c992ab490368)`;
          }
        } catch (error) {
          console.error("픽토맨서 정보 가져오기 실패:", error);
          content = `## 7.2 BIS
[최종](https://xivgear.app/?page=sl%7Cc48f85d8-9b93-4f96-bfc4-1e0e30e98a8c)
[PROG](https://xivgear.app/?page=sl%7Cd968ecc8-019a-4ea4-976e-083f0b8b8df3)
[절 에덴](https://xivgear.app/?page=sl%7C6e51083b-3b75-4236-9036-c992ab490368)`;
        }
      } else {
        // Google Sheets 초기화 실패 시 기본값
        content = `## 7.2 BIS
[최종](https://xivgear.app/?page=sl%7Cc48f85d8-9b93-4f96-bfc4-1e0e30e98a8c)
[PROG](https://xivgear.app/?page=sl%7Cd968ecc8-019a-4ea4-976e-083f0b8b8df3)
[절 에덴](https://xivgear.app/?page=sl%7C6e51083b-3b75-4236-9036-c992ab490368)`;
      }

      await interaction.reply({
        content: content,
        ephemeral: true,
      });
    } else if (commandName === "암흑기사") {
      let content = "# ⚔️ 암흑기사 7.2 Gearsets\n";

      if (sheetsInitialized) {
        try {
          const jobInfo = await sheetsService.getJobInfo("암흑기사");
          if (jobInfo) {
            content = sheetsService.formatJobMessage(jobInfo);
          } else {
            // 기본값 사용
            content = `# ⚔️ 암흑기사 7.2 Gearsets

## 🎯 BiS Gearsets
**📊 전체 세트:** [All sets in one sheet](https://xivgear.app/?page=bis|drk|current)

**⚡ 스킬 스피드별 세팅:**
- **2.50 GCD:** [BiS 2.50](https://xivgear.app/?page=bis|drk|current&onlySetIndex=0)
- **2.46 GCD:** [BiS 2.46](https://xivgear.app/?page=bis|drk|current&onlySetIndex=1)`;
          }
        } catch (error) {
          console.error("암흑기사 정보 가져오기 실패:", error);
          content = `# ⚔️ 암흑기사 7.2 Gearsets

## 🎯 BiS Gearsets
**📊 전체 세트:** [All sets in one sheet](https://xivgear.app/?page=bis|drk|current)

**⚡ 스킬 스피드별 세팅:**
- **2.50 GCD:** [BiS 2.50](https://xivgear.app/?page=bis|drk|current&onlySetIndex=0)
- **2.46 GCD:** [BiS 2.46](https://xivgear.app/?page=bis|drk|current&onlySetIndex=1)
`;
        }
      } else {
        // Google Sheets 초기화 실패 시 기본값
        content = `# ⚔️ 암흑기사 7.2 Gearsets

## 🎯 BiS Gearsets
**📊 전체 세트:** [All sets in one sheet](https://xivgear.app/?page=bis|drk|current)

**⚡ 스킬 스피드별 세팅:**
- **2.50 GCD:** [BiS 2.50](https://xivgear.app/?page=bis|drk|current&onlySetIndex=0)
- **2.46 GCD:** [BiS 2.46](https://xivgear.app/?page=bis|drk|current&onlySetIndex=1)

## 🔄 Prog Gearsets
**📊 전체 세트:** [All prog sets](https://xivgear.app/?page=bis|drk|prog)

**🛡️ 프로그 세팅:**
- **2.50 with tome chest:** [Prog 2.50](https://xivgear.app/?page=bis|drk|prog&onlySetIndex=0)

`;
      }

      await interaction.reply({
        content: content,
        ephemeral: true,
      });
    } else if (commandName === "무도가") {
      let content = "## 7.2 BIS\n";

      if (sheetsInitialized) {
        try {
          const jobInfo = await sheetsService.getJobInfo("무도가");
          if (jobInfo) {
            content = sheetsService.formatJobMessage(jobInfo);
          } else {
            // 기본값 사용
            content = `## 7.2 BIS
[최종](https://bit.ly/7-20-DNC-Bis)
[절 에덴](https://xivgear.app/?page=sl|744768db-304a-4003-8bec-9592902c242d)`;
          }
        } catch (error) {
          console.error("무도가 정보 가져오기 실패:", error);
          content = `## 7.2 BIS
[최종](https://bit.ly/7-20-DNC-Bis)
[절 에덴](https://xivgear.app/?page=sl|744768db-304a-4003-8bec-9592902c242d)`;
        }
      } else {
        // Google Sheets 초기화 실패 시 기본값
        content = `## 7.2 BIS
[최종](https://bit.ly/7-20-DNC-Bis)
[절 에덴](https://xivgear.app/?page=sl|744768db-304a-4003-8bec-9592902c242d)`;
      }

      await interaction.reply({
        content: content,
        ephemeral: true,
      });
    }
  } catch (error) {
    console.error("슬래시 명령어 처리 중 오류:", error);

    const errorMessage = {
      content: "명령어 처리 중 오류가 발생했습니다.",
      ephemeral: true,
    };

    if (interaction.deferred || interaction.replied) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

client.on(Events.MessageCreate, (message) => {
  if (message.author.bot) return;

  const userId = message.author.id;
  const now = Date.now();
  const cooldownAmount = 2000;

  if (userCooldowns.has(userId)) {
    const expirationTime = userCooldowns.get(userId) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message
        .reply(`⏰ ${timeLeft.toFixed(1)}초 후에 다시 시도해주세요!`)
        .then((sentMessage) => {
          setTimeout(() => {
            sentMessage.delete().catch((err) => {
              console.log(
                "메시지 삭제 실패 (이미 삭제되었거나 권한 없음):",
                err.message
              );
            });
          }, 3000); // 3초 후 삭제
        });
    }
  }

  userCooldowns.set(userId, now);
  setTimeout(() => userCooldowns.delete(userId), cooldownAmount);

  if (message.content === "!안녕") {
    message.reply("인간 세상의 끝이 도래했다 🤖");
  }

  if (message.content === "!테스트") {
    message.reply({
      content:
        "**사용 가능한 명령어:**\n`!안녕` - 인사하기\n`!명령어` - 명령어 목록 보기\n`!핑` - 핑 확인하기\n`!픽토맨서` - 픽토맨서 정보 보기\n`!암흑기사` - 암흑기사 7.2 Gearsets 보기\n`!골라줘 [옵션들]` - 여러 옵션 중 랜덤 선택",
    });
  }

  if (message.content === "!픽토맨서") {
    message.reply(
      `
      ## 7.2 BIS
      [최종](https://xivgear.app/?page=sl%7Cc48f85d8-9b93-4f96-bfc4-1e0e30e98a8c)
      [PROG](https://xivgear.app/?page=sl%7Cd968ecc8-019a-4ea4-976e-083f0b8b8df3)
      [절 에덴](https://xivgear.app/?page=sl%7C6e51083b-3b75-4236-9036-c992ab490368)
    `
    );
  }

  if (message.content === "!암흑기사") {
    message.reply(
      `
      ## 7.2 BIS
      [2.5](https://xivgear.app/?page=bis|drk|current&onlySetIndex=0)
      [2.46](https://xivgear.app/?page=bis|drk|current&onlySetIndex=1)
      [PROG](https://xivgear.app/?page=bis|drk|prog)
    `
    );
  }

  if (message.content === "!무도가" || message.content === "!무희") {
    message.reply(
      `
      ## 7.2 BIS
      [최종](https://bit.ly/7-20-DNC-Bis)
      [절 에덴](https://xivgear.app/?page=sl|744768db-304a-4003-8bec-9592902c242d)
    `
    );
  }

  // !골라줘 명령어 처리
  if (message.content.startsWith("!골라줘 ")) {
    const options = message.content.slice(5).trim(); // "!골라줘 " 제거

    if (!options) {
      message.reply(
        "❌ 선택할 옵션을 입력해주세요!\n예시: `!골라줘 떡볶이 순대 김치찜`"
      );
      return;
    }

    const choices = options.split(" ").filter((choice) => choice.trim() !== "");

    if (choices.length < 2) {
      message.reply(
        "❌ 최소 2개 이상의 옵션을 입력해주세요!\n예시: `!골라줘 떡볶이 순대 김치찜`"
      );
      return;
    }

    // 랜덤으로 선택
    const randomChoice = choices[Math.floor(Math.random() * choices.length)];

    message.reply(`**${randomChoice}**`);
  }
});

client.on(Events.Error, (error) => {
  console.error("Discord 클라이언트 오류:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("처리되지 않은 Promise 거부:", error);
});

client.login(process.env.DISCORD_TOKEN);
