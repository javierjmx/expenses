const gulp = require('gulp');
const eslint = require('gulp-eslint');
const cache = require('gulp-cached');
const path = require('path');
const rename = require('gulp-rename');
const chmod = require('gulp-chmod');
const fs = require('fs');
const bluebird = require('bluebird');
const gulpif = require('gulp-if');
const args = require('yargs').argv;

const fileExists = fileName => {
  const promiseFStat = bluebird.promisify(fs.stat);
  return promiseFStat(fileName);
};

gulp.task('lint', ['enforce-quality'], () =>
  gulp.src(['index.js', 'server/**/*.js', '!node_modules/**'])
    .pipe(cache('eslint'))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.result(result => {
      if (result.warningCount > 0 || result.errorCount > 0) {
        delete cache.caches.eslint[path.resolve(result.filePath)];
      }
    }))
    .pipe(gulpif(!args.cont, eslint.failAfterError()))
);

gulp.task('lint-watch', ['lint'], () =>
  gulp.watch(['server/**/*.js', 'index.js'], ['lint'], event => {
    if (event.type === 'deleted' && cache.caches.eslint) {
      delete cache.caches.eslint[event.path];
    }
  })
);

gulp.task('enforce-quality', () =>
  fileExists('.git/hooks/pre-push').then(fsStatData =>
    console.log('Pre-Push Hook Already Exists')
  ).catch(fsError =>
    gulp.src('misc/pre-push-hook.sh')
      .pipe(rename('/hooks/pre-push'))
      .pipe(chmod(755))
      .pipe(gulp.dest('.git'))
  )
);
