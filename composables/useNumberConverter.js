// utils/numberConverter.js
// convertArabicToEnglishNumbers
export function useNumberConverter() {
  const arabicToEnglishMap = {
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٧": "7",
    "٨": "8",
    "٩": "9",
  };
  const convertArabicToEnglishNumbers = (input) => {
    return input.replace(/[٠-٩]/g, (char) => arabicToEnglishMap[char] || char);
  };

  return { convertArabicToEnglishNumbers };
}
