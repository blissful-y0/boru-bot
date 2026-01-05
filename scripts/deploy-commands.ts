import { REST, Routes, SlashCommandBuilder } from "discord.js";
import "dotenv/config";

// 직업 매핑 (한글 → 영문 코드)
const JOB_MAPPINGS: Record<string, string> = {
  나이트: "pld",
  전사: "war",
  암흑기사: "drk",
  건브레이커: "gnb",
  백마도사: "whm",
  학자: "sch",
  점성술사: "ast",
  현자: "sge",
  몽크: "mnk",
  용기사: "drg",
  닌자: "nin",
  사무라이: "sam",
  리퍼: "rpr",
  바이퍼: "vpr",
  음유시인: "brd",
  기공사: "mch",
  무도가: "dnc",
  흑마도사: "blm",
  소환사: "smn",
  적마도사: "rdm",
  픽토맨서: "pct",
};

// 직업 선택 옵션 생성
const jobChoices = Object.entries(JOB_MAPPINGS).map(([krName, code]) => ({
  name: krName,
  value: code,
}));

// /리마인더 명령어 빌더
const reminderCommand = new SlashCommandBuilder()
  .setName("리마인더")
  .setDescription("리마인더를 관리합니다")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("생성")
      .setDescription("새 리마인더를 생성합니다")
      .addStringOption((option) =>
        option
          .setName("시간")
          .setDescription("예약 시간 (예: 2024-12-25 13:00)")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("메시지")
          .setDescription("리마인드 메시지 내용")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("멘션")
          .setDescription("멘션 대상 (@everyone, @here, @사용자, @역할)")
          .setRequired(false)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("목록")
      .setDescription("예약된 리마인더 목록을 조회합니다")
      .addBooleanOption((option) =>
        option
          .setName("전체")
          .setDescription("서버 전체 리마인더 보기 (관리자 전용)")
          .setRequired(false)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("취소")
      .setDescription("리마인더를 취소합니다")
      .addStringOption((option) =>
        option
          .setName("id")
          .setDescription("취소할 리마인더 ID")
          .setRequired(true)
      )
  );

// /bis 명령어 빌더
const bisCommand = new SlashCommandBuilder()
  .setName("bis")
  .setDescription("FFXIV 직업별 Best-in-Slot 장비 정보를 확인합니다")
  .addStringOption((option) =>
    option
      .setName("직업")
      .setDescription("BiS를 확인할 직업을 선택하세요")
      .setRequired(true)
      .addChoices(...jobChoices)
  )
  .addStringOption((option) =>
    option
      .setName("타입")
      .setDescription("BiS 타입을 선택하세요")
      .setRequired(false)
      .addChoices(
        { name: "전체 (BiS + Prog)", value: "both" },
        { name: "최종 BiS", value: "current" },
        { name: "Progression (1주차)", value: "prog" }
      )
  );

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
  bisCommand.toJSON(),
  reminderCommand.toJSON(),
];

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    console.log(`${commands.length}개의 슬래시 명령어를 등록하는 중...`);

    // 글로벌 명령어로 등록 (모든 서버에서 사용 가능)
    const data = (await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID!),
      { body: commands }
    )) as any[];

    console.log(
      `${data.length}개의 슬래시 명령어가 성공적으로 등록되었습니다!`
    );
  } catch (error) {
    console.error("명령어 등록 중 오류 발생:", error);
  }
})();
