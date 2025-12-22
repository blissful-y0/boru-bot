import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import xivGearService from "../../services/xivGearService";
import { JOB_MAPPINGS, JOB_NAMES_KR } from "../../utils/constants";
import Logger from "../../utils/logger";

// 직업 선택 옵션 생성
const jobChoices = Object.entries(JOB_MAPPINGS).map(([krName, code]) => ({
  name: krName,
  value: code,
}));

export const data = new SlashCommandBuilder()
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

const bisCommand = {
  name: "bis",
  description: "FFXIV 직업별 Best-in-Slot 장비 정보를 확인합니다",

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const jobCode = interaction.options.getString("직업", true);
    const type = interaction.options.getString("타입") || "both";

    const jobKr = JOB_NAMES_KR[jobCode] || jobCode.toUpperCase();

    try {
      await interaction.deferReply();

      let content: string;

      if (type === "both") {
        content = await xivGearService.getBothSets(jobCode);
      } else {
        const result = await xivGearService.getBisData(
          jobCode,
          type as "current" | "prog"
        );
        content = xivGearService.formatBisMessage(result);
      }

      await interaction.editReply({
        content,
      });
    } catch (error) {
      Logger.error(`BiS 명령어 실행 오류 (${jobKr}):`, error);
      await interaction.editReply({
        content: `❌ ${jobKr}의 BiS 정보를 가져오는 중 오류가 발생했습니다.`,
      });
    }
  },
};

export default bisCommand;
