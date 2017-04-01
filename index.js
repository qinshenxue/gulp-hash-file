var crypto = require('crypto'); // cryptographic functionality (md5)
var through = require('through2'); // a thin wrapper around node transform streams
var gutil = require('gulp-util'); // utilities for gulp plugins
var path = require('path');
const PLUGIN_NAME = 'gulp-hash-file';

// Calculate m5d hash
function calcMd5(data) {
    var cripter = crypto.createHash('md5');
    var md5 = cripter.update(data).digest('hex');

    return md5;
}

// Plugin level function (dealing with files)
module.exports = function () {
    // Creating a stream through which each file will pass

    var filesMd5 = {};

    const stream = through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Stream not supported'));
            return cb(null, file);
        }

        filesMd5[file.relative] = calcMd5(file.contents);
        //var data = '{"md5":"' + calcMd5(file.contents) + '","value":' + stringifiedFile + '}';

        /* file.contents = new Buffer(data);
         if (file.path) {
             file.path = gutil.replaceExtension(file.path, '.json');
         }*/

        var fileInfo = path.parse(file.path);

        if (file.path[0] == '.') {
            dir = path.join(file.base, file.path);
        } else {
            dir = file.path;
        }
        dir = path.dirname(dir);

        //console.dir(fileInfo);

        file.path = path.join(dir, fileInfo.name + '.' + filesMd5[file.relative] + fileInfo.ext);
        //  this.push(file);

        cb(null, file);
    });
    stream.on('finish', () => {
        //fs.writeFileSync(cacheName, JSON.stringify(cache, null, 2));
    });
    return stream;
};