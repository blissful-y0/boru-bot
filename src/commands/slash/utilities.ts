import { COMMANDS } from "../../utils/constants";
import { CommandInteraction } from "discord.js";
import GoogleSheetsService from "../../services/googleSheetsService";

interface SlashCommand {
  name: string;
  description: string;
  execute: (
    interaction: CommandInteraction,
    sheetsService?: GoogleSheetsService
  ) => Promise<void>;
}

const commandsCommand: SlashCommand = {
  name: "명령어",
  description: "명령어 목록 보기",

  async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply({
      content: COMMANDS.HELP_TEXT,
      ephemeral: true,
    });
  },
};

const pingCommand: SlashCommand = {
  name: "핑",
  description: "핑 확인하기",

  async execute(interaction: CommandInteraction): Promise<void> {
    const latency = Date.now() - interaction.createdTimestamp;
    await interaction.reply({
      content: `🏓 퐁! 레이턴시: ${latency}ms`,
      ephemeral: true,
    });
  },
};

export { commandsCommand, pingCommand };
