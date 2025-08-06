import express, { Application, Request, Response } from "express";
import serverConfig from "../../config/server";
import Logger from "../utils/logger";

class HttpService {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = serverConfig.port;
  }

  // Express 서버 초기화
  initialize(): void {
    this.app.get("/", (req: Request, res: Response) => {
      res.send("보루 Discord Bot is running!");
    });

    this.app.listen(this.port, () => {
      Logger.info(`HTTP 서버가 포트 ${this.port}에서 실행 중입니다.`);
    });
  }

  // 미들웨어 추가
  use(middleware: any): void {
    this.app.use(middleware);
  }

  // Express 앱 반환
  getApp(): Application {
    return this.app;
  }
}

export default HttpService;
