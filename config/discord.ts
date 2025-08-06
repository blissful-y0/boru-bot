import { GatewayIntentBits } from "discord.js";

interface DiscordConfig {
  intents: GatewayIntentBits[];
  token: string;
}

const discordConfig: DiscordConfig = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  token: process.env.DISCORD_TOKEN!,
};

export default discordConfig;
