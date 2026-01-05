import { Client, TextChannel } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import schedule from "node-schedule";
import { Reminder, ReminderData } from "../types/reminder";
import Logger from "../utils/logger";

class ReminderService {
  private client: Client | null;
  private reminders: Map<string, Reminder>;
  private jobs: Map<string, schedule.Job>;
  private dataFilePath: string;

  constructor() {
    this.client = null;
    this.reminders = new Map();
    this.jobs = new Map();
    this.dataFilePath = path.join(process.cwd(), "data", "reminders.json");
  }

  setClient(client: Client): void {
    this.client = client;
  }

  private ensureDataDirectory(): void {
    const dataDir = path.dirname(this.dataFilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  private loadReminders(): void {
    try {
      this.ensureDataDirectory();
      if (fs.existsSync(this.dataFilePath)) {
        const data = fs.readFileSync(this.dataFilePath, "utf-8");
        const parsed: ReminderData = JSON.parse(data);
        parsed.reminders.forEach((r) => this.reminders.set(r.id, r));
        Logger.info(`${parsed.reminders.length}개의 리마인더 로드됨`);
      }
    } catch (error) {
      Logger.error("리마인더 로드 실패:", error);
    }
  }

  private saveReminders(): void {
    try {
      this.ensureDataDirectory();
      const data: ReminderData = {
        reminders: Array.from(this.reminders.values()),
        lastUpdated: new Date().toISOString(),
      };
      fs.writeFileSync(this.dataFilePath, JSON.stringify(data, null, 2), "utf-8");
    } catch (error) {
      Logger.error("리마인더 저장 실패:", error);
    }
  }

  createReminder(
    reminderData: Omit<Reminder, "id" | "createdAt" | "status">
  ): Reminder {
    const reminder: Reminder = {
      ...reminderData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    this.reminders.set(reminder.id, reminder);
    this.saveReminders();
    this.scheduleReminder(reminder);

    return reminder;
  }

  getReminders(guildId: string, userId?: string): Reminder[] {
    const allReminders = Array.from(this.reminders.values());
    return allReminders.filter((r) => {
      if (r.guildId !== guildId) return false;
      if (userId && r.userId !== userId) return false;
      return true;
    });
  }

  cancelReminder(id: string, userId: string, guildId: string): boolean {
    const reminder = this.reminders.get(id);

    if (!reminder) {
      const partialMatch = Array.from(this.reminders.values()).find(
        (r) => r.id.startsWith(id) && r.guildId === guildId
      );
      if (partialMatch) {
        return this.cancelReminderById(partialMatch.id, userId, guildId);
      }
      return false;
    }

    return this.cancelReminderById(id, userId, guildId);
  }

  private cancelReminderById(id: string, userId: string, guildId: string): boolean {
    const reminder = this.reminders.get(id);

    if (!reminder || reminder.guildId !== guildId) {
      return false;
    }

    if (reminder.userId !== userId) {
      return false;
    }

    const job = this.jobs.get(id);
    if (job) {
      job.cancel();
      this.jobs.delete(id);
    }

    reminder.status = "cancelled";
    this.saveReminders();

    return true;
  }

  private scheduleReminder(reminder: Reminder): void {
    const scheduledTime = new Date(reminder.scheduledAt);
    const now = new Date();

    if (scheduledTime <= now) {
      this.sendReminder(reminder);
      return;
    }

    const job = schedule.scheduleJob(scheduledTime, () => {
      this.sendReminder(reminder);
    });

    if (job) {
      this.jobs.set(reminder.id, job);
      Logger.info(`리마인더 스케줄됨: ${reminder.id} - ${reminder.scheduledAt}`);
    } else {
      Logger.error(`리마인더 스케줄 실패: ${reminder.id}`);
    }
  }

  private async sendReminder(reminder: Reminder): Promise<void> {
    try {
      if (!this.client) {
        throw new Error("Discord 클라이언트가 설정되지 않았습니다.");
      }

      const channel = await this.client.channels.fetch(reminder.channelId);
      if (!channel || !(channel instanceof TextChannel)) {
        throw new Error("채널을 찾을 수 없거나 텍스트 채널이 아닙니다.");
      }

      const mentionText = reminder.mentions ? `${reminder.mentions}\n` : "";
      await channel.send(`${mentionText}**[리마인더]** ${reminder.message}`);

      reminder.status = "sent";
      this.saveReminders();
      this.jobs.delete(reminder.id);

      Logger.info(`리마인더 전송 완료: ${reminder.id}`);
    } catch (error) {
      Logger.error(`리마인더 전송 실패 (${reminder.id}):`, error);
    }
  }

  restoreReminders(): void {
    this.loadReminders();

    const now = new Date();
    const pendingReminders = Array.from(this.reminders.values()).filter(
      (r) => r.status === "pending"
    );

    Logger.info(`${pendingReminders.length}개의 pending 리마인더 복원 시작`);

    pendingReminders.forEach((reminder) => {
      const scheduledTime = new Date(reminder.scheduledAt);

      if (scheduledTime <= now) {
        Logger.info(`지연된 리마인더 즉시 실행: ${reminder.id}`);
        this.sendReminder(reminder);
      } else {
        this.scheduleReminder(reminder);
      }
    });

    Logger.info("리마인더 복원 완료");
  }

  static parseDateTime(dateTimeStr: string): Date | null {
    try {
      const regex = /^(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
      const match = dateTimeStr.trim().match(regex);

      if (!match) return null;

      const [, year, month, day, hours, minutes, period] = match;
      let hour = parseInt(hours, 10);

      if (period.toUpperCase() === "PM" && hour !== 12) {
        hour += 12;
      } else if (period.toUpperCase() === "AM" && hour === 12) {
        hour = 0;
      }

      const dateStr = `${year}-${month}-${day}T${hour.toString().padStart(2, "0")}:${minutes}:00+09:00`;
      const date = new Date(dateStr);

      if (isNaN(date.getTime())) return null;
      return date;
    } catch {
      return null;
    }
  }

  static formatDateTime(date: Date): string {
    const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    const year = kstDate.getUTCFullYear();
    const month = String(kstDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(kstDate.getUTCDate()).padStart(2, "0");
    let hours = kstDate.getUTCHours();
    const minutes = String(kstDate.getUTCMinutes()).padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";

    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;

    return `${year}-${month}-${day} ${hours}:${minutes} ${period} (KST)`;
  }
}

export default ReminderService;
