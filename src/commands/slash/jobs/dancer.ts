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

const dancerCommand: SlashCommand = {
  name: "무도가",
  description: "무도가 7.2 BIS 보기",

  async execute(interaction: CommandInteraction, sheetsService?: GoogleSheetsService): Promise<void> {
    let content = "## 7.2 BIS\n";

    if (sheetsService) {
      try {
        const jobInfo = await sheetsService.getJobInfo("무도가");
        if (jobInfo) {
          content = sheetsService.formatJobMessage(jobInfo);
        } else {
          content = formatDefaultJobMessage(DEFAULT_JOB_DATA.무도가);
        }
      } catch (error) {
        Logger.error("무도가 정보 가져오기 실패:", error);
        content = formatDefaultJobMessage(DEFAULT_JOB_DATA.무도가);
      }
    } else {
      content = formatDefaultJobMessage(DEFAULT_JOB_DATA.무도가);
    }

    await interaction.reply({
      content: content,
      ephemeral: true,
    });
  },
};

export default dancerCommand;
