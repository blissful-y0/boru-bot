import serverConfig from "../../config/server";
import { msToSeconds } from "../utils/helpers";
import { MESSAGES } from "../utils/constants";
import { Message } from "discord.js";

class CooldownManager {
  private userCooldowns: Map<string, number>;
  private cooldownAmount: number;
  private deleteTimeout: number;

  constructor() {
    this.userCooldowns = new Map();
    this.cooldownAmount = serverConfig.cooldown.amount;
    this.deleteTimeout = serverConfig.cooldown.deleteTimeout;
  }

  // 쿨다운 체크 및 처리
  async checkCooldown(message: Message): Promise<boolean> {
    const userId = message.author.id;
    const now = Date.now();

    if (this.userCooldowns.has(userId)) {
      const expirationTime = this.userCooldowns.get(userId)! + this.cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = msToSeconds(expirationTime - now);
        const warningMessage = MESSAGES.RATE_LIMIT_WARNING.replace("{time}", timeLeft);
        
        const sentMessage = await message.reply(warningMessage);
        
        // 메시지 자동 삭제
        setTimeout(() => {
          sentMessage.delete().catch((err) => {
            console.log("메시지 삭제 실패 (이미 삭제되었거나 권한 없음):", err.message);
          });
        }, this.deleteTimeout);
        
        return false; // 쿨다운 중
      }
    }

    // 쿨다운 설정
    this.userCooldowns.set(userId, now);
    setTimeout(() => this.userCooldowns.delete(userId), this.cooldownAmount);
    
    return true; // 처리 가능
  }

  // 쿨다운 초기화
  clearCooldown(userId: string): void {
    this.userCooldowns.delete(userId);
  }
}

export default CooldownManager;
