import { splitAndFilter, getRandomChoice } from "../../utils/helpers";
import { MESSAGES } from "../../utils/constants";
import {
  startsWithPrefix,
  extractArgs,
  isEmpty,
} from "../../middlewares/validation";
import { Message } from "discord.js";

interface TextCommand {
  prefix: string;
  name: string;
  description: string;
  canExecute: (content: string) => boolean;
  execute: (message: Message) => Promise<void>;
}

const chooseCommand: TextCommand = {
  prefix: "!골라줘 ",
  name: "골라줘",
  description: "여러 옵션 중 랜덤 선택",

  canExecute(content: string): boolean {
    return startsWithPrefix(content, this.prefix);
  },

  async execute(message: Message): Promise<void> {
    const options = extractArgs(message.content, this.prefix);

    if (isEmpty(options)) {
      await message.reply(MESSAGES.CHOOSE_ERROR);
      return;
    }

    const choices = splitAndFilter(options);

    if (choices.length < 2) {
      await message.reply(MESSAGES.CHOOSE_MIN_ERROR);
      return;
    }

    const randomChoice = getRandomChoice(choices);
    await message.reply(`**${randomChoice}**`);
  },
};

export default chooseCommand;
