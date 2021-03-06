import { Dependency } from '../analysis/analysisNode';
import { isString } from './type';

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

export function getDependency(dependency: string | Dependency): string {
  if (isString(dependency)) {
    return dependency;
  } else {
    return dependency.value;
  }
}

export function addSemicolon(code: string): string {
  if (code.endsWith(';')) {
    return code;
  }
  return `${code};`;
}

/**
 * 拓扑排序
 * @param base 所有基本点
 * @param dependencies [被依赖, 受依赖]
 * @returns string[]
 */
export function topologicalSort<T>(base: T[], dependencies: [T, T][]) {
  const result: T[] = [];
  const baseLength = base.length;

  while (result.length < baseLength) {
    base
      .filter((value) => !dependencies.map(([a, b]) => b).includes(value))
      .map((value) => {
        result.push(value);
        base = base.filter((a) => a !== value);
        dependencies = dependencies.filter(([a, b]) => a !== value);
      });
  }

  return result;
}
