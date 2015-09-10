var Gulp = require('gulp'),
    Sass = require('gulp-sass'),
    Postcss = require('gulp-postcss'),
    Autoprefixer = require('autoprefixer-core'),
    BrowserSync = require('browser-sync'),
    Rename = require("gulp-rename");

var cssCompile = function(devMode) {
    var outputStyle,
        fileSuffix = '';

    var processors = [
        Autoprefixer({browsers: ['last 2 versions', '> 1%', 'ie 8']}),
    ];

    if (devMode) {
        outputStyle = 'expanded';
    } else {
        outputStyle = 'compressed';
        fileSuffix = '.min';
    }

    /*
        Styles
        ------
        1. use .scss files
        2. run sass on them
        3. Pass the output to postcss
        4. Add .min suffix if in prod mode
        5. Write css to disk
        6. Pass css to browsersync
    */
    return Gulp.src('./source/sass/**/*.scss') /* 1*/
        .pipe(Sass({
            outputStyle: outputStyle
        }).on('error', function(error) {
            // swallow error so watch can continue running
            console.log(error.toString());
            this.emit('end');
        })) /* 2 */
        .pipe(Postcss(processors)) /* 3 */
        .pipe(Rename({suffix: fileSuffix})) /* 4 */
        .pipe(Gulp.dest('./dest/css/')) /* 5 */
        .pipe(BrowserSync.stream()); /* 6 */
};

Gulp.task('styles:prod', function() {
    return cssCompile();
});

Gulp.task('styles:dev', function() {
    return cssCompile(true);
});
