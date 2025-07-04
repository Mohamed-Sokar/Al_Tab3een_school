const useDateUtils = () => {
  const getArabicDayName = (date) => {
    return new Date(date).toLocaleDateString("ar-EG", {
      weekday: "long"
    });
  };
  return { getArabicDayName };
};

export { useDateUtils as u };
//# sourceMappingURL=useDateUtils-BpWrcJKf.mjs.map
