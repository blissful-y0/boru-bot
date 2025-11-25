import { GatewayIntentBits } from "discord.js";

interface DiscordConfig {
  intents: GatewayIntentBits[];
  token: string;
}

const token = process.env.DISCORD_TOKEN;

// 디버깅: 토큰 로딩 확인
console.log(`[DEBUG] DISCORD_TOKEN 존재 여부: ${!!token}`);
console.log(`[DEBUG] DISCORD_TOKEN 길이: ${token?.length || 0}`);
console.log(`[DEBUG] DISCORD_TOKEN 앞 10자: ${token?.substring(0, 10) || 'N/A'}...`);

if (!token) {
  console.error('[ERROR] DISCORD_TOKEN 환경 변수가 설정되지 않았습니다!');
  console.log('[DEBUG] 현재 설정된 환경 변수 키:', Object.keys(process.env).filter(k => k.includes('DISCORD') || k.includes('TOKEN')));
}

const discordConfig: DiscordConfig = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  token: token || '',
};

export default discordConfig;
