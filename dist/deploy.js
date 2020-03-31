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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs-extra");
var glob = require("glob");
var async = require("async");
var dayjs = require("dayjs");
var runscript = require("runscript");
var inquirer = require("inquirer");
var chalk = require("chalk");
var ftp_1 = require("./utils/ftp");
var sftp_1 = require("./utils/sftp");
var ssh_1 = require("./utils/ssh");
var utils_1 = require("./utils");
var zip_1 = require("./utils/zip");
exports.default = (function (name) { return __awaiter(void 0, void 0, void 0, function () {
    var projects, project, selector_1, _a, rootDir, ignore, rules, type, connect, deployTo, beforeScripts, remoteCommand, unzip, workspace, _b, host, port, username, password, privateKey, secure, RemoteCommand, zipfileName, zipfile, globOptions, files, uploadFiles, client, error_1;
    var _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 15, , 16]);
                return [4, getConfigFile(name)];
            case 1:
                projects = (_f.sent()).projects;
                if (((_c = projects) === null || _c === void 0 ? void 0 : _c.length) === 0) {
                    console.log('Please configure a project first.');
                    process.exit(0);
                }
                project = void 0;
                if (!(projects.length === 1)) return [3, 2];
                project = projects[0];
                return [3, 4];
            case 2: return [4, inquirer.prompt([
                    {
                        type: 'list',
                        name: 'project',
                        message: 'Choose a project.',
                        choices: __spread(projects)
                    }
                ])];
            case 3:
                selector_1 = _f.sent();
                project = (_e = (_d = projects) === null || _d === void 0 ? void 0 : _d.find(function (o) { return o.value === selector_1.project; }), (_e !== null && _e !== void 0 ? _e : projects[0]));
                _f.label = 4;
            case 4:
                _a = parseProject(project), rootDir = _a.rootDir, ignore = _a.ignore, rules = _a.rules, type = _a.type, connect = _a.connect, deployTo = _a.deployTo, beforeScripts = _a.beforeScripts, remoteCommand = _a.remoteCommand, unzip = _a.unzip;
                workspace = path.resolve(utils_1.__ROOTPATH, rootDir);
                if (!(beforeScripts && beforeScripts.length > 0)) return [3, 6];
                console.log('Start running pre-script ...\n');
                return [4, runscript(beforeScripts.join(' && '))];
            case 5:
                _f.sent();
                _f.label = 6;
            case 6:
                _b = connect, host = _b.host, port = _b.port, username = _b.username, password = _b.password, privateKey = _b.privateKey, secure = _b.secure;
                RemoteCommand = [];
                zipfileName = dayjs().format('YYYY-MM-DDTHHmmss') + '.tar.gz';
                zipfile = path.resolve(utils_1.__ROOTPATH, zipfileName);
                if (!connect) return [3, 12];
                globOptions = { cwd: workspace, nodir: true, realpath: true, ignore: ignore };
                return [4, pickFils(['**'], globOptions)];
            case 7:
                files = _f.sent();
                uploadFiles = processFiles(files, { workspace: workspace, deployTo: deployTo, rules: rules });
                if (!(unzip && type === 'sftp')) return [3, 9];
                console.log('\nStarting compressing folders ...');
                return [4, zip_1.zip(zipfile, '**', globOptions)];
            case 8:
                _f.sent();
                uploadFiles = [{
                        filename: "/" + zipfileName,
                        filepath: zipfile,
                        dest: path.resolve(deployTo, zipfileName)
                    }];
                RemoteCommand = ["cd " + deployTo, "tar -zxvf " + zipfileName, "rm -rf " + zipfileName].concat((remoteCommand !== null && remoteCommand !== void 0 ? remoteCommand : []));
                _f.label = 9;
            case 9:
                client = type === 'sftp'
                    ? new sftp_1.default({ host: host, port: port, username: username, password: password, privateKey: privateKey })
                    : new ftp_1.default({ host: host, port: port, user: username, password: password, secure: secure });
                return [4, client.connect()];
            case 10:
                _f.sent();
                return [4, upload(client, uploadFiles)];
            case 11:
                _f.sent();
                console.log('');
                client.end();
                _f.label = 12;
            case 12:
                if (!(RemoteCommand.length > 0 && type === 'sftp')) return [3, 14];
                return [4, new ssh_1.default({ host: host, port: port, username: username, password: password, privateKey: privateKey }).exec(RemoteCommand.join(' && '))];
            case 13:
                _f.sent();
                console.log('Command execution completed.\n');
                if (fs.existsSync(zipfile)) {
                    fs.unlinkSync(zipfile);
                }
                _f.label = 14;
            case 14: return [3, 16];
            case 15:
                error_1 = _f.sent();
                console.error(error_1.message);
                return [3, 16];
            case 16: return [2];
        }
    });
}); });
function getConfigFile(name) {
    return __awaiter(this, void 0, void 0, function () {
        var files, configFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!name) {
                        files = fs.readdirSync(utils_1.__ROOTPATH);
                        name = files.find(function (o) { return /^(deploy\.config)\.(ya?ml|json|js)$/.test(o); });
                    }
                    configFile = path.resolve(utils_1.__ROOTPATH, (name !== null && name !== void 0 ? name : ''));
                    if (!/\.(ya??ml|json|js)$/.test(name) || !fs.existsSync(configFile)) {
                        console.log('No configuration files found.');
                        process.exit(0);
                    }
                    if (/\.(ya?ml|json)$/.test((name !== null && name !== void 0 ? name : ''))) {
                        return [2, utils_1.loadConfig(configFile)];
                    }
                    return [4, Promise.resolve().then(function () { return require(configFile); })];
                case 1: return [2, _a.sent()];
            }
        });
    });
}
function pickFils(patterns, options) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    async.map(patterns, function (pattern, done) {
                        glob(pattern, options, done);
                    }, function (err, results) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            var files = ((results !== null && results !== void 0 ? results : [])).reduce(function (files, item) { return files.concat(item); });
                            resolve(files);
                        }
                    });
                })];
        });
    });
}
function upload(client, files) {
    return __awaiter(this, void 0, void 0, function () {
        var file, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (files.length == 0)
                        return [2];
                    file = files.shift();
                    if (!file) return [3, 6];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4, client.upload(file)];
                case 2:
                    _a.sent();
                    file && success(file);
                    if (!(files.length > 0)) return [3, 4];
                    return [4, upload(client, files)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [3, 6];
                case 5:
                    error_2 = _a.sent();
                    file && failure(file);
                    return [3, 6];
                case 6: return [2];
            }
        });
    });
}
function success(file) {
    var desc = chalk.cyan(file.filename + " " + chalk.white('===>') + " " + file.dest);
    console.log(chalk.greenBright('upload success :'), desc);
}
function failure(file) {
    var desc = chalk.yellow(file.filename + " " + chalk.white('===>') + " " + file.dest);
    console.log(chalk.redBright('upload failure :'), desc);
}
function processFiles(files, options) {
    var workspace = options.workspace, deployTo = options.deployTo, rules = options.rules;
    return files.map(function (item) {
        var _a;
        var filename = item.replace(new RegExp("^(" + workspace + ")"), '');
        var filepath = item;
        var dest = path.join(deployTo || '/home', filename);
        var file = { filename: filename, filepath: filepath, dest: dest };
        (_a = rules) === null || _a === void 0 ? void 0 : _a.forEach(function (rule) {
            customDest(file, rule, deployTo);
        });
        return file;
    });
}
function customDest(file, rule, root) {
    if (root === void 0) { root = ''; }
    var pattern = rule.test;
    var matched = file.filepath.match(pattern);
    if (matched) {
        file.dest = rule.dest.replace(/\[\$(\d+)\]/g, function (m, idx) { return matched[idx]; });
        file.dest = path.join(root || '/home', file.dest);
    }
}
function parseProject(project) {
    var _a;
    var type = project.type;
    var defaultPort = type === 'ftp' ? 21 : 22;
    project.connect.port = (_a = project.connect.port, (_a !== null && _a !== void 0 ? _a : defaultPort));
    if (type === 'ftp') {
        project.remoteCommand = undefined;
    }
    return project;
}
