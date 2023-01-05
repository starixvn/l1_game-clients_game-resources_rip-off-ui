"use strict";
exports.__esModule = true;
exports.readJsonFile = void 0;
var fs_1 = require("fs");
function readJsonFile(path) {
    try {
        var data = (0, fs_1.readFileSync)(path, "utf-8");
        return JSON.parse(data);
    }
    catch (error) {
        throw new Error("Read JSON Failed: ".concat(path));
    }
}
exports.readJsonFile = readJsonFile;
