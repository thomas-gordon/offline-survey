var browserify = require('browserify'),
    path = require('path'),
    pick = require('util-mix'),
    factor = require('factor-bundle'),
    merge = require('merge-stream'),
    watchify = require('watchify'),
    buffer = require('vinyl-buffer'),
    eos = require('end-of-stream'),
    source = require('vinyl-source-stream'),
    through = require('through'),
    through2 = require('through2'),
    gulpFilter = require('gulp-filter'),
    cached = require('gulp-cached'),
    util = require('gulp-util');

module.exports = function (gulp, onError, build, browserSync) {

    return function (cb) {

        var js_path =  './design/js/';
        var bundleStream;

        var noop = function () {};
         var entries = [
            js_path + 'App.js'

        ];
        var factorBundleOpts = {
            entries: entries,
            outputs: [
                'App.js'
            ],
            common: 'bundle.js',
            threshold: 1
        };

        var b = browserify({
            entries: entries,
            debug: !build,

            //required for watchify
            cache: {},
            //required for watchify
            packageCache: {}

        })
        .plugin(
            factor,
            pick(
                ['outputs', 'entries', 'threshold', 'basedir'],
                factorBundleOpts,
                {
                    outputs: function () {
                        return factorBundleOpts.outputs.map(function (o) {
                            var s = source(o);
                            bundleStream.add(s);
                            return s;
                        });
                    }
                }
            )
        )
        .on('log', util.log);

        /*
        * If we aren't building, enable watchify for faster builds of 'only changed' code,
        * as a full browserify build taks about 10 seconds.
        * */
        if (!build) {
            b = watchify(b, {poll: true})
            .on('update', function () {
                bundle();
            });
        }

        var factorBundleOutput = function (bundleStream) {

            browserSync.notify('Building bundle');

            var filter = gulpFilter([factorBundleOpts.common], {restore: true});

            return bundleStream
                .on('error', onError)
                .pipe(build ? buffer() : through())
                .pipe(gulp.dest('build/js'))
                .pipe(filter)
                .pipe(build ? through() : browserSync.reload({stream:true}))
                .pipe(filter.restore)
        };

        function bundle(cb) {

            var lintStream = function () {
                return gulp.src('build/js/*.js')
                    .pipe(cached('lint-cache'))
                    .pipe(eslint())
                    .pipe(eslint.format()).on('error', onError)
            };

            //lintStream();

            var common = b
                .bundle()
                .on('error', function (err) {
                    bundleStream.emit('error', err);
                })
                .pipe(source(factorBundleOpts.common || 'common.js'));

            bundleStream = merge(common)
                .on('error', function (err) {
                    delete err.stream;
                });

            var stream = bundleStream;

            if (typeof factorBundleOutput === 'function') {
                stream = factorBundleOutput(bundleStream);
            }

            eos(stream, cb || noop);
        }

        return bundle(cb);

    }
};
