"use strict";
exports.__esModule = true;
exports.valueType = exports.valueTypeCreated = void 0;
var simple_1 = require("./simple");
function valueTypeCreated(data, owner, key, value) {
    (0, simple_1.simple)(data, owner, key, value);
}
exports.valueTypeCreated = valueTypeCreated;
function valueType(data, owner, key, value) {
    (0, simple_1.simple)(data, owner, key, value);
}
exports.valueType = valueType;
