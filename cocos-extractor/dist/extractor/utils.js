"use strict";
exports.__esModule = true;
exports.writeFile = exports.copyFile = exports.getPath = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
function getPath(asset, unknownPrefix) {
    var _a;
    if (unknownPrefix === void 0) { unknownPrefix = "unknown"; }
    return (_a = asset === null || asset === void 0 ? void 0 : asset.path) !== null && _a !== void 0 ? _a : "".concat(unknownPrefix, "/").concat(asset.uuid);
}
exports.getPath = getPath;
function copyFile(from, to) {
    (0, fs_1.mkdirSync)((0, path_1.dirname)(to), { recursive: true });
    (0, fs_1.copyFileSync)(from, to);
}
exports.copyFile = copyFile;
function writeFile(to, data) {
    (0, fs_1.mkdirSync)((0, path_1.dirname)(to), { recursive: true });
    (0, fs_1.writeFileSync)(to, data);
}
exports.writeFile = writeFile;
