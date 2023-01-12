"use strict";
exports.__esModule = true;
exports.texture2D = void 0;
var texture2d_1 = require("../../package/texture2d");
function texture2D(data, context) {
    if (typeof data === "string") {
        var frame = data.split(",").map(function (x) { return parseInt(x); });
        return {
            base: frame[0],
            mipmaps: frame[1],
            frame: frame,
            _native: texture2d_1.texture2dExtensions[frame[0]]
        };
    }
    return data;
}
exports.texture2D = texture2D;
