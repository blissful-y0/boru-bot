import { MESSAGES } from "../../utils/constants";
import { CommandInteraction } from "discord.js";
import GoogleSheetsService from "../../services/googleSheetsService";

interface SlashCommand {
  name: string;
  description: string;
  execute: (interaction: CommandInteraction, sheetsService?: GoogleSheetsService) => Promise<void>;
}

const helloCommand: SlashCommand = {
  name: "안녕",
  description: "인사하기",

  async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply({
      content: MESSAGES.BOT_GREETING,
      ephemeral: true,
    });
  },
};

export default helloCommand;
