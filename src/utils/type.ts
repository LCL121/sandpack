export function isString(a: unknown): a is string {
  return typeof a === 'string';
}

export function isNumber(a: unknown): a is number {
  return typeof a === 'number';
}
