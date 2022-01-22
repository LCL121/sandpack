import { add_e1 } from './utils';
import { con } from './constant';

let e = con;

e += 100;

function add_add(a, b) {
  return add_e1(add_e1(a, e), add_e1(a, b));
}

add_add(1, 2) + e;
