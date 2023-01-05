"use strict";
exports.__esModule = true;
exports.innerObject = void 0;
var constants_1 = require("../../package/constants");
function innerObject(data, owner, key, value) {
    owner[key] = null;
    data[constants_1.DEPEND_OBJECT][value] = owner;
}
exports.innerObject = innerObject;
