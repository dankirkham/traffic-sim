var gulp = require('gulp');
var tsc = require('gulp-tsc');
var webpack = require('webpack-stream');
var htmlmin = require('gulp-htmlmin');
var pump = require('pump');

gulp.task('default', ['build']);

gulp.task('build', ['build-js', 'minify-html', 'build-testing']);

gulp.task('build-js', function (cb) {
  pump([
    gulp.src('src/*.ts'),
    webpack(require('./webpack.config.js')),
    gulp.dest('./')
  ], cb);
});

gulp.task('minify-html', function (cb) {
  pump([
    gulp.src('src/*.html'),
    htmlmin({ collapseWhitespace: true }),
    gulp.dest('dist/')
  ], cb);
});

gulp.task('build-testing', function(){
  gulp.src(['src/**/*.ts'])
    .pipe(tsc({module:'amd'}))
    .pipe(gulp.dest('build_test/'))
});
