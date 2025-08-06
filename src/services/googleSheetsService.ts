import { google } from "googleapis";
import googleConfig from "../../config/google";
import Logger from "../utils/logger";

interface JobItem {
  name: string;
  url: string;
}

interface JobInfo {
  [type: string]: JobItem[];
}

class GoogleSheetsService {
  private auth: any;
  private sheets: any;
  private spreadsheetId: string;
  public isInitialized: boolean;

  constructor() {
    this.auth = null;
    this.sheets = null;
    this.spreadsheetId = googleConfig.spreadsheetId;
    this.isInitialized = false;
  }

  // 서비스 계정 인증 초기화
  async initialize(): Promise<boolean> {
    try {
      this.auth = new google.auth.GoogleAuth({
        credentials: googleConfig.credentials,
        scopes: googleConfig.scopes,
      });

      this.sheets = google.sheets({ version: "v4", auth: this.auth });
      Logger.info("Google Sheets 서비스 초기화 완료");
      return true;
    } catch (error) {
      Logger.error("Google Sheets 초기화 실패:", error);
      return false;
    }
  }

  // 스프레드시트에서 데이터 읽기
  async getSheetData(range: string): Promise<any[][]> {
    try {
      if (!this.sheets) {
        throw new Error("Google Sheets 서비스가 초기화되지 않았습니다.");
      }

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: range,
      });

      return response.data.values || [];
    } catch (error) {
      Logger.error("스프레드시트 데이터 읽기 실패:", error);
      return [];
    }
  }

  // 직업별 정보 가져오기
  async getJobInfo(jobName: string): Promise<JobInfo | null> {
    try {
      const range = `${jobName}!A:C`; // A열: 타입, B열: 링크명, C열: URL
      const data = await this.getSheetData(range);

      if (data.length === 0) {
        return null;
      }

      const jobInfo: JobInfo = {};
      data.forEach((row) => {
        if (row.length >= 3) {
          const [type, name, url] = row;
          if (!jobInfo[type]) {
            jobInfo[type] = [];
          }
          jobInfo[type].push({ name, url });
        }
      });

      return jobInfo;
    } catch (error) {
      Logger.error(`${jobName} 정보 가져오기 실패:`, error);
      return null;
    }
  }

  // 포맷된 메시지 생성
  formatJobMessage(jobInfo: JobInfo | null): string {
    if (!jobInfo) {
      return "해당 직업 정보를 찾을 수 없습니다.";
    }

    let message = "## 7.2 BIS\n";

    Object.entries(jobInfo).forEach(([type, items]) => {
      if (type !== "제목") {
        // 제목 행 제외
        message += `\n**${type}:**\n`;
        items.forEach((item) => {
          message += `[${item.name}](${item.url})\n`;
        });
      }
    });

    return message;
  }
}

export default GoogleSheetsService;
