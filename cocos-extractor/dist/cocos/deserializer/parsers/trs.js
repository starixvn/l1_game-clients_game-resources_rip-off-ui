"use strict";
exports.__esModule = true;
exports.trs = void 0;
function trs(data, owner, key, value) {
    if (!owner[key]) {
        owner[key] = new Float64Array(value);
    }
    var typedArray = owner[key];
    typedArray.set(value);
}
exports.trs = trs;
