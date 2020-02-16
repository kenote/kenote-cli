"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var yaml = require("js-yaml");
var fs = require("fs-extra");
var validator_1 = require("validator");
var downloaditRepo = require("download-git-repo");
var os = require("os");
var ora = require("ora");
var lodash_1 = require("lodash");
var ini = require("ini");
var runscript = require("runscript");
var chalk_1 = require("chalk");
exports.__HOMEPATH = os.homedir();
exports.__ROOTPATH = process.cwd();
exports.__KENOTE = path.resolve(exports.__HOMEPATH, '.kenote');
exports.__CONFIGFILE = path.resolve(exports.__KENOTE, 'config.yml');
exports.__CLI_DIR = path.resolve(__dirname, '../../');
function getProject(name) {
    var target = path.resolve(exports.__ROOTPATH, name || '');
    var exists = fs.existsSync(target);
    name = path.basename(target);
    if (/(\/|\\)/.test(name)) {
        name = path.basename(name);
    }
    return { name: name, target: target, exists: exists };
}
exports.getProject = getProject;
function getConfig() {
    var defaultConfig = loadConfig(path.resolve(exports.__CLI_DIR, 'config.yml'));
    var customConfig = loadConfig(exports.__CONFIGFILE);
    return __assign(__assign({}, defaultConfig), customConfig);
}
exports.getConfig = getConfig;
function loadConfig(file) {
    var data = {};
    if (!isConfigFile(file))
        return data;
    var fileStr = fs.readFileSync(file, 'utf-8');
    if (validator_1.default.isJSON(fileStr)) {
        return JSON.parse(fileStr);
    }
    try {
        data = yaml.load(fileStr);
    }
    catch (error) {
    }
    return data;
}
exports.loadConfig = loadConfig;
function isConfigFile(file) {
    if (!fs.existsSync(file))
        return false;
    var stat = fs.statSync(file);
    if (stat.isDirectory())
        return false;
    return true;
}
exports.isConfigFile = isConfigFile;
function installConfigFile(file) {
    return __awaiter(this, void 0, void 0, function () {
        var spinner, config, configStr, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spinner = ora('Installing configuration ...').start();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    if (!fs.existsSync(exports.__KENOTE))
                        fs.mkdirpSync(exports.__KENOTE);
                    config = loadConfig(file);
                    configStr = yaml.dump(config);
                    return [4, fs.writeFile(exports.__CONFIGFILE, configStr, 'utf-8')];
                case 2:
                    _a.sent();
                    spinner.stop();
                    spinner.succeed('Installing configuration complete.');
                    return [3, 4];
                case 3:
                    error_1 = _a.sent();
                    spinner.stop();
                    spinner.fail(error_1.message);
                    return [3, 4];
                case 4: return [2];
            }
        });
    });
}
exports.installConfigFile = installConfigFile;
function getAuthor() {
    var _a, _b;
    var author = os.userInfo().username;
    var gitConfigFile = path.resolve(exports.__HOMEPATH, '.gitconfig');
    if (!isConfigFile(gitConfigFile)) {
        return author;
    }
    try {
        var gitConfig = ini.parse(fs.readFileSync(gitConfigFile, 'utf-8'));
        if (gitConfig.user) {
            var userinfo = [gitConfig.user.name];
            if ((_b = (_a = gitConfig) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.email) {
                userinfo.push("<" + gitConfig.user.email + ">");
            }
            return userinfo.join(' ');
        }
    }
    catch (error) {
    }
    return author;
}
exports.getAuthor = getAuthor;
function downloadRepo(repo, target, options) {
    return __awaiter(this, void 0, void 0, function () {
        var spinner, error_2, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spinner = ora('Downloading repo ...').start();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4, fs.remove(target)];
                case 2:
                    _a.sent();
                    return [4, new Promise(function (resolve, reject) {
                            downloaditRepo(repo, target, function (err) {
                                if (err)
                                    return reject(err);
                                resolve();
                            });
                        })];
                case 3:
                    _a.sent();
                    spinner.stop();
                    spinner.succeed('Downloading repo complete.');
                    refreshPackageJson(options, target);
                    return [3, 5];
                case 4:
                    error_2 = _a.sent();
                    message = error_2.message;
                    if (error_2.host && error_2.path) {
                        message += '\n' + error_2.host + error_2.path;
                    }
                    spinner.stop();
                    spinner.fail(message);
                    return [3, 5];
                case 5: return [2];
            }
        });
    });
}
exports.downloadRepo = downloadRepo;
function refreshPackageJson(options, target) {
    var packageFile = path.resolve(target, 'package.json');
    var pkg = fs.readJsonSync(packageFile, { encoding: 'utf-8' });
    lodash_1.unset(pkg, 'repository');
    pkg = __assign(__assign({}, pkg), options);
    fs.writeJsonSync(packageFile, pkg, { encoding: 'utf-8', replacer: null, spaces: 2 });
}
function readPackageJson(target) {
    if (!target) {
        target = exports.__ROOTPATH;
    }
    var packageFile = path.resolve(target, 'package.json');
    if (!isConfigFile(packageFile)) {
        return undefined;
    }
    return loadConfig(packageFile);
}
exports.readPackageJson = readPackageJson;
function installPackage(target, installer, results) {
    if (installer === void 0) { installer = 'npm'; }
    return __awaiter(this, void 0, void 0, function () {
        var spinner, results_1, results_1_1, result, dir, _a, _b, line, error_3, message;
        var e_1, _c, e_2, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    spinner = ora('Installing package ...\n').start();
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    spinner.info('');
                    return [4, runscript(installer + " install", { cwd: target })];
                case 2:
                    _e.sent();
                    spinner.stop();
                    spinner.succeed('Installing package complete.');
                    if (results) {
                        try {
                            for (results_1 = __values(results), results_1_1 = results_1.next(); !results_1_1.done; results_1_1 = results_1.next()) {
                                result = results_1_1.value;
                                console.log('\n ', chalk_1.default.bold(result.name + ":"), '\n');
                                if (exports.__ROOTPATH !== target) {
                                    dir = exports.__ROOTPATH === path.dirname(target) ? path.basename(target) : target;
                                    console.log('   ', chalk_1.default.blue('cd'), dir);
                                }
                                try {
                                    for (_a = (e_2 = void 0, __values(result.content)), _b = _a.next(); !_b.done; _b = _a.next()) {
                                        line = _b.value;
                                        console.log('   ', line);
                                    }
                                }
                                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                finally {
                                    try {
                                        if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                                    }
                                    finally { if (e_2) throw e_2.error; }
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (results_1_1 && !results_1_1.done && (_c = results_1.return)) _c.call(results_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        console.log('');
                    }
                    return [3, 4];
                case 3:
                    error_3 = _e.sent();
                    message = error_3.message;
                    spinner.stop();
                    spinner.fail(message);
                    return [3, 4];
                case 4: return [2];
            }
        });
    });
}
exports.installPackage = installPackage;
