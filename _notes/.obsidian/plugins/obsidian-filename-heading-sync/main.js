'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
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
}

function __spreadArray(to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
}

var stockIllegalSymbols = ['*', '\\', '/', '<', '>', ':', '|', '?'];
var DEFAULT_SETTINGS = {
    userIllegalSymbols: [],
    ignoredFiles: {},
    ignoreRegex: '',
};
var FilenameHeadingSyncPlugin = /** @class */ (function (_super) {
    __extends(FilenameHeadingSyncPlugin, _super);
    function FilenameHeadingSyncPlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FilenameHeadingSyncPlugin.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadSettings()];
                    case 1:
                        _a.sent();
                        this.registerEvent(this.app.vault.on('rename', function (file, oldPath) {
                            return _this.handleSyncFilenameToHeading(file, oldPath);
                        }));
                        this.registerEvent(this.app.vault.on('modify', function (file) { return _this.handleSyncHeadingToFile(file); }));
                        this.registerEvent(this.app.workspace.on('file-open', function (file) {
                            return _this.handleSyncFilenameToHeading(file, file.path);
                        }));
                        this.addSettingTab(new FilenameHeadingSyncSettingTab(this.app, this));
                        this.addCommand({
                            id: 'page-heading-sync-ignore-file',
                            name: 'Ignore current file',
                            checkCallback: function (checking) {
                                var leaf = _this.app.workspace.activeLeaf;
                                if (leaf) {
                                    if (!checking) {
                                        _this.settings.ignoredFiles[_this.app.workspace.getActiveFile().path] = null;
                                        _this.saveSettings();
                                    }
                                    return true;
                                }
                                return false;
                            },
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    FilenameHeadingSyncPlugin.prototype.fileIsIgnored = function (path) {
        // check manual ignore
        if (this.settings.ignoredFiles[path] !== undefined) {
            return true;
        }
        // check regex
        try {
            if (this.settings.ignoreRegex === '') {
                return;
            }
            var reg = new RegExp(this.settings.ignoreRegex);
            return reg.exec(path) !== null;
        }
        catch (_a) { }
        return false;
    };
    /**
     * Renames the file with the first heading found
     *
     * @param      {TAbstractFile}  file    The file
     */
    FilenameHeadingSyncPlugin.prototype.handleSyncHeadingToFile = function (file) {
        if (!(file instanceof obsidian.TFile)) {
            return;
        }
        var view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        // if currently opened file is not the same as the one that fired the event, skip
        // this is to make sure other events don't trigger this plugin
        if (view.file !== file) {
            return;
        }
        // if ignored, just bail
        if (this.fileIsIgnored(file.path)) {
            return;
        }
        var editor = view.editor;
        var doc = editor.getDoc();
        var docstart = this.findDocstart(doc);
        var heading = this.findHeading(doc, docstart);
        // no heading found, nothing to do here
        if (heading == null) {
            return;
        }
        var sanitizedHeading = this.sanitizeHeading(heading.Text);
        if (sanitizedHeading.length > 0 &&
            this.sanitizeHeading(view.file.basename) !== sanitizedHeading) {
            var newPath = view.file.path.replace(view.file.name.trim(), sanitizedHeading + "." + view.file.extension);
            this.app.fileManager.renameFile(view.file, newPath);
        }
    };
    /**
     * Syncs the current filename to the first heading
     * Finds the first heading of the file, then replaces it with the filename
     *
     * @param      {TAbstractFile}  file     The file that fired the event
     * @param      {string}         oldPath  The old path
     */
    FilenameHeadingSyncPlugin.prototype.handleSyncFilenameToHeading = function (file, oldPath) {
        if (!(file instanceof obsidian.TFile)) {
            return;
        }
        var view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        // if currently opened file is not the same as the one that fired the event, skip
        // this is to make sure other events don't trigger this plugin
        if (view.file !== file) {
            return;
        }
        // if oldpath is ignored, hook in and update the new filepath to be ignored instead
        if (this.fileIsIgnored(oldPath.trim())) {
            // if filename didn't change, just bail, nothing to do here
            if (file.path === oldPath) {
                return;
            }
            // If filepath changed and the file was in the ignore list before,
            // remove it from the list and add the new one instead
            if (this.settings.ignoredFiles[oldPath]) {
                delete this.settings.ignoredFiles[oldPath];
                this.settings.ignoredFiles[file.path] = null;
                this.saveSettings();
            }
            return;
        }
        var editor = view.editor;
        var doc = editor.getDoc();
        var cursor = doc.getCursor();
        var docstart = this.findDocstart(doc);
        var foundHeading = this.findHeading(doc, docstart);
        var sanitizedHeading = this.sanitizeHeading(file.basename);
        if (foundHeading !== null) {
            if (this.sanitizeHeading(foundHeading.Text) !== sanitizedHeading) {
                this.replaceLine(doc, foundHeading.LineNumber, "# " + sanitizedHeading);
                doc.setCursor(cursor);
            }
            return;
        }
        if (docstart > 0) {
            this.insertLine(doc, docstart + 1, "\n# " + sanitizedHeading);
        }
        else {
            this.insertLine(doc, docstart, "# " + sanitizedHeading);
        }
        doc.setCursor(cursor);
    };
    FilenameHeadingSyncPlugin.prototype.findHeading = function (doc, startLine) {
        if (startLine === void 0) { startLine = 0; }
        for (var i = startLine; i <= doc.lastLine(); i++) {
            var line = doc.getLine(i);
            if (line === undefined) {
                continue;
            }
            if (line.startsWith('# ')) {
                return {
                    LineNumber: i,
                    Text: line.substring(2),
                };
            }
        }
        return null;
    };
    /**
     * Finds the start of the users document, excluding frontmatter
     *
     * @param      {Editor}  doc     The document
     * @return     {number}  line when the doc starts
     */
    FilenameHeadingSyncPlugin.prototype.findDocstart = function (doc) {
        var start = doc.getLine(0);
        if (start === undefined || start !== '---') {
            return 0;
        }
        for (var i = 1; i <= doc.lastLine(); i++) {
            if (doc.getLine(i) === '---') {
                // found end
                return i;
            }
        }
        return 0;
    };
    FilenameHeadingSyncPlugin.prototype.sanitizeHeading = function (text) {
        var combinedIllegalSymbols = __spreadArray(__spreadArray([], stockIllegalSymbols), this.settings.userIllegalSymbols);
        combinedIllegalSymbols.forEach(function (symbol) {
            text = text.replace(symbol, '');
        });
        return text.trim();
    };
    FilenameHeadingSyncPlugin.prototype.insertLine = function (doc, line, text) {
        doc.replaceRange(text + "\n", { line: line, ch: 0 }, { line: line, ch: 0 });
    };
    FilenameHeadingSyncPlugin.prototype.replaceLine = function (doc, line, text) {
        doc.replaceRange(text + "\n", { line: line, ch: 0 }, { line: line + 1, ch: 0 });
    };
    FilenameHeadingSyncPlugin.prototype.loadSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this;
                        _c = (_b = Object).assign;
                        _d = [{}, DEFAULT_SETTINGS];
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.settings = _c.apply(_b, _d.concat([_e.sent()]));
                        return [2 /*return*/];
                }
            });
        });
    };
    FilenameHeadingSyncPlugin.prototype.saveSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveData(this.settings)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return FilenameHeadingSyncPlugin;
}(obsidian.Plugin));
var FilenameHeadingSyncSettingTab = /** @class */ (function (_super) {
    __extends(FilenameHeadingSyncSettingTab, _super);
    function FilenameHeadingSyncSettingTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.plugin = plugin;
        _this.app = app;
        return _this;
    }
    FilenameHeadingSyncSettingTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        var regexIgnoredFilesDiv;
        var renderRegexIgnoredFiles = function (div) {
            // empty existing div
            div.innerHTML = '';
            if (_this.plugin.settings.ignoreRegex === '') {
                return;
            }
            try {
                var files = _this.app.vault.getFiles();
                var reg_1 = new RegExp(_this.plugin.settings.ignoreRegex);
                files
                    .filter(function (file) { return reg_1.exec(file.path) !== null; })
                    .forEach(function (el) {
                    new obsidian.Setting(div).setDesc(el.path);
                });
            }
            catch (e) {
                return;
            }
        };
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Filename Heading Sync' });
        containerEl.createEl('p', {
            text: 'This plugin will overwrite the first heading found in a file with the filename.',
        });
        containerEl.createEl('p', {
            text: 'If no header is found, will insert a new one at the first line (after frontmatter).',
        });
        new obsidian.Setting(containerEl)
            .setName('Custom Illegal Charaters/Strings')
            .setDesc('Type charaters/strings seperated by a comma. This input is space sensitive.')
            .addText(function (text) {
            return text
                .setPlaceholder('[],#,...')
                .setValue(_this.plugin.settings.userIllegalSymbols.join())
                .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.plugin.settings.userIllegalSymbols = value.split(',');
                            return [4 /*yield*/, this.plugin.saveSettings()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        new obsidian.Setting(containerEl)
            .setName('Ignore Regex Rule')
            .setDesc('Ignore rule in RegEx format. All files listed below will get ignored by this plugin.')
            .addText(function (text) {
            return text
                .setPlaceholder('MyFolder/.*')
                .setValue(_this.plugin.settings.ignoreRegex)
                .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            try {
                                new RegExp(value);
                                this.plugin.settings.ignoreRegex = value;
                            }
                            catch (_b) {
                                this.plugin.settings.ignoreRegex = '';
                            }
                            return [4 /*yield*/, this.plugin.saveSettings()];
                        case 1:
                            _a.sent();
                            renderRegexIgnoredFiles(regexIgnoredFilesDiv);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        containerEl.createEl('h2', { text: 'Ignored Files By Regex' });
        containerEl.createEl('p', {
            text: 'All files matching the above RegEx will get listed here',
        });
        regexIgnoredFilesDiv = containerEl.createDiv('test');
        renderRegexIgnoredFiles(regexIgnoredFilesDiv);
        containerEl.createEl('h2', { text: 'Manually Ignored Files' });
        containerEl.createEl('p', {
            text: 'You can ignore files from this plugin by using the "ignore this file" command',
        });
        var _loop_1 = function (key) {
            var ignoredFilesSettingsObj = new obsidian.Setting(containerEl).setDesc(key);
            ignoredFilesSettingsObj.addButton(function (button) {
                button.setButtonText('Delete').onClick(function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                delete this.plugin.settings.ignoredFiles[key];
                                return [4 /*yield*/, this.plugin.saveSettings()];
                            case 1:
                                _a.sent();
                                this.display();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        };
        // go over all ignored files and add them
        for (var key in this.plugin.settings.ignoredFiles) {
            _loop_1(key);
        }
    };
    return FilenameHeadingSyncSettingTab;
}(obsidian.PluginSettingTab));

module.exports = FilenameHeadingSyncPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIm1haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20pIHtcclxuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGZyb20ubGVuZ3RoLCBqID0gdG8ubGVuZ3RoOyBpIDwgaWw7IGkrKywgaisrKVxyXG4gICAgICAgIHRvW2pdID0gZnJvbVtpXTtcclxuICAgIHJldHVybiB0bztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgc3RhdGUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIGdldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHJlYWQgcHJpdmF0ZSBtZW1iZXIgZnJvbSBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIGtpbmQgPT09IFwibVwiID8gZiA6IGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyKSA6IGYgPyBmLnZhbHVlIDogc3RhdGUuZ2V0KHJlY2VpdmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRTZXQocmVjZWl2ZXIsIHN0YXRlLCB2YWx1ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwibVwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBtZXRob2QgaXMgbm90IHdyaXRhYmxlXCIpO1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgc2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3Qgd3JpdGUgcHJpdmF0ZSBtZW1iZXIgdG8gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiAoa2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIsIHZhbHVlKSA6IGYgPyBmLnZhbHVlID0gdmFsdWUgOiBzdGF0ZS5zZXQocmVjZWl2ZXIsIHZhbHVlKSksIHZhbHVlO1xyXG59XHJcbiIsImltcG9ydCB7XG4gIEFwcCxcbiAgTW9kYWwsXG4gIE5vdGljZSxcbiAgUGx1Z2luLFxuICBQbHVnaW5TZXR0aW5nVGFiLFxuICBTZXR0aW5nLFxuICBFdmVudFJlZixcbiAgTWFya2Rvd25WaWV3LFxuICBURmlsZSxcbiAgVEFic3RyYWN0RmlsZSxcbiAgRWRpdG9yLFxufSBmcm9tICdvYnNpZGlhbic7XG5cbmNvbnN0IHN0b2NrSWxsZWdhbFN5bWJvbHMgPSBbJyonLCAnXFxcXCcsICcvJywgJzwnLCAnPicsICc6JywgJ3wnLCAnPyddO1xuXG5pbnRlcmZhY2UgTGluZVBvaW50ZXIge1xuICBMaW5lTnVtYmVyOiBudW1iZXI7XG4gIFRleHQ6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIEZpbGVuYW1lSGVhZGluZ1N5bmNQbHVnaW5TZXR0aW5ncyB7XG4gIHVzZXJJbGxlZ2FsU3ltYm9sczogc3RyaW5nW107XG4gIGlnbm9yZVJlZ2V4OiBzdHJpbmc7XG4gIGlnbm9yZWRGaWxlczogeyBba2V5OiBzdHJpbmddOiBudWxsIH07XG59XG5cbmNvbnN0IERFRkFVTFRfU0VUVElOR1M6IEZpbGVuYW1lSGVhZGluZ1N5bmNQbHVnaW5TZXR0aW5ncyA9IHtcbiAgdXNlcklsbGVnYWxTeW1ib2xzOiBbXSxcbiAgaWdub3JlZEZpbGVzOiB7fSxcbiAgaWdub3JlUmVnZXg6ICcnLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmlsZW5hbWVIZWFkaW5nU3luY1BsdWdpbiBleHRlbmRzIFBsdWdpbiB7XG4gIHNldHRpbmdzOiBGaWxlbmFtZUhlYWRpbmdTeW5jUGx1Z2luU2V0dGluZ3M7XG5cbiAgYXN5bmMgb25sb2FkKCkge1xuICAgIGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQoXG4gICAgICB0aGlzLmFwcC52YXVsdC5vbigncmVuYW1lJywgKGZpbGUsIG9sZFBhdGgpID0+XG4gICAgICAgIHRoaXMuaGFuZGxlU3luY0ZpbGVuYW1lVG9IZWFkaW5nKGZpbGUsIG9sZFBhdGgpLFxuICAgICAgKSxcbiAgICApO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudChcbiAgICAgIHRoaXMuYXBwLnZhdWx0Lm9uKCdtb2RpZnknLCAoZmlsZSkgPT4gdGhpcy5oYW5kbGVTeW5jSGVhZGluZ1RvRmlsZShmaWxlKSksXG4gICAgKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQoXG4gICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub24oJ2ZpbGUtb3BlbicsIChmaWxlKSA9PlxuICAgICAgICB0aGlzLmhhbmRsZVN5bmNGaWxlbmFtZVRvSGVhZGluZyhmaWxlLCBmaWxlLnBhdGgpLFxuICAgICAgKSxcbiAgICApO1xuXG4gICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBGaWxlbmFtZUhlYWRpbmdTeW5jU2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcykpO1xuXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiAncGFnZS1oZWFkaW5nLXN5bmMtaWdub3JlLWZpbGUnLFxuICAgICAgbmFtZTogJ0lnbm9yZSBjdXJyZW50IGZpbGUnLFxuICAgICAgY2hlY2tDYWxsYmFjazogKGNoZWNraW5nOiBib29sZWFuKSA9PiB7XG4gICAgICAgIGxldCBsZWFmID0gdGhpcy5hcHAud29ya3NwYWNlLmFjdGl2ZUxlYWY7XG4gICAgICAgIGlmIChsZWFmKSB7XG4gICAgICAgICAgaWYgKCFjaGVja2luZykge1xuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5pZ25vcmVkRmlsZXNbXG4gICAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCkucGF0aFxuICAgICAgICAgICAgXSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgZmlsZUlzSWdub3JlZChwYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAvLyBjaGVjayBtYW51YWwgaWdub3JlXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuaWdub3JlZEZpbGVzW3BhdGhdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIHJlZ2V4XG4gICAgdHJ5IHtcbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLmlnbm9yZVJlZ2V4ID09PSAnJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlZyA9IG5ldyBSZWdFeHAodGhpcy5zZXR0aW5ncy5pZ25vcmVSZWdleCk7XG4gICAgICByZXR1cm4gcmVnLmV4ZWMocGF0aCkgIT09IG51bGw7XG4gICAgfSBjYXRjaCB7fVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmFtZXMgdGhlIGZpbGUgd2l0aCB0aGUgZmlyc3QgaGVhZGluZyBmb3VuZFxuICAgKlxuICAgKiBAcGFyYW0gICAgICB7VEFic3RyYWN0RmlsZX0gIGZpbGUgICAgVGhlIGZpbGVcbiAgICovXG4gIGhhbmRsZVN5bmNIZWFkaW5nVG9GaWxlKGZpbGU6IFRBYnN0cmFjdEZpbGUpIHtcbiAgICBpZiAoIShmaWxlIGluc3RhbmNlb2YgVEZpbGUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG5cbiAgICAvLyBpZiBjdXJyZW50bHkgb3BlbmVkIGZpbGUgaXMgbm90IHRoZSBzYW1lIGFzIHRoZSBvbmUgdGhhdCBmaXJlZCB0aGUgZXZlbnQsIHNraXBcbiAgICAvLyB0aGlzIGlzIHRvIG1ha2Ugc3VyZSBvdGhlciBldmVudHMgZG9uJ3QgdHJpZ2dlciB0aGlzIHBsdWdpblxuICAgIGlmICh2aWV3LmZpbGUgIT09IGZpbGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBpZiBpZ25vcmVkLCBqdXN0IGJhaWxcbiAgICBpZiAodGhpcy5maWxlSXNJZ25vcmVkKGZpbGUucGF0aCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBlZGl0b3IgPSB2aWV3LmVkaXRvcjtcbiAgICBjb25zdCBkb2MgPSBlZGl0b3IuZ2V0RG9jKCk7XG4gICAgY29uc3QgZG9jc3RhcnQgPSB0aGlzLmZpbmREb2NzdGFydChkb2MpO1xuICAgIGNvbnN0IGhlYWRpbmcgPSB0aGlzLmZpbmRIZWFkaW5nKGRvYywgZG9jc3RhcnQpO1xuXG4gICAgLy8gbm8gaGVhZGluZyBmb3VuZCwgbm90aGluZyB0byBkbyBoZXJlXG4gICAgaWYgKGhlYWRpbmcgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNhbml0aXplZEhlYWRpbmcgPSB0aGlzLnNhbml0aXplSGVhZGluZyhoZWFkaW5nLlRleHQpO1xuICAgIGlmIChcbiAgICAgIHNhbml0aXplZEhlYWRpbmcubGVuZ3RoID4gMCAmJlxuICAgICAgdGhpcy5zYW5pdGl6ZUhlYWRpbmcodmlldy5maWxlLmJhc2VuYW1lKSAhPT0gc2FuaXRpemVkSGVhZGluZ1xuICAgICkge1xuICAgICAgY29uc3QgbmV3UGF0aCA9IHZpZXcuZmlsZS5wYXRoLnJlcGxhY2UoXG4gICAgICAgIHZpZXcuZmlsZS5uYW1lLnRyaW0oKSxcbiAgICAgICAgYCR7c2FuaXRpemVkSGVhZGluZ30uJHt2aWV3LmZpbGUuZXh0ZW5zaW9ufWAsXG4gICAgICApO1xuICAgICAgdGhpcy5hcHAuZmlsZU1hbmFnZXIucmVuYW1lRmlsZSh2aWV3LmZpbGUsIG5ld1BhdGgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTeW5jcyB0aGUgY3VycmVudCBmaWxlbmFtZSB0byB0aGUgZmlyc3QgaGVhZGluZ1xuICAgKiBGaW5kcyB0aGUgZmlyc3QgaGVhZGluZyBvZiB0aGUgZmlsZSwgdGhlbiByZXBsYWNlcyBpdCB3aXRoIHRoZSBmaWxlbmFtZVxuICAgKlxuICAgKiBAcGFyYW0gICAgICB7VEFic3RyYWN0RmlsZX0gIGZpbGUgICAgIFRoZSBmaWxlIHRoYXQgZmlyZWQgdGhlIGV2ZW50XG4gICAqIEBwYXJhbSAgICAgIHtzdHJpbmd9ICAgICAgICAgb2xkUGF0aCAgVGhlIG9sZCBwYXRoXG4gICAqL1xuICBoYW5kbGVTeW5jRmlsZW5hbWVUb0hlYWRpbmcoZmlsZTogVEFic3RyYWN0RmlsZSwgb2xkUGF0aDogc3RyaW5nKSB7XG4gICAgaWYgKCEoZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcblxuICAgIC8vIGlmIGN1cnJlbnRseSBvcGVuZWQgZmlsZSBpcyBub3QgdGhlIHNhbWUgYXMgdGhlIG9uZSB0aGF0IGZpcmVkIHRoZSBldmVudCwgc2tpcFxuICAgIC8vIHRoaXMgaXMgdG8gbWFrZSBzdXJlIG90aGVyIGV2ZW50cyBkb24ndCB0cmlnZ2VyIHRoaXMgcGx1Z2luXG4gICAgaWYgKHZpZXcuZmlsZSAhPT0gZmlsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGlmIG9sZHBhdGggaXMgaWdub3JlZCwgaG9vayBpbiBhbmQgdXBkYXRlIHRoZSBuZXcgZmlsZXBhdGggdG8gYmUgaWdub3JlZCBpbnN0ZWFkXG4gICAgaWYgKHRoaXMuZmlsZUlzSWdub3JlZChvbGRQYXRoLnRyaW0oKSkpIHtcbiAgICAgIC8vIGlmIGZpbGVuYW1lIGRpZG4ndCBjaGFuZ2UsIGp1c3QgYmFpbCwgbm90aGluZyB0byBkbyBoZXJlXG4gICAgICBpZiAoZmlsZS5wYXRoID09PSBvbGRQYXRoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgZmlsZXBhdGggY2hhbmdlZCBhbmQgdGhlIGZpbGUgd2FzIGluIHRoZSBpZ25vcmUgbGlzdCBiZWZvcmUsXG4gICAgICAvLyByZW1vdmUgaXQgZnJvbSB0aGUgbGlzdCBhbmQgYWRkIHRoZSBuZXcgb25lIGluc3RlYWRcbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLmlnbm9yZWRGaWxlc1tvbGRQYXRoXSkge1xuICAgICAgICBkZWxldGUgdGhpcy5zZXR0aW5ncy5pZ25vcmVkRmlsZXNbb2xkUGF0aF07XG4gICAgICAgIHRoaXMuc2V0dGluZ3MuaWdub3JlZEZpbGVzW2ZpbGUucGF0aF0gPSBudWxsO1xuICAgICAgICB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGVkaXRvciA9IHZpZXcuZWRpdG9yO1xuICAgIGNvbnN0IGRvYyA9IGVkaXRvci5nZXREb2MoKTtcbiAgICBjb25zdCBjdXJzb3IgPSBkb2MuZ2V0Q3Vyc29yKCk7XG5cbiAgICBjb25zdCBkb2NzdGFydCA9IHRoaXMuZmluZERvY3N0YXJ0KGRvYyk7XG5cbiAgICBjb25zdCBmb3VuZEhlYWRpbmcgPSB0aGlzLmZpbmRIZWFkaW5nKGRvYywgZG9jc3RhcnQpO1xuICAgIGNvbnN0IHNhbml0aXplZEhlYWRpbmcgPSB0aGlzLnNhbml0aXplSGVhZGluZyhmaWxlLmJhc2VuYW1lKTtcblxuICAgIGlmIChmb3VuZEhlYWRpbmcgIT09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLnNhbml0aXplSGVhZGluZyhmb3VuZEhlYWRpbmcuVGV4dCkgIT09IHNhbml0aXplZEhlYWRpbmcpIHtcbiAgICAgICAgdGhpcy5yZXBsYWNlTGluZShkb2MsIGZvdW5kSGVhZGluZy5MaW5lTnVtYmVyLCBgIyAke3Nhbml0aXplZEhlYWRpbmd9YCk7XG4gICAgICAgIGRvYy5zZXRDdXJzb3IoY3Vyc29yKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZG9jc3RhcnQgPiAwKSB7XG4gICAgICB0aGlzLmluc2VydExpbmUoZG9jLCBkb2NzdGFydCArIDEsIGBcXG4jICR7c2FuaXRpemVkSGVhZGluZ31gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pbnNlcnRMaW5lKGRvYywgZG9jc3RhcnQsIGAjICR7c2FuaXRpemVkSGVhZGluZ31gKTtcbiAgICB9XG4gICAgZG9jLnNldEN1cnNvcihjdXJzb3IpO1xuICB9XG5cbiAgZmluZEhlYWRpbmcoZG9jOiBFZGl0b3IsIHN0YXJ0TGluZSA9IDApOiBMaW5lUG9pbnRlciB8IG51bGwge1xuICAgIGZvciAobGV0IGkgPSBzdGFydExpbmU7IGkgPD0gZG9jLmxhc3RMaW5lKCk7IGkrKykge1xuICAgICAgY29uc3QgbGluZSA9IGRvYy5nZXRMaW5lKGkpO1xuICAgICAgaWYgKGxpbmUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGxpbmUuc3RhcnRzV2l0aCgnIyAnKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIExpbmVOdW1iZXI6IGksXG4gICAgICAgICAgVGV4dDogbGluZS5zdWJzdHJpbmcoMiksXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogRmluZHMgdGhlIHN0YXJ0IG9mIHRoZSB1c2VycyBkb2N1bWVudCwgZXhjbHVkaW5nIGZyb250bWF0dGVyXG4gICAqXG4gICAqIEBwYXJhbSAgICAgIHtFZGl0b3J9ICBkb2MgICAgIFRoZSBkb2N1bWVudFxuICAgKiBAcmV0dXJuICAgICB7bnVtYmVyfSAgbGluZSB3aGVuIHRoZSBkb2Mgc3RhcnRzXG4gICAqL1xuICBmaW5kRG9jc3RhcnQoZG9jOiBFZGl0b3IpOiBudW1iZXIge1xuICAgIGNvbnN0IHN0YXJ0ID0gZG9jLmdldExpbmUoMCk7XG4gICAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQgfHwgc3RhcnQgIT09ICctLS0nKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBkb2MubGFzdExpbmUoKTsgaSsrKSB7XG4gICAgICBpZiAoZG9jLmdldExpbmUoaSkgPT09ICctLS0nKSB7XG4gICAgICAgIC8vIGZvdW5kIGVuZFxuICAgICAgICByZXR1cm4gaTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHNhbml0aXplSGVhZGluZyh0ZXh0OiBzdHJpbmcpIHtcbiAgICBsZXQgY29tYmluZWRJbGxlZ2FsU3ltYm9scyA9IFtcbiAgICAgIC4uLnN0b2NrSWxsZWdhbFN5bWJvbHMsXG4gICAgICAuLi50aGlzLnNldHRpbmdzLnVzZXJJbGxlZ2FsU3ltYm9scyxcbiAgICBdO1xuICAgIGNvbWJpbmVkSWxsZWdhbFN5bWJvbHMuZm9yRWFjaCgoc3ltYm9sKSA9PiB7XG4gICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKHN5bWJvbCwgJycpO1xuICAgIH0pO1xuICAgIHJldHVybiB0ZXh0LnRyaW0oKTtcbiAgfVxuXG4gIGluc2VydExpbmUoZG9jOiBFZGl0b3IsIGxpbmU6IG51bWJlciwgdGV4dDogc3RyaW5nKSB7XG4gICAgZG9jLnJlcGxhY2VSYW5nZShgJHt0ZXh0fVxcbmAsIHsgbGluZTogbGluZSwgY2g6IDAgfSwgeyBsaW5lOiBsaW5lLCBjaDogMCB9KTtcbiAgfVxuXG4gIHJlcGxhY2VMaW5lKGRvYzogRWRpdG9yLCBsaW5lOiBudW1iZXIsIHRleHQ6IHN0cmluZykge1xuICAgIGRvYy5yZXBsYWNlUmFuZ2UoXG4gICAgICBgJHt0ZXh0fVxcbmAsXG4gICAgICB7IGxpbmU6IGxpbmUsIGNoOiAwIH0sXG4gICAgICB7IGxpbmU6IGxpbmUgKyAxLCBjaDogMCB9LFxuICAgICk7XG4gIH1cblxuICBhc3luYyBsb2FkU2V0dGluZ3MoKSB7XG4gICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIGF3YWl0IHRoaXMubG9hZERhdGEoKSk7XG4gIH1cblxuICBhc3luYyBzYXZlU2V0dGluZ3MoKSB7XG4gICAgYXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgfVxufVxuXG5jbGFzcyBGaWxlbmFtZUhlYWRpbmdTeW5jU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICBwbHVnaW46IEZpbGVuYW1lSGVhZGluZ1N5bmNQbHVnaW47XG4gIGFwcDogQXBwO1xuXG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IEZpbGVuYW1lSGVhZGluZ1N5bmNQbHVnaW4pIHtcbiAgICBzdXBlcihhcHAsIHBsdWdpbik7XG4gICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gICAgdGhpcy5hcHAgPSBhcHA7XG4gIH1cblxuICBkaXNwbGF5KCk6IHZvaWQge1xuICAgIGxldCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuICAgIGxldCByZWdleElnbm9yZWRGaWxlc0RpdjogSFRNTERpdkVsZW1lbnQ7XG5cbiAgICBjb25zdCByZW5kZXJSZWdleElnbm9yZWRGaWxlcyA9IChkaXY6IEhUTUxFbGVtZW50KSA9PiB7XG4gICAgICAvLyBlbXB0eSBleGlzdGluZyBkaXZcbiAgICAgIGRpdi5pbm5lckhUTUwgPSAnJztcblxuICAgICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLmlnbm9yZVJlZ2V4ID09PSAnJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGZpbGVzID0gdGhpcy5hcHAudmF1bHQuZ2V0RmlsZXMoKTtcbiAgICAgICAgY29uc3QgcmVnID0gbmV3IFJlZ0V4cCh0aGlzLnBsdWdpbi5zZXR0aW5ncy5pZ25vcmVSZWdleCk7XG5cbiAgICAgICAgZmlsZXNcbiAgICAgICAgICAuZmlsdGVyKChmaWxlKSA9PiByZWcuZXhlYyhmaWxlLnBhdGgpICE9PSBudWxsKVxuICAgICAgICAgIC5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgICAgbmV3IFNldHRpbmcoZGl2KS5zZXREZXNjKGVsLnBhdGgpO1xuICAgICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbCgnaDInLCB7IHRleHQ6ICdGaWxlbmFtZSBIZWFkaW5nIFN5bmMnIH0pO1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdwJywge1xuICAgICAgdGV4dDpcbiAgICAgICAgJ1RoaXMgcGx1Z2luIHdpbGwgb3ZlcndyaXRlIHRoZSBmaXJzdCBoZWFkaW5nIGZvdW5kIGluIGEgZmlsZSB3aXRoIHRoZSBmaWxlbmFtZS4nLFxuICAgIH0pO1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdwJywge1xuICAgICAgdGV4dDpcbiAgICAgICAgJ0lmIG5vIGhlYWRlciBpcyBmb3VuZCwgd2lsbCBpbnNlcnQgYSBuZXcgb25lIGF0IHRoZSBmaXJzdCBsaW5lIChhZnRlciBmcm9udG1hdHRlcikuJyxcbiAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ0N1c3RvbSBJbGxlZ2FsIENoYXJhdGVycy9TdHJpbmdzJylcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICAnVHlwZSBjaGFyYXRlcnMvc3RyaW5ncyBzZXBlcmF0ZWQgYnkgYSBjb21tYS4gVGhpcyBpbnB1dCBpcyBzcGFjZSBzZW5zaXRpdmUuJyxcbiAgICAgIClcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICB0ZXh0XG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKCdbXSwjLC4uLicpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnVzZXJJbGxlZ2FsU3ltYm9scy5qb2luKCkpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudXNlcklsbGVnYWxTeW1ib2xzID0gdmFsdWUuc3BsaXQoJywnKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ0lnbm9yZSBSZWdleCBSdWxlJylcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICAnSWdub3JlIHJ1bGUgaW4gUmVnRXggZm9ybWF0LiBBbGwgZmlsZXMgbGlzdGVkIGJlbG93IHdpbGwgZ2V0IGlnbm9yZWQgYnkgdGhpcyBwbHVnaW4uJyxcbiAgICAgIClcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICB0ZXh0XG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKCdNeUZvbGRlci8uKicpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmlnbm9yZVJlZ2V4KVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIG5ldyBSZWdFeHAodmFsdWUpO1xuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5pZ25vcmVSZWdleCA9IHZhbHVlO1xuICAgICAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmlnbm9yZVJlZ2V4ID0gJyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgcmVuZGVyUmVnZXhJZ25vcmVkRmlsZXMocmVnZXhJZ25vcmVkRmlsZXNEaXYpO1xuICAgICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMicsIHsgdGV4dDogJ0lnbm9yZWQgRmlsZXMgQnkgUmVnZXgnIH0pO1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdwJywge1xuICAgICAgdGV4dDogJ0FsbCBmaWxlcyBtYXRjaGluZyB0aGUgYWJvdmUgUmVnRXggd2lsbCBnZXQgbGlzdGVkIGhlcmUnLFxuICAgIH0pO1xuXG4gICAgcmVnZXhJZ25vcmVkRmlsZXNEaXYgPSBjb250YWluZXJFbC5jcmVhdGVEaXYoJ3Rlc3QnKTtcbiAgICByZW5kZXJSZWdleElnbm9yZWRGaWxlcyhyZWdleElnbm9yZWRGaWxlc0Rpdik7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbCgnaDInLCB7IHRleHQ6ICdNYW51YWxseSBJZ25vcmVkIEZpbGVzJyB9KTtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbCgncCcsIHtcbiAgICAgIHRleHQ6XG4gICAgICAgICdZb3UgY2FuIGlnbm9yZSBmaWxlcyBmcm9tIHRoaXMgcGx1Z2luIGJ5IHVzaW5nIHRoZSBcImlnbm9yZSB0aGlzIGZpbGVcIiBjb21tYW5kJyxcbiAgICB9KTtcblxuICAgIC8vIGdvIG92ZXIgYWxsIGlnbm9yZWQgZmlsZXMgYW5kIGFkZCB0aGVtXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMucGx1Z2luLnNldHRpbmdzLmlnbm9yZWRGaWxlcykge1xuICAgICAgY29uc3QgaWdub3JlZEZpbGVzU2V0dGluZ3NPYmogPSBuZXcgU2V0dGluZyhjb250YWluZXJFbCkuc2V0RGVzYyhrZXkpO1xuXG4gICAgICBpZ25vcmVkRmlsZXNTZXR0aW5nc09iai5hZGRCdXR0b24oKGJ1dHRvbikgPT4ge1xuICAgICAgICBidXR0b24uc2V0QnV0dG9uVGV4dCgnRGVsZXRlJykub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgZGVsZXRlIHRoaXMucGx1Z2luLnNldHRpbmdzLmlnbm9yZWRGaWxlc1trZXldO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIl0sIm5hbWVzIjpbIlRGaWxlIiwiTWFya2Rvd25WaWV3IiwiUGx1Z2luIiwiU2V0dGluZyIsIlBsdWdpblNldHRpbmdUYWIiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksYUFBYSxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNuQyxJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsY0FBYztBQUN6QyxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxZQUFZLEtBQUssSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDcEYsUUFBUSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDMUcsSUFBSSxPQUFPLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0IsQ0FBQyxDQUFDO0FBQ0Y7QUFDTyxTQUFTLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2hDLElBQUksSUFBSSxPQUFPLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxLQUFLLElBQUk7QUFDN0MsUUFBUSxNQUFNLElBQUksU0FBUyxDQUFDLHNCQUFzQixHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRywrQkFBK0IsQ0FBQyxDQUFDO0FBQ2xHLElBQUksYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN4QixJQUFJLFNBQVMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUMzQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxLQUFLLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDekYsQ0FBQztBQXVDRDtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDdEcsUUFBUSxTQUFTLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDdEgsUUFBUSxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsVUFBVSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDOUUsS0FBSyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBQ0Q7QUFDTyxTQUFTLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFO0FBQzNDLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNySCxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLE1BQU0sS0FBSyxVQUFVLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxXQUFXLEVBQUUsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdKLElBQUksU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxVQUFVLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDdEUsSUFBSSxTQUFTLElBQUksQ0FBQyxFQUFFLEVBQUU7QUFDdEIsUUFBUSxJQUFJLENBQUMsRUFBRSxNQUFNLElBQUksU0FBUyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDdEUsUUFBUSxPQUFPLENBQUMsRUFBRSxJQUFJO0FBQ3RCLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENB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
