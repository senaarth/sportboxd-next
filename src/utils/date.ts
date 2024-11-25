function formatDateLabel(date?: Date): string {
  if (!date) return "";

  const today = new Date();
  const yesterday = new Date();
  const tomorrow = new Date();
  yesterday.setDate(today.getDate() - 1);
  tomorrow.setDate(today.getDate() + 1);

  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) return "Hoje";
  if (date.getTime() === yesterday.getTime()) return "Ontem";
  if (date.getTime() === tomorrow.getTime()) return "Amanhã";

  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    ...(date.getFullYear === today.getFullYear ? {} : { year: "numeric" }),
  });
}

function getNextDay(date: Date): Date {
  return new Date(date.getTime() + 24 * 60 * 60 * 1000);
}

function getPreviousWeek(date: Date): Date {
  return new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
}

function getPreviousMonth(date: Date): Date {
  return new Date(date.getTime() - 30 * 24 * 60 * 60 * 1000);
}

export { formatDateLabel, getNextDay, getPreviousWeek, getPreviousMonth };
