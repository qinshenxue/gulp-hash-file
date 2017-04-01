var gulp = require('gulp');
var hashfile = require('./index.js');


// Generate example.css.md5 (from "md5" value in example.json)
gulp.task('default', function () {
   gulp.src('./example/index.js')
    .pipe(hashfile())
    .pipe(gulp.dest('./example1/'));
});