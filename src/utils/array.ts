export function arrayPush<T>(b: T, a?: T[]): T[] {
  const result: T[] = [];
  if (a === undefined) {
    result.push(b);
  } else {
    result.push(...a, b);
  }
  return result;
}

export function isEmptyArray(arr: unknown[]): boolean {
  return arr.length === 0;
}
