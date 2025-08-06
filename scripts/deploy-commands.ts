import { REST, Routes } from "discord.js";
import "dotenv/config";

const commands = [
  {
    name: "안녕",
    description: "봇과 인사하기",
  },
  {
    name: "명령어",
    description: "사용 가능한 명령어 목록 보기",
  },
  {
    name: "핑",
    description: "봇의 응답 속도 확인하기",
  },
  {
    name: "픽토맨서",
    description: "픽토맨서 7.2 BIS 정보 보기",
  },
  {
    name: "암흑기사",
    description: "암흑기사 7.2 Gearsets 정보 보기",
  },
  {
    name: "무도가",
    description: "무도가 7.2 BIS 정보 보기",
  },
];

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    console.log(`${commands.length}개의 슬래시 명령어를 등록하는 중...`);

    // 글로벌 명령어로 등록 (모든 서버에서 사용 가능)
    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID!),
      { body: commands }
    ) as any[];

    console.log(
      `${data.length}개의 슬래시 명령어가 성공적으로 등록되었습니다!`
    );
  } catch (error) {
    console.error("명령어 등록 중 오류 발생:", error);
  }
})();
