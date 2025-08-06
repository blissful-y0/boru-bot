interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  standardHeaders: boolean;
  legacyHeaders: boolean;
}

interface CooldownConfig {
  amount: number;
  deleteTimeout: number;
}

interface ServerConfig {
  port: number;
  rateLimit: RateLimitConfig;
  cooldown: CooldownConfig;
}

const serverConfig: ServerConfig = {
  port: parseInt(process.env.PORT || "3000"),
  rateLimit: {
    windowMs: 15 * 1000, // 15초
    max: 10, // 최대 10회
    message: "너무 많은 요청입니다. 잠시 후 다시 시도해주세요.",
    standardHeaders: true,
    legacyHeaders: false,
  },
  cooldown: {
    amount: 2000, // 2초
    deleteTimeout: 3000, // 3초 후 메시지 삭제
  },
};

export default serverConfig;
