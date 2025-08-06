interface JobLink {
  name: string;
  url: string;
}

interface JobData {
  title?: string;
  content?: string;
  links?: JobLink[];
}

/**
 * 배열에서 랜덤 요소 선택
 */
export function getRandomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * 문자열을 공백으로 분리하고 빈 문자열 제거
 */
export function splitAndFilter(text: string): string[] {
  return text.split(" ").filter((item) => item.trim() !== "");
}

/**
 * 기본 직업 데이터를 포맷된 메시지로 변환
 */
export function formatDefaultJobMessage(jobData: JobData | null): string {
  if (!jobData) return "해당 직업 정보를 찾을 수 없습니다.";

  if (jobData.content) {
    return jobData.title + jobData.content;
  }

  if (jobData.links) {
    let message = jobData.title + "\n";
    jobData.links.forEach((link) => {
      message += `[${link.name}](${link.url})\n`;
    });
    return message;
  }

  return jobData.title || "정보가 없습니다.";
}

/**
 * 시간을 초 단위로 변환
 */
export function msToSeconds(ms: number): string {
  return (ms / 1000).toFixed(1);
}
