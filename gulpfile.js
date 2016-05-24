var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var config = require('./config.json');

gulp.task('build', function () {
    var myConf = config.task['build'];
    var bOpt = {
        paths: ['./src'],
        debug: true,
        insertGlobals: false,
        detectGlobals: false,
        entries: myConf.src,
        standalone: myConf.moduleName
    };

    var bundler = browserify(bOpt);
    var bundle = function () {
        bundler.bundle()
            .on('error', function (err) {
                if (err.stack) {
                    console.log(err.message);
                    console.log(err.stack);
                }
                else {
                    console.log(err);
                }
            })
            .pipe(source(myConf.dest.path))
            .pipe(gulp.dest(myConf.dest.file));
    };

    bundle();
});

gulp.task('default', ['build']);