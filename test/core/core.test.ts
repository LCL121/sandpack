import core from '../../src/core';
import fs from 'fs';
import path from 'path';

const index = fs.readFileSync(path.resolve(__dirname, './index.js'), 'utf-8');
const utils = fs.readFileSync(path.resolve(__dirname, './utils.js'), 'utf-8');

const code = core({
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

fs.writeFileSync(path.resolve(__dirname, './result.js'), code);
