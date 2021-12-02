import { add } from './utils';

let e = 100;

e += 100;

function add_add(a, b) {
  return add(add(a, e), add(a, b));
}

add_add(1, 2) + e;
