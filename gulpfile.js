var Gulp = require('gulp'),
    RequireDir = require('require-dir'),
    tasks = RequireDir('./gulp/tasks'); // pull in all our tasks

Gulp.task('default', ['js:prod', 'js:dev', 'styles:prod', 'styles:dev']);
Gulp.task('dev', ['js:dev', 'styles:dev']);
Gulp.task('watch', ['serve']);
