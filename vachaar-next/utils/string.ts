const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export const digitsToPersian = (number: string) => {
  return number.replace(/[0-9]/g, function (w) {
    return persianNumbers[+w];
  });
};

export function digitsToMoney(value: string): string {
  const v = value.replace(/,/g, "");
  if (!v) return "";
  if (v.length < 3) return v;
  return v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}
