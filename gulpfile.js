'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var util = require('gulp-util');
var gulpIf = require('gulp-if');
var argv = require('yargs').argv;
var server = require('gulp-express');
var build = process.argv.indexOf('build') !== -1 || util.env.type === 'deploy';

// ----------------------------
// Error notification methods
// ----------------------------
var onError = function (err) {
    util.beep();
    console.log(util.colors.red(err));
    this.emit('end');
};

function getTask(task) {
    return require('./gulp/' + task)(gulp, onError, build, browserSync);
}

gulp.task('browserify', getTask('browserify'));
gulp.task('scss', getTask('scss'));
gulp.task('copy', getTask('copy'));

gulp.task('browser-sync', ['server'], function () {
    browserSync.init({
        proxy: 'http://localhost:3000',
        port: 9010
    });
});

gulp.task('build', ['browser-sync'], function (callback) {
    runSequence('browserify', callback)
});

gulp.task('reload_template', ['index'], function () {
    browserSync.reload();
})

gulp.task('index', function () {
    return gulp.src(['./*.html'], {base: './'})
        .pipe(gulp.dest('build'))

});

gulp.task('watch', ['browser-sync'], function () {
    gulp.watch([
        'design/scss/*.scss'
    ], ['scss']);
    gulp.watch([
        './**.html'
    ], ['reload_template']);
});

gulp.task('server', function () {
    // Start the server at the beginning of the task
    server.run(['server/app.js']);
});

gulp.task('default', function (callback) {
    runSequence(
        'index',
        'copy',
        'scss',
        [
            'browserify',
            'browser-sync',
            'watch',
            'server'
        ],
        callback
    )
});

gulp.task('build', function () {
    runSequence(
        'index',
        'copy',
        'scss',
        'browserify',
        callback
    )
});
