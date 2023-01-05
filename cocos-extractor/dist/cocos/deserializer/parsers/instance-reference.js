"use strict";
exports.__esModule = true;
exports.instanceReference = void 0;
var constants_1 = require("../../package/constants");
function instanceReference(data, owner, key, value) {
    if (value >= 0) {
        owner[key] = data[constants_1.INSTANCES][value];
    }
    else {
        data[constants_1.REFS][~value * 3] = owner;
    }
}
exports.instanceReference = instanceReference;
