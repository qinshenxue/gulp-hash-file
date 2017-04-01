var gulp = require('gulp');
var hashfile = require('./index.js');


// Generate example.css.md5 (from "md5" value in example.json)
gulp.task('default', function () {
    gulp.src('./example/index.js')
        .pipe(hashfile({
            hashLength: 8,
            cacheFileName:'./example/hash.json'
        }))
        .pipe(gulp.dest('example'));
});