// import
import a from 'a.js';
import { b } from 'b.js';
import c, { c as cc } from 'c.js';
import * as d from 'd.js';

// function
const f1 = (a, cccc, b = a + cccc) => {
  ccc = cccc;
  const aaaa = '';
  aaaa = ccccc;

  function ff6() {
    a;
    aa2;
  }

  {
    aa1;
  }
};
const f2 = async () => {};
const f3 = function (a, cccc, b = a + cccc) {
  ccc = cccc;
  const aaaa = '';
  aaaa = ccccc;

  function ff6() {
    a;
    aa2;
  }

  {
    aa1;
  }
};
const f4 = function* () {
  yield a;
};
const f5 = async function () {};
function f6(a, cccc, b = a + cccc) {
  ccc = cccc;
  const aaaa = '';
  aaaa = ccccc;

  function ff6() {
    a;
    aa2;
  }

  {
    aa1;
  }
}
function* f7() {}
async function f8() {}

function foo() {
  {
    const a = `call string${c}`;
  }

  for (let i = 0; i < a.length; i++) {
    i;
  }

  eval('console.log(a)');

  return {
    a
  };
}

// const
const [a1, b1, ...rest] = [1, 2, '', a, 1 + 1];
const { a: aa, b: bb } = b;
const { y: yy } = { y: yyy, a: aaa };

// expression
b[a] = '';

let r1 = 10;

r1 += 10;

+r2;
++r3;
r4++;

r5 + 10;

r6 = r6 + 10;

r7 || r8;

r9[rr];

[r10 + r11].rr;

1 + 1;

r12 = r13 ? r14 : r15;

rr1(rr2, rr3);

new A(rr4);

A.a();

A.b();

rr5[rr6];

rr7[1], rr8[1], rr9[1];

rr7[1], rr8[1], rr9[1];

a.a.a.a;

aa?.a.a?.a;

import('acorn').then(() => {});

import(rr10).then(() => {});

import(rr11).then(rr12).then(rr13);

// class
class A extends AA {
  // #a;
  // #b = a;
  // static b = 1;
  // c = 2;

  constructor() {
    this.aa = 1;
  }

  [a + b]() {}

  static getAA() {
    return this.aa;
  }

  get a() {
    return {
      a: cla
    };
  }

  set a(b) {
    this.aa = b;
    clb;
  }

  async getA() {
    clc;
    return this.aa;
  }

  *getAA() {
    yield a;
  }
}

// statement
{
  const aa = ccc;
  b = '';
}
{
  const aaa = '';
  aaa = '';
  aaa;
  c;
}

debugger;

loop1: for (let i = 0; i < 5; i++) {
  if (i === 1) {
    continue loop1;
  } else {
    break loop1;
  }
  str = str + i;
}

if (ia1) {
  ia2;
} else if (ia3) {
  ia4;
} else {
  ia5;
}

throw Error();

switch (sa1) {
  case sa2: {
    saa1;
    saa2;
  }
  case sa3: {
    saa3;
  }
  case sa4:
    saa4;
    break;
}

while (wa1) {
  wa2--;
}

try {
  ta1;
} catch (ta2) {
  ta2;
  ta3;
} finally {
  ta4;
}

do {
  da1;
} while (da2);

for (let fa1 = 1; fa1 < 10; fa1++) {
  fa1;
  fa2;
}

for (const fo1 of fo1) {
  fo1;
  fo2;
}

for ({ fo2: fo3 } of fo1) {
  fo1;
  fo2;
  fo3;
}

for (const fi1 in fi1) {
  fi1;
  fi2;
}

for ([fi3] in fi1) {
  fi1;
  fi2;
  fi3;
}

// export
export * as aaa from 'd.js';
export * from 'd.js';
export * from 'e.js';
export default [a, b];
export const e = 1 * 2;
export function ff() {}

export const [t1, t2, ...tt3] = [1, 2];

export const {
  tt: { ttt: tttt }
} = {};

export var t3, t4;
export { a, a as aa };
export { e as ee } from 'e.js';
