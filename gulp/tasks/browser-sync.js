var Gulp = require('gulp'),
    BrowserSync = require('browser-sync');

/*
    Browser sync
    ------------
    1. Proxy the dev url
    2. Hide the browser sync notification on the front end
*/
Gulp.task('serve', function() {
    BrowserSync({
        server: './',
        notify: false /* 2 */
    });

    Gulp.watch('./source/sass/**/*.scss', ['styles:dev']);
    Gulp.watch('./source/js/**/*.js', ['js:dev']);
    Gulp.watch('./dest/js/**/*.js', BrowserSync.reload);
    Gulp.watch('./index.html', BrowserSync.reload)
});