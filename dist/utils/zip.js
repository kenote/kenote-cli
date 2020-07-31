"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zip = void 0;
var fs = require("fs-extra");
var archiver = require("archiver");
function zip(file, patterns, globOptions, append, format) {
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
        var e_1, _a;
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
        patterns.map(function (pattern) {
            archive.glob(pattern, globOptions);
        });
        try {
            for (var append_1 = __values(append), append_1_1 = append_1.next(); !append_1_1.done; append_1_1 = append_1.next()) {
                var item = append_1_1.value;
                var _b = __read(item, 2), source = _b[0], target = _b[1];
                archive.directory(source, target);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (append_1_1 && !append_1_1.done && (_a = append_1.return)) _a.call(append_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        archive.finalize();
    });
}
exports.zip = zip;
