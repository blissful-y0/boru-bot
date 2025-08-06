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

const pictomancerCommand: SlashCommand = {
  name: "픽토맨서",
  description: "픽토맨서 정보 보기",

  async execute(interaction: CommandInteraction, sheetsService?: GoogleSheetsService): Promise<void> {
    let content = "## 7.2 BIS\n";

    if (sheetsService) {
      try {
        const jobInfo = await sheetsService.getJobInfo("픽토맨서");
        if (jobInfo) {
          content = sheetsService.formatJobMessage(jobInfo);
        } else {
          content = formatDefaultJobMessage(DEFAULT_JOB_DATA.픽토맨서);
        }
      } catch (error) {
        Logger.error("픽토맨서 정보 가져오기 실패:", error);
        content = formatDefaultJobMessage(DEFAULT_JOB_DATA.픽토맨서);
      }
    } else {
      content = formatDefaultJobMessage(DEFAULT_JOB_DATA.픽토맨서);
    }

    await interaction.reply({
      content: content,
      ephemeral: true,
    });
  },
};

export default pictomancerCommand;
