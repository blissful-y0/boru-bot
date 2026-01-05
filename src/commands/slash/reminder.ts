import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from "discord.js";
import GoogleSheetsService from "../../services/googleSheetsService";
import ReminderService from "../../services/reminderService";
import Logger from "../../utils/logger";

export const data = new SlashCommandBuilder()
  .setName("리마인더")
  .setDescription("리마인더를 관리합니다")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("생성")
      .setDescription("새 리마인더를 생성합니다")
      .addStringOption((option) =>
        option
          .setName("시간")
          .setDescription("예약 시간 (예: 2024-12-25 09:00 AM)")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("메시지")
          .setDescription("리마인드 메시지 내용")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("멘션")
          .setDescription("멘션 대상 (@everyone, @here, @사용자, @역할)")
          .setRequired(false)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("목록")
      .setDescription("예약된 리마인더 목록을 조회합니다")
      .addBooleanOption((option) =>
        option
          .setName("전체")
          .setDescription("서버 전체 리마인더 보기 (관리자 전용)")
          .setRequired(false)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("취소")
      .setDescription("리마인더를 취소합니다")
      .addStringOption((option) =>
        option
          .setName("id")
          .setDescription("취소할 리마인더 ID")
          .setRequired(true)
      )
  );

async function handleCreate(
  interaction: ChatInputCommandInteraction,
  reminderService: ReminderService
): Promise<void> {
  const timeStr = interaction.options.getString("시간", true);
  const message = interaction.options.getString("메시지", true);
  const mentions = interaction.options.getString("멘션") || "";

  const scheduledAt = ReminderService.parseDateTime(timeStr);
  if (!scheduledAt) {
    await interaction.editReply({
      content:
        "시간 형식이 올바르지 않습니다.\n예시: `2024-12-25 09:00 AM`\n형식: `YYYY-MM-DD HH:MM AM/PM` (KST 기준)",
    });
    return;
  }

  if (scheduledAt.getTime() <= Date.now()) {
    await interaction.editReply({
      content: "과거 시간은 예약할 수 없습니다. 미래 시간을 입력해주세요.",
    });
    return;
  }

  const reminder = reminderService.createReminder({
    guildId: interaction.guildId!,
    channelId: interaction.channelId,
    userId: interaction.user.id,
    message,
    mentions,
    scheduledAt: scheduledAt.toISOString(),
  });

  await interaction.editReply({
    content: `리마인더가 생성되었습니다!\n\n**ID:** \`${reminder.id.slice(0, 8)}...\`\n**채널:** <#${interaction.channelId}>\n**시간:** ${ReminderService.formatDateTime(scheduledAt)}\n**메시지:** ${message}${mentions ? `\n**멘션:** ${mentions}` : ""}`,
  });
}

async function handleList(
  interaction: ChatInputCommandInteraction,
  reminderService: ReminderService
): Promise<void> {
  const showAll = interaction.options.getBoolean("전체") || false;
  const userId = showAll ? undefined : interaction.user.id;

  if (
    showAll &&
    !interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)
  ) {
    await interaction.editReply({
      content: "전체 리마인더 조회는 관리자만 가능합니다.",
    });
    return;
  }

  const reminders = reminderService.getReminders(interaction.guildId!, userId);
  const pendingReminders = reminders.filter((r) => r.status === "pending");

  if (pendingReminders.length === 0) {
    await interaction.editReply({
      content: "예약된 리마인더가 없습니다.",
    });
    return;
  }

  const list = pendingReminders
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    )
    .map((r, i) => {
      const date = new Date(r.scheduledAt);
      const truncatedMessage =
        r.message.length > 50 ? r.message.slice(0, 50) + "..." : r.message;
      const ownerInfo = showAll ? `\n   등록자: <@${r.userId}>` : "";
      return `**${i + 1}.** ID: \`${r.id.slice(0, 8)}...\`\n   채널: <#${r.channelId}>\n   시간: ${ReminderService.formatDateTime(date)}${ownerInfo}\n   메시지: ${truncatedMessage}`;
    })
    .join("\n\n");

  const listTitle = showAll ? "서버 전체 리마인더 목록" : "내 리마인더 목록";
  await interaction.editReply({
    content: `**${listTitle}** (${pendingReminders.length}개)\n\n${list}`,
  });
}

async function handleCancel(
  interaction: ChatInputCommandInteraction,
  reminderService: ReminderService
): Promise<void> {
  const id = interaction.options.getString("id", true);

  const success = reminderService.cancelReminder(
    id,
    interaction.user.id,
    interaction.guildId!
  );

  if (success) {
    await interaction.editReply({
      content: `리마인더가 취소되었습니다. (ID: \`${id}\`)`,
    });
  } else {
    await interaction.editReply({
      content:
        "리마인더를 찾을 수 없거나 취소 권한이 없습니다.\n본인이 생성한 리마인더만 취소할 수 있습니다.",
    });
  }
}

const reminderCommand = {
  name: "리마인더",
  description: "리마인더를 관리합니다",

  async execute(
    interaction: ChatInputCommandInteraction,
    _sheetsService?: GoogleSheetsService,
    reminderService?: ReminderService
  ): Promise<void> {
    if (!reminderService) {
      await interaction.reply({
        content: "리마인더 서비스가 초기화되지 않았습니다.",
        ephemeral: true,
      });
      return;
    }
    const subcommand = interaction.options.getSubcommand();

    try {
      await interaction.deferReply({ ephemeral: true });

      switch (subcommand) {
        case "생성":
          await handleCreate(interaction, reminderService);
          break;
        case "목록":
          await handleList(interaction, reminderService);
          break;
        case "취소":
          await handleCancel(interaction, reminderService);
          break;
        default:
          await interaction.editReply({
            content: "알 수 없는 서브커맨드입니다.",
          });
      }
    } catch (error) {
      Logger.error(`리마인더 명령어 실행 오류:`, error);

      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({
          content: "리마인더 처리 중 오류가 발생했습니다.",
        });
      } else {
        await interaction.reply({
          content: "리마인더 처리 중 오류가 발생했습니다.",
          ephemeral: true,
        });
      }
    }
  },
};

export default reminderCommand;
