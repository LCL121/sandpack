export function extractEnumValueToArray<T extends Object>(e: T) {
  const result = [];
  for (const key in e) {
    result.push(e[key]);
  }
  return result;
}