export function merge<T extends Object>(...objs: T[]): T {
  const result: T = Object.create(null);
  for (const obj of objs) {
    for (const key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}