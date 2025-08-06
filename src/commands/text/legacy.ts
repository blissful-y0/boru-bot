import { MESSAGES, JP_DC_WORDS } from "../../utils/constants";
import { Message } from "discord.js";

interface LegacyCommand {
  name: string;
  execute: (message: Message) => Promise<void>;
}

interface LegacyCommands {
  [key: string]: LegacyCommand;
}

const legacyCommands: LegacyCommands = {
  "!안녕": {
    name: "안녕",
    async execute(message: Message): Promise<void> {
      await message.reply(MESSAGES.BOT_GREETING);
    },
  },

  "!일데센": {
    name: "일본 DC 용어 사전",
    async execute(message: Message): Promise<void> {
      await message.({ content: JP_DC_WORDS });
    },
  },
};

export default legacyCommands;
