var crypto = require('crypto'); // cryptographic functionality (md5)
var through = require('through2'); // a thin wrapper around node transform streams
var gutil = require('gulp-util'); // utilities for gulp plugins
var path = require('path');
var fs = require('fs');
var PLUGIN_NAME = 'gulp-hash-file';

function calcMd5(data, length) {
    var cripter = crypto.createHash('md5');
    var md5 = cripter.update(data).digest('hex');
    return md5.slice(0, length);
}

module.exports = function (options) {

    var filesMd5 = {};

    options = Object.assign({
        hashLength: 32,
        fileName: '[name].[hash].[ext]',
        cacheFileName: false
    }, options);

    var stream = through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Stream not supported'));
            return cb(null, file);
        }

        var fileMd5 = calcMd5(file.contents, options.hashLength);
        filesMd5[file.relative] = fileMd5;

        if (options.fileName) {
            var fileInfo = path.parse(file.path);
            if (file.path[0] == '.') {
                dir = path.join(file.base, file.path);
            } else {
                dir = file.path;
            }
            dir = path.dirname(dir);
            file.path = path.join(dir, options.fileName.replace(/\[name\]/, fileInfo.name).replace(/\[hash\]/, fileMd5).replace(/\[ext\]/, fileInfo.ext.slice(1)));
        }
        cb(null, file);
    });
    stream.on('finish', () => {
        if (options.cacheFileName) {
            fs.writeFileSync(options.cacheFileName, JSON.stringify(filesMd5, null, 2));
        }
    });
    return stream;
};