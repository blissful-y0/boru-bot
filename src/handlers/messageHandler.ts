import chooseCommand from "../commands/text/choose";
import legacyCommands from "../commands/text/legacy";
import menuCommand from "../commands/text/menu";
import { isBotMessage } from "../middlewares/validation";
import { Message } from "discord.js";
import CooldownManager from "../middlewares/cooldown";

class MessageHandler {
  private cooldownManager: CooldownManager;

  constructor(cooldownManager: CooldownManager) {
    this.cooldownManager = cooldownManager;
  }

  async handleMessage(message: Message): Promise<void> {
    // 봇 메시지 무시
    if (isBotMessage(message)) return;

    // 명령어 여부 먼저 확인
    let isCommand = false;

    try {
      // !골라줘 명령어 처리
      if (chooseCommand.canExecute(message.content)) {
        isCommand = true;
        // 쿨다운 체크
        const canProcess = await this.cooldownManager.checkCooldown(message);
        if (!canProcess) return;

        await chooseCommand.execute(message);
        return;
      }

      // !오메추 명령어 처리
      if (menuCommand.canExecute(message.content)) {
        isCommand = true;
        // 쿨다운 체크
        const canProcess = await this.cooldownManager.checkCooldown(message);
        if (!canProcess) return;

        await menuCommand.execute(message);
        return;
      }

      // 그외 명령어 처리
      const legacyCommand = legacyCommands[message.content];
      if (legacyCommand) {
        isCommand = true;
        // 쿨다운 체크
        const canProcess = await this.cooldownManager.checkCooldown(message);
        if (!canProcess) return;

        await legacyCommand.execute(message);
        return;
      }

      // 명령어가 아닌 경우 쿨다운 적용하지 않음
    } catch (error) {
      console.error("메시지 처리 중 오류:", error);
      if (isCommand) {
        await message.reply("메시지 처리 중 오류가 발생했습니다.");
      }
    }
  }
}

export default MessageHandler;
