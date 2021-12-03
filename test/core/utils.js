import { con } from './constant';

let e1 = con;

e1 += 100;

export function add(a, b) {
  return a + b + e1;
}
