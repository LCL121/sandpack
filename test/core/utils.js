import { con } from './constant';
import add from './add';

let e1 = con;

e1 += 100;

export function add_e1(a, b) {
  return add(a, b) + e1;
}
