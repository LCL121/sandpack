const path = require('path');
const rimraf = require('rimraf');
const execa = require('execa');
const gulp = require('gulp');
const header = require('gulp-header');
const pkg = require('../package.json');

rimraf.sync(path.resolve(__dirname, '../dist'));

execa('rollup', ['-c'], {
  stdio: 'inherit'
}).then(() => {
  rimraf.sync(path.resolve(__dirname, '../dist/scripts'));
  rimraf.sync(path.resolve(__dirname, '../dist/src'));
  rimraf.sync(path.resolve(__dirname, '../dist/test'));
  rimraf.sync(path.resolve(__dirname, '../dist/rollup.config.d.ts'));

  gulp
    .src('dist/sandpack.esm.min.js')
    .pipe(
      header(
        `/*!
 * simpleCodeEditor v${pkg.version}
 * (c) 2021 ${pkg.author.name}
 * Released under the ${pkg.license} License.
 */
`.trim()
      )
    )
    .pipe(gulp.dest('./dist/'));
});
