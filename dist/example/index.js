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
var utils_1 = require("../utils");
var ts_optchain_1 = require("ts-optchain");
function default_1() {
    return __awaiter(this, void 0, void 0, function () {
        var options;
        return __generator(this, function (_a) {
            options = inquirer.prompt([
                {
                    type: 'list',
                    name: 'update',
                    message: ''
                }
            ]);
            return [2];
        });
    });
}
exports.default = default_1;
exports.createApp = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    var project, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4, initProject(name)];
            case 1:
                project = _a.sent();
                return [4, installExample(project)];
            case 2:
                _a.sent();
                return [3, 4];
            case 3:
                error_1 = _a.sent();
                console.log(error_1.message);
                return [3, 4];
            case 4: return [2];
        }
    });
}); };
function initProject(name) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var project, actions, examples, options, example;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    project = utils_1.getProject(name);
                    if (!project.exists) return [3, 2];
                    return [4, inquirer.prompt([
                            {
                                type: 'confirm',
                                name: 'overwrite',
                                message: "Target directory " + project.target + " already exists. Whether to overwrite",
                                default: false
                            }
                        ])];
                case 1:
                    actions = _d.sent();
                    if (!actions.overwrite) {
                        process.exit(0);
                    }
                    _d.label = 2;
                case 2:
                    console.log('> Generating project in', project.target);
                    examples = utils_1.getConfig().examples;
                    if (ts_optchain_1.oc(examples)([]).length === 0) {
                        throw new Error('Did not find any examples');
                    }
                    return [4, inquirer.prompt([
                            {
                                type: 'input',
                                name: 'name',
                                message: 'Project name',
                                default: project.name
                            },
                            {
                                type: 'input',
                                name: 'description',
                                message: 'Project description',
                                default: 'Your Project\'s description.'
                            },
                            {
                                type: 'list',
                                name: 'example',
                                message: 'Choose a custom example',
                                choices: __spread(examples)
                            },
                            {
                                type: 'input',
                                name: 'author',
                                message: 'Author name',
                                default: utils_1.getAuthor()
                            },
                            {
                                type: 'list',
                                name: 'installer',
                                message: 'Choose a package manager',
                                choices: ['npm', 'yarn'],
                                default: 'npm'
                            }
                        ])];
                case 3:
                    options = _d.sent();
                    example = (_a = examples) === null || _a === void 0 ? void 0 : _a.find(function (o) { return o.value === options.example; });
                    return [2, {
                            name: options.name,
                            description: options.description,
                            author: options.author,
                            installer: options.installer,
                            target: project.target,
                            repository: (_b = example) === null || _b === void 0 ? void 0 : _b.repository,
                            results: (_c = example) === null || _c === void 0 ? void 0 : _c.results
                        }];
            }
        });
    });
}
function installExample(options) {
    return __awaiter(this, void 0, void 0, function () {
        var name, description, author, installer, target, repository, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    name = options.name, description = options.description, author = options.author, installer = options.installer, target = options.target, repository = options.repository, results = options.results;
                    if (!repository) {
                        throw new Error('No repository address configuration found.');
                    }
                    return [4, utils_1.downloadRepo(repository, target, { name: name, description: description, author: author })];
                case 1:
                    _a.sent();
                    return [4, utils_1.installPackage(target, installer, results)];
                case 2:
                    _a.sent();
                    return [2];
            }
        });
    });
}