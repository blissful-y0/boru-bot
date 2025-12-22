import Logger from "../utils/logger";
import {
  XIVGEAR_AVAILABLE_JOBS,
  FALLBACK_BIS_URLS,
  JOB_NAMES_KR,
} from "../utils/constants";

// XIVGear API 응답 타입
interface XIVGearSet {
  name: string;
  items: {
    Weapon?: { id: number };
    Head?: { id: number };
    Body?: { id: number };
    Hand?: { id: number };
    Legs?: { id: number };
    Feet?: { id: number };
    Ears?: { id: number };
    Neck?: { id: number };
    Wrist?: { id: number };
    RingLeft?: { id: number };
    RingRight?: { id: number };
  };
  food?: number;
  computedStats?: {
    hp: number;
    strength?: number;
    dexterity?: number;
    intelligence?: number;
    mind?: number;
    vitality: number;
    crit: number;
    dhit: number;
    determination: number;
    skillspeed?: number;
    spellspeed?: number;
    tenacity?: number;
    piety?: number;
    gcd: number;
  };
  description?: string;
}

interface XIVGearResponse {
  sets: XIVGearSet[];
  job: string;
  level: number;
  name?: string;
  description?: string;
}

export interface BisResult {
  success: boolean;
  job: string;
  jobKr: string;
  type: "current" | "prog";
  sets?: XIVGearSet[];
  xivGearUrl: string;
  fallbackUrl?: string;
  error?: string;
}

class XIVGearService {
  private readonly API_BASE_URL = "https://api.xivgear.app/fulldata/bis";
  private readonly WEB_BASE_URL = "https://xivgear.app/?page=bis";

  /**
   * XIVGear API에서 BiS 데이터를 가져옵니다.
   * @param jobCode 직업 코드 (drk, war, etc.)
   * @param type current (최종 BiS) 또는 prog (프로그레션)
   */
  async getBisData(
    jobCode: string,
    type: "current" | "prog" = "current"
  ): Promise<BisResult> {
    const jobKr = JOB_NAMES_KR[jobCode] || jobCode.toUpperCase();
    const xivGearUrl = `${this.WEB_BASE_URL}|${jobCode}|${type}`;

    // XIVGear API 미지원 직업인 경우 fallback URL 반환
    if (!XIVGEAR_AVAILABLE_JOBS.includes(jobCode)) {
      const fallback = FALLBACK_BIS_URLS[jobCode];
      if (fallback && fallback[type]) {
        return {
          success: true,
          job: jobCode,
          jobKr,
          type,
          xivGearUrl: fallback[type],
          fallbackUrl: fallback[type],
        };
      }
      return {
        success: false,
        job: jobCode,
        jobKr,
        type,
        xivGearUrl,
        error: `${jobKr}의 BiS 정보가 아직 등록되지 않았습니다.`,
      };
    }

    try {
      const apiUrl = `${this.API_BASE_URL}/${jobCode}/${type}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`API 응답 오류: ${response.status}`);
      }

      const data = (await response.json()) as XIVGearResponse;

      return {
        success: true,
        job: jobCode,
        jobKr,
        type,
        sets: data.sets,
        xivGearUrl,
      };
    } catch (error) {
      Logger.error(`XIVGear API 호출 실패 (${jobCode}/${type}):`, error);

      // API 실패 시 fallback URL 확인
      const fallback = FALLBACK_BIS_URLS[jobCode];
      if (fallback && fallback[type]) {
        return {
          success: true,
          job: jobCode,
          jobKr,
          type,
          xivGearUrl: fallback[type],
          fallbackUrl: fallback[type],
        };
      }

      return {
        success: false,
        job: jobCode,
        jobKr,
        type,
        xivGearUrl,
        error: `${jobKr}의 BiS 정보를 가져오는데 실패했습니다.`,
      };
    }
  }

  /**
   * BiS 결과를 Discord 메시지로 포맷팅합니다.
   */
  formatBisMessage(result: BisResult): string {
    const typeLabel = result.type === "current" ? "최종 BiS" : "Progression";
    const emoji = result.type === "current" ? "⚔️" : "🔄";

    if (!result.success) {
      return `❌ ${result.error}`;
    }

    let message = `**${emoji} ${result.jobKr} ${typeLabel}**\n\n`;
    message += `🔗 ${result.xivGearUrl}`;

    return message;
  }

  /**
   * BiS와 Prog 모두를 가져와서 포맷팅합니다.
   */
  async getBothSets(jobCode: string): Promise<string> {
    const [currentResult, progResult] = await Promise.all([
      this.getBisData(jobCode, "current"),
      this.getBisData(jobCode, "prog"),
    ]);

    const jobKr = JOB_NAMES_KR[jobCode] || jobCode.toUpperCase();
    let message = `**${jobKr} 장비**\n\n`;

    // 최종 BiS
    message += `**최종 BiS**\n`;
    if (currentResult.success) {
      message += `🔗 ${currentResult.xivGearUrl}\n\n`;
    } else {
      message += `❌ ${currentResult.error}\n\n`;
    }

    // Progression
    message += `**출발 BiS**\n`;
    if (progResult.success) {
      message += `🔗 ${progResult.xivGearUrl}`;
    } else {
      message += `❌ ${progResult.error}`;
    }

    return message;
  }
}

export default new XIVGearService();
