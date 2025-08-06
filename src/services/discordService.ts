import { Client, GatewayIntentBits, Partials } from "discord.js";
import discordConfig from "../../config/discord";
import Logger from "../utils/logger";

class DiscordService {
  private client: Client;
  private isReady: boolean;

  constructor() {
    this.client = new Client(discordConfig);
    this.isReady = false;
  }

  // Discord 클라이언트 초기화
  async initialize(): Promise<boolean> {
    try {
      await this.client.login(discordConfig.token);
      Logger.info("Discord 클라이언트 로그인 완료");
      return true;
    } catch (error) {
      Logger.error("Discord 클라이언트 로그인 실패:", error);
      return false;
    }
  }

  // 이벤트 리스너 등록
  onReady(callback: (readyClient: Client<true>) => void): void {
    this.client.once("ready", (readyClient) => {
      this.isReady = true;
      Logger.info(`Ready! ${readyClient.user.tag}에 로그인했습니다.`);
      callback(readyClient);
    });
  }

  onInteractionCreate(callback: (interaction: any) => void): void {
    this.client.on("interactionCreate", callback);
  }

  onMessageCreate(callback: (message: any) => void): void {
    this.client.on("messageCreate", callback);
  }

  onError(callback: (error: Error) => void): void {
    this.client.on("error", callback);
  }

  // 클라이언트 반환
  getClient(): Client {
    return this.client;
  }
}

export default DiscordService;
