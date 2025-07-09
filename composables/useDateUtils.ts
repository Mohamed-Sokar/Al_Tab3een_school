export const useDateUtils = () => {
  const getArabicDayName = (date: string | Date): string => {
    return new Date(date).toLocaleDateString("ar-EG", {
      weekday: "long",
    });
  };

  const getDate = (date: string | Date): string => {
    if (typeof date === "string") {
      return new Date(date).toISOString().split("T")[0];
    }
    return date.toISOString().split("T")[0];
  };

  return { getArabicDayName, getDate };
};
