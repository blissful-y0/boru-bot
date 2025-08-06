import { Message, Interaction } from "discord.js";

/**
 * 봇 메시지인지 확인
 */
export function isBotMessage(message: Message): boolean {
  return message.author.bot;
}

/**
 * 슬래시 명령어인지 확인
 */
export function isChatInputCommand(interaction: Interaction): boolean {
  return interaction.isChatInputCommand();
}

/**
 * 텍스트 명령어 형식 확인
 */
export function startsWithPrefix(content: string, prefix: string): boolean {
  return content.startsWith(prefix);
}

/**
 * 명령어 인자 추출
 */
export function extractArgs(content: string, command: string): string {
  return content.slice(command.length).trim();
}

/**
 * 빈 문자열 또는 undefined 체크
 */
export function isEmpty(str: string | undefined): boolean {
  return !str || str.trim() === "";
}
