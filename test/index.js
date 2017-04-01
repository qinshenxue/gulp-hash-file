var assert = require('assert');
var vinyl = require('vinyl');
var path = require('path');
var hashFile = require('../');


describe('gulp-hash-file', function () {

    it('filename shuld with md5 hash', function (done) {
        var fakeFile = new vinyl({
            path: path.resolve(__dirname, 'a.js'),
            contents: new Buffer('abufferwiththiscontent')
        });

        var stream = hashFile(fakeFile);
        stream.write(fakeFile);

        stream.once('data', function (file) {
            assert(file.isBuffer());
            assert.equal(file.path, path.resolve(__dirname, 'a.2f280040e4a5f6d73fc38d6dd48dbb50.js'))
            done();
        });

    });
});