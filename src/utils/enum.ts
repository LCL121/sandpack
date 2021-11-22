export function extractEnumValueToArray<T extends {}>(e: T) {
  const result = [];
  for (const key in e) {
    result.push(e[key]);
  }
  return result;
}
