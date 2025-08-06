import { DEFAULT_JOB_DATA } from "../../../utils/constants";
import { formatDefaultJobMessage } from "../../../utils/helpers";
import Logger from "../../../utils/logger";
import { CommandInteraction } from "discord.js";
import GoogleSheetsService from "../../../services/googleSheetsService";

interface SlashCommand {
  name: string;
  description: string;
  execute: (interaction: CommandInteraction, sheetsService?: GoogleSheetsService) => Promise<void>;
}

const darkKnightCommand: SlashCommand = {
  name: "암흑기사",
  description: "암흑기사 7.2 Gearsets 보기",

  async execute(interaction: CommandInteraction, sheetsService?: GoogleSheetsService): Promise<void> {
    let content = "# ⚔️ 암흑기사 7.2 Gearsets\n";

    if (sheetsService) {
      try {
        const jobInfo = await sheetsService.getJobInfo("암흑기사");
        if (jobInfo) {
          content = sheetsService.formatJobMessage(jobInfo);
        } else {
          content = formatDefaultJobMessage(DEFAULT_JOB_DATA.암흑기사);
        }
      } catch (error) {
        Logger.error("암흑기사 정보 가져오기 실패:", error);
        content = formatDefaultJobMessage(DEFAULT_JOB_DATA.암흑기사);
      }
    } else {
      content = formatDefaultJobMessage(DEFAULT_JOB_DATA.암흑기사);
    }

    await interaction.reply({
      content: content,
      ephemeral: true,
    });
  },
};

export default darkKnightCommand;
