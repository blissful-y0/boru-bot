export interface Reminder {
  id: string;
  guildId: string;
  channelId: string;
  userId: string;
  message: string;
  mentions: string;
  scheduledAt: string;
  createdAt: string;
  status: "pending" | "sent" | "cancelled";
}

export interface ReminderData {
  reminders: Reminder[];
  lastUpdated: string;
}
