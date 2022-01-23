import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';

const umdConfig = {
  input: './src/core/index.ts',
  output: {
    name: 'sandpack',
    sourcemap: true,
    file: './dist/sandpack.esm.min.js',
    format: 'es'
  },
  plugins: [
    json(),
    resolve(),
    commonjs(),
    typescript(),
    babel({ babelHelpers: 'bundled', exclude: 'node_modules/**' }),
    terser({ compress: { drop_console: true, drop_debugger: true }, output: { comments: false } })
  ]
};

const dtsConfig = {
  input: './dist/src/core/index.d.ts',
  output: [{ file: './dist/sandpack.d.ts', format: 'es' }],
  plugins: [dts()]
};

export default [umdConfig, dtsConfig];
