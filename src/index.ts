import "dotenv/config";

// Services
import DiscordService from "./services/discordService";
import GoogleSheetsService from "./services/googleSheetsService";
import HttpService from "./services/httpService";

// Handlers
import CommandHandler from "./handlers/commandHandler";
import MessageHandler from "./handlers/messageHandler";
import EventHandler from "./handlers/eventHandler";

// Middlewares
import CooldownManager from "./middlewares/cooldown";
import createRateLimit from "./middlewares/rateLimit";

// Utils
import Logger from "./utils/logger";

class BoruBot {
  private discordService: DiscordService;
  private sheetsService: GoogleSheetsService;
  private httpService: HttpService;
  private cooldownManager: CooldownManager;
  private commandHandler: CommandHandler;
  private messageHandler: MessageHandler;
  private eventHandler: EventHandler;

  constructor() {
    this.discordService = new DiscordService();
    this.sheetsService = new GoogleSheetsService();
    this.httpService = new HttpService();
    this.cooldownManager = new CooldownManager();

    this.commandHandler = new CommandHandler(this.sheetsService);
    this.messageHandler = new MessageHandler(this.cooldownManager);
    this.eventHandler = new EventHandler(
      this.discordService,
      this.commandHandler,
      this.messageHandler,
      this.sheetsService
    );
  }

  async initialize(): Promise<void> {
    try {
      // HTTP 서버 설정
      this.httpService.use(createRateLimit());
      this.httpService.initialize();

      // Discord 봇 시작
      await this.discordService.initialize();

      Logger.info("보루 디스코드 봇이 성공적으로 시작되었습니다!");
    } catch (error) {
      Logger.error("봇 초기화 실패:", error);
      process.exit(1);
    }
  }
}

// 봇 시작
const bot = new BoruBot();
bot.initialize();
