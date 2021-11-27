import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const umdConfig = {
  input: './src/analysis/index.ts',
  output: {
    name: 'analysis',
    sourcemap: true,
    file: './dist/analysis.js',
    format: 'umd'
  },
  plugins: [json(), resolve(), commonjs(), typescript(), babel({ babelHelpers: 'bundled', exclude: 'node_modules/**' })]
};

export default [umdConfig];
