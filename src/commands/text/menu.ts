import { getRandomChoice } from "../../utils/helpers";
import { startsWithPrefix } from "../../middlewares/validation";
import { MENU_OPTIONS } from "../../utils/constants";
import { Message } from "discord.js";

interface TextCommand {
  prefix: string;
  name: string;
  description: string;
  canExecute: (content: string) => boolean;
  execute: (message: Message) => Promise<void>;
}

const menuCommand: TextCommand = {
  prefix: "!오메추",
  name: "메뉴",
  description: "봇루가 메뉴를 골라드립니다",

  canExecute(content: string): boolean {
    return startsWithPrefix(content, this.prefix);
  },

  async execute(message: Message): Promise<void> {
    const menus = MENU_OPTIONS;
    const randomMenu = getRandomChoice(menus);
    await message.reply(`**${randomMenu}**`);
  },
};

export default menuCommand;
