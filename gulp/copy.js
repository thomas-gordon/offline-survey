var merge = require('merge-stream');

module.exports = function (gulp, onError, build, browserSync) {
    return function () {
        var audio = gulp.src(['design/audio/**/*'],  {base: 'design'})
            .pipe(gulp.dest('build'));
        var images = gulp.src(['design/images/**/*'],   {base: 'design'})
            .pipe(gulp.dest('build'));

        return merge(audio, images);
    }
}
