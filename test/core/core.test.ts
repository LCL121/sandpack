import core from '../../src/core';
import fs from 'fs';
import path from 'path';

const index = fs.readFileSync(path.resolve(__dirname, './index.js'), 'utf-8');
const utils = fs.readFileSync(path.resolve(__dirname, './utils.js'), 'utf-8');
let constant = fs.readFileSync(path.resolve(__dirname, './constant.js'), 'utf-8');

const sandpack = core({
  entry: './index',
  path: {
    vue: 'http:vue.js'
  },
  loadFunction(filename) {
    if (filename === './index') {
      return {
        code: index,
        id: 'a'
      };
    } else if (filename === './utils') {
      return {
        code: utils,
        id: 'b'
      };
    } else if (filename === './constant') {
      return {
        code: constant,
        id: 'c'
      }
    } else {
      return {
        code: '',
        id: ''
      };
    }
  }
});

fs.writeFileSync(path.resolve(__dirname, './result1.js'), sandpack.code());

constant = fs.readFileSync(path.resolve(__dirname, './constant2.js'), 'utf-8');

sandpack.resetFile('./constant');

fs.writeFileSync(path.resolve(__dirname, './result2.js'), sandpack.code());
