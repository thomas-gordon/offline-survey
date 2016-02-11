var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var gulpIf = require('gulp-if');
var sass = require('gulp-sass');
var expect = require('gulp-expect-file');

module.exports = function (gulp, onError, build, browserSync) {
    return function () {

        return gulp.src('design/scss/style.scss')
            .pipe(expect('design/scss/style.scss'))
            // sourcemaps + sass + error handling
            .pipe(gulpIf(!build, sourcemaps.init()))
            .pipe(sass({
                sourceComments: !build,
                outputStyle: build ? 'compressed' : 'nested'
            }))
            .on('error', onError)

            // generate .maps
            .pipe(gulpIf(!build, sourcemaps.write({
                'includeContent': false,
                'sourceRoot': '.'
            })))

            // autoprefixer
            .pipe(gulpIf(!build, sourcemaps.init({
                'loadMaps': true
            })))

            .pipe(postcss(
              [
                autoprefixer(
                  {browsers: ['last 2 versions']}
                )
              ]))

            .pipe(sourcemaps.write({
                'includeContent': true
            }))
            .pipe(gulp.dest('build/css'))
            .pipe(expect('build/css/style.css'))
            .pipe(gulpIf(!build, browserSync.stream()));
    }
}
