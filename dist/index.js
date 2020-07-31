#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var path = require("path");
var program = require("commander");
var lodash_1 = require("lodash");
var project_1 = require("./project");
var scripts_1 = require("./scripts");
var config_1 = require("./config");
var serve_1 = require("./serve");
var deploy_1 = require("./deploy");
var utils_1 = require("./utils");
var pkg = require('../package.json');
var basename = path.basename(process.env._ || process.title.replace(/^(\S+)(\s\-\s)(\S+)$/, '$3'));
program.version(pkg.version);
program
    .name(/^(node|backpack)$/.test(basename) ? 'kenote' : basename)
    .usage('[command] [options]')
    .option('-p --port <port>', 'set http server port')
    .option('-t --tag <tag-name>', 'choose a script tag.');
program
    .command('create')
    .usage('<app-name>')
    .description('create a new project.')
    .action(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name;
    return __generator(this, function (_b) {
        _a = __read(program.args, 1), name = _a[0];
        project_1.createApp(name);
        return [2];
    });
}); });
program
    .command('config')
    .usage('[filename]')
    .description('get or set your configuration.')
    .action(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name;
    return __generator(this, function (_b) {
        _a = __read(program.args, 1), name = _a[0];
        config_1.default(name);
        return [2];
    });
}); });
program
    .command('script')
    .alias('run')
    .usage('[path] [options]')
    .option('-t --tag <tag-name>', 'choose a script tag.')
    .option('--makefile', 'use Makefile.')
    .description('run npm scripts of project.')
    .action(function () {
    var _a = __read(program.args, 1), name = _a[0];
    var makefile = utils_1.getArgs(program.commands, ['makefile']).makefile;
    scripts_1.default(name, program.tag, makefile);
});
program
    .command('serve')
    .alias('http')
    .usage('[path] [options]')
    .option('-p --port <port>', 'set http server port')
    .description('simple http service.')
    .action(function () {
    var _a = __read(program.args, 1), name = _a[0];
    serve_1.default(name, program.port);
});
program
    .command('deploy')
    .usage('[path] [options]')
    .option('--only-compress', 'only compress.')
    .option('--node-modules', 'contains the node_modules directory.')
    .description('Deploy your service to the server.')
    .action(function () {
    var _a = __read(program.args, 1), name = _a[0];
    var _b = utils_1.getArgs(program.commands, ['onlyCompress', 'nodeModules']), onlyCompress = _b.onlyCompress, nodeModules = _b.nodeModules;
    deploy_1.default(name, { onlyCompress: onlyCompress, nodeModules: nodeModules });
});
if (lodash_1.isEmpty(program.parse(process.argv).alias) && process.argv.length === 2) {
    program.help();
}
