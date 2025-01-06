const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export const digitsToPersian = (number: string) => {
  return number.replace(/[0-9]/g, function (w) {
    return persianNumbers[+w];
  });
};
