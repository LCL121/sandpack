import { add } from './utils';
import { con } from './constant';

let e = con;

e += 100;

function add_add(a, b) {
  return add(add(a, e), add(a, b));
}

add_add(1, 2) + e;
