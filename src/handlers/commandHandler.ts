import helloCommand from "../commands/slash/hello";
import { commandsCommand, pingCommand } from "../commands/slash/utilities";
import bisCommand from "../commands/slash/bis";
import { ChatInputCommandInteraction, CommandInteraction } from "discord.js";
import GoogleSheetsService from "../services/googleSheetsService";

interface SlashCommand {
  name: string;
  description: string;
  execute: (
    interaction: ChatInputCommandInteraction,
    sheetsService?: GoogleSheetsService
  ) => Promise<void>;
}

class CommandHandler {
  private sheetsService: GoogleSheetsService;
  private slashCommands: Map<string, SlashCommand>;

  constructor(sheetsService: GoogleSheetsService) {
    this.sheetsService = sheetsService;
    this.slashCommands = new Map();
    this.registerCommands();
  }

  registerCommands(): void {
    // 기본 명령어
    this.slashCommands.set("안녕", helloCommand);
    this.slashCommands.set("명령어", commandsCommand);
    this.slashCommands.set("핑", pingCommand);

    // BiS 통합 명령어
    this.slashCommands.set("bis", bisCommand);
  }

  async handleSlashCommand(
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    const { commandName } = interaction;
    const command = this.slashCommands.get(commandName);

    if (!command) {
      await interaction.reply({
        content: "알 수 없는 명령어입니다.",
        ephemeral: true,
      });
      return;
    }

    try {
      await command.execute(interaction, this.sheetsService);
    } catch (error) {
      console.error(`슬래시 명령어 처리 중 오류 (${commandName}):`, error);

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
  }

  getRegisteredCommands(): string[] {
    return Array.from(this.slashCommands.keys());
  }
}

export default CommandHandler;
