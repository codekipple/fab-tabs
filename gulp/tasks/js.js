var Gulp  = require('gulp'),
    Uglify = require('gulp-uglify'),
    Rename = require("gulp-rename");

var jsCompile = function(devMode) {
    var src = './source/js/*.js';
    var dest = './dest/js/';

    if (devMode) {
        return Gulp.src(src)
            .pipe(Gulp.dest(dest));
    } else {
        return Gulp.src(src)
            .pipe(Uglify())
            .pipe(Rename({suffix: '.min'}))
            .pipe(Gulp.dest(dest));
    }
};

Gulp.task('js:prod', function() {
    return jsCompile();
});

Gulp.task('js:dev', function() {
    return jsCompile(true);
});