export const useDateUtils = () => {
  const getArabicDayName = (date: string | Date): string => {
    return new Date(date).toLocaleDateString("ar-EG", {
      weekday: "long",
    });
  };

  return { getArabicDayName };
};
