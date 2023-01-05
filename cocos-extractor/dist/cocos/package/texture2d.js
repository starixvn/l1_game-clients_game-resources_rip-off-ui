"use strict";
exports.__esModule = true;
exports.unpackTexture2D = void 0;
var extensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".bmp",
    ".webp",
    ".pvr",
    ".pkm",
    ".astc",
];
function unpackTexture2D(json) {
    var data = json.data;
    return data
        .split("|")
        .map(function (e) { return e.split(",").map(function (x) { return parseInt(x); }); })
        .map(function (frame) { return [
        1,
        0,
        0,
        ["cc.Texture2D"],
        0,
        [
            {
                base: frame[0],
                mipmaps: frame[1],
                frame: frame,
                _native: extensions[frame[0]]
            },
        ],
        [0],
        0,
        [],
        [],
        [],
    ]; });
}
exports.unpackTexture2D = unpackTexture2D;
