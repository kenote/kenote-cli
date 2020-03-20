"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var archiver = require("archiver");
function zip(file, patterns, globOptions, format) {
    if (format === void 0) { format = 'tar'; }
    var options = format === 'zip' ?
        {
            zlib: {
                level: 9
            }
        } : {
        gzip: true,
        gzipOptions: {
            level: 9
        }
    };
    return new Promise(function (resolve, reject) {
        var archive = archiver(format, options);
        var output = fs.createWriteStream(file);
        output.on('close', function () {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
        });
        output.on('end', function () {
            console.log('Data has been drained');
        });
        archive.on('warning', function (err) {
            if (err.code === 'ENOENT') {
            }
            else {
                reject(err);
            }
        });
        archive.on('error', function (err) {
            reject(err);
        });
        archive.on('end', function () {
            var archiveSize = archive.pointer();
            resolve(archiveSize);
        });
        archive.pipe(output);
        archive.glob(patterns, globOptions);
        archive.finalize();
    });
}
exports.zip = zip;
