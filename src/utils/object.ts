export function merge<T extends { [key: string]: any }>(isMergeObj: boolean, ...objs: T[]): T {
  const result: T = Object.create(null);
  for (const obj of objs) {
    for (const key in obj) {
      if (isMergeObj && key in result) {
        if (Array.isArray(result[key])) {
          const tmp1 = result[key] as any as any[];
          const tmp2 = obj[key] as any as any[];
          result[key] = [...tmp1 , ...tmp2] as any;
        } else {
          result[key] = merge(false, result[key], obj[key]);
        }
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}