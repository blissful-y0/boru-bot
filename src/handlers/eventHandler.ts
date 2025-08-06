import { Events, Client, Interaction, Message } from "discord.js";
import Logger from "../utils/logger";
import { isChatInputCommand } from "../middlewares/validation";
import DiscordService from "../services/discordService";
import CommandHandler from "./commandHandler";
import MessageHandler from "./messageHandler";
import GoogleSheetsService from "../services/googleSheetsService";

class EventHandler {
  private discordService: DiscordService;
  private commandHandler: CommandHandler;
  private messageHandler: MessageHandler;
  private sheetsService: GoogleSheetsService;

  constructor(
    discordService: DiscordService,
    commandHandler: CommandHandler,
    messageHandler: MessageHandler,
    sheetsService: GoogleSheetsService
  ) {
    this.discordService = discordService;
    this.commandHandler = commandHandler;
    this.messageHandler = messageHandler;
    this.sheetsService = sheetsService;
    this.setupEventListeners();
  }

  setupEventListeners(): void {
    // 봇 준비 이벤트
    this.discordService.onReady(async (readyClient: Client<true>) => {
      // Google Sheets 서비스 초기화
      const sheetsInitialized = await this.sheetsService.initialize();
      this.sheetsService.isInitialized = sheetsInitialized;

      if (sheetsInitialized) {
        Logger.info("Google Sheets 연동이 성공적으로 초기화되었습니다.");
      } else {
        Logger.warn(
          "Google Sheets 연동 초기화에 실패했습니다. 기본값을 사용합니다."
        );
      }
    });

    // 인터랙션 처리 (슬래시 명령어)
    this.discordService.onInteractionCreate(
      async (interaction: Interaction) => {
        if (!isChatInputCommand(interaction)) return;
        await this.commandHandler.handleSlashCommand(interaction as any);
      }
    );

    // 메시지 처리 (텍스트 명령어)
    this.discordService.onMessageCreate(async (message: Message) => {
      await this.messageHandler.handleMessage(message);
    });

    // 에러 처리
    this.discordService.onError((error) => {
      Logger.error("Discord 클라이언트 오류:", error);
    });

    // 처리되지 않은 Promise 거부
    process.on("unhandledRejection", (error) => {
      Logger.error("처리되지 않은 Promise 거부:", error);
    });
  }
}

export default EventHandler;
