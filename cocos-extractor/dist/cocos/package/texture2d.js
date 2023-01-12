"use strict";
exports.__esModule = true;
exports.unpackTexture2D = exports.texture2dExtensions = void 0;
exports.texture2dExtensions = [
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
                _native: exports.texture2dExtensions[frame[0]]
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
