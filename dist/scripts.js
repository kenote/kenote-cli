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
var inquirer = require("inquirer");
var runscript = require("runscript");
var path = require("path");
var ts_optchain_1 = require("ts-optchain");
var utils_1 = require("./utils");
exports.default = (function (name, tag, makefile) { return __awaiter(void 0, void 0, void 0, function () {
    var scripts, pkg, project, scriptTagname_1, options, isScript, scriptFilename, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                scripts = [];
                if (makefile) {
                    scripts = utils_1.readMakefileScripts(name);
                    if (scripts.length === 0) {
                        console.log('No script command found, please check your Makefile.');
                        process.exit(0);
                    }
                }
                else {
                    pkg = utils_1.readPackageJson(name);
                    if (!ts_optchain_1.oc(pkg).scripts()) {
                        console.log('No script command found, please check your package.json file.');
                        process.exit(0);
                    }
                    scripts = Object.keys(ts_optchain_1.oc(pkg).scripts({}));
                }
                project = utils_1.getProject(name);
                console.log('> Where project on', project.target);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                scriptTagname_1 = tag;
                if (!!tag) return [3, 3];
                return [4, inquirer.prompt([
                        {
                            type: 'list',
                            name: 'script',
                            message: 'Choose a run script',
                            choices: __spread(scripts)
                        }
                    ])];
            case 2:
                options = _a.sent();
                scriptTagname_1 = options.script;
                _a.label = 3;
            case 3:
                isScript = scripts.find(function (o) { return o === scriptTagname_1; });
                if (!isScript) {
                    scriptFilename = makefile ? 'Makefile' : 'package.json file';
                    console.log("No script command found, please check your " + scriptFilename + ".");
                    process.exit(0);
                }
                return [4, runscript("npm run " + scriptTagname_1, { cwd: path.resolve(utils_1.__ROOTPATH, name !== null && name !== void 0 ? name : '') })];
            case 4:
                _a.sent();
                return [3, 6];
            case 5:
                error_1 = _a.sent();
                console.error(error_1.message);
                return [3, 6];
            case 6: return [2];
        }
    });
}); });
