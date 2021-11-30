export function create62(num: number) {
  // 0-9 a-z A-Z
  /**
   * 0: 48; 9: 57
   * a: 97; z: 122
   * A: 65; Z: 90
   */
  const base = 62;
  const chars = [
    { start: 48, numbers: 10 },
    { start: 97, numbers: 26 },
    { start: 65, numbers: 26 }
  ];
  let result = '';
  while (num > 0) {
    let remainder = num % base;
    num = (num / base) | 0;
    for (const { start, numbers } of chars) {
      if (remainder < numbers) {
        result = String.fromCharCode(remainder + start) + result;
        break;
      }
      remainder -= numbers;
    }
  }
  return result;
}
