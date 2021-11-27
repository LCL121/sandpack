import core from '../../src/core';
import fs from 'fs';
import path from 'path';

const index = fs.readFileSync(path.resolve(__dirname, './index.txt'), 'utf-8');
const utils = fs.readFileSync(path.resolve(__dirname, './utils.txt'), 'utf-8');

core({
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
    } else {
      return {
        code: '',
        id: ''
      };
    }
  }
});
