import type { Student } from "~/types";

export const toDate = (date: string | Date): string => {
  if (typeof date === "string") {
    return new Date(date).toISOString().split("T")[0];
  }
  return date.toISOString().split("T")[0];
};

export const getMonthAchievedPages = (
  month: string,
  student?: Student
): number => {
  return (
    student?.quran_achievement_reports?.find((p) => p.month === month)
      ?.achieved_pages ?? 0
  );
};

export const isPlanAchieved = (required: number, achieved: number): boolean => {
  return achieved >= required;
};

export const getAchievementColor = (
  month: string,
  planPages: number,
  student?: Student
) => {
  const achievedPages = getMonthAchievedPages(month, student);
  return isPlanAchieved(planPages, achievedPages) ? "success" : "error";
};
