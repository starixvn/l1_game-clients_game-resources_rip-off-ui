"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.buildPlist = exports.spriteFramesToPlistFrames = exports.array2String = void 0;
var plist_1 = require("plist");
function array2String(array) {
    if (array.length === 2) {
        return "{".concat(array.join(","), "}");
    }
    else {
        var postfix = __spreadArray([], array, true);
        var prefix = postfix.splice(0, 2);
        return "{".concat([prefix, postfix].map(array2String).join(","), "}");
    }
}
exports.array2String = array2String;
function spriteFramesToPlistFrames(frames) {
    return frames.reduce(function (result, frame) {
        var _a, _b;
        var data = {
            aliases: [],
            spriteOffset: array2String(frame.offset),
            spriteSize: array2String(frame.originalSize),
            spriteSourceSize: array2String(frame.originalSize),
            textureRect: array2String(frame.rect),
            textureRotated: frame.rotated === 1 ? true : false
        };
        var ext = (_b = (_a = frame === null || frame === void 0 ? void 0 : frame.texture) === null || _a === void 0 ? void 0 : _a._native) !== null && _b !== void 0 ? _b : ".png";
        result["".concat(frame.name).concat(ext)] = data;
        return result;
    }, {});
}
exports.spriteFramesToPlistFrames = spriteFramesToPlistFrames;
function buildPlist(textureName, frames) {
    var json = {
        frames: spriteFramesToPlistFrames(frames),
        metadata: {
            format: 3,
            textureFileName: textureName,
            realTextureFileName: textureName
        }
    };
    return (0, plist_1.build)(json);
}
exports.buildPlist = buildPlist;
