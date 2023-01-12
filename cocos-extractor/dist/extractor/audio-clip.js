"use strict";
exports.__esModule = true;
exports.extractAudioClip = void 0;
var path_1 = require("path");
var utils_1 = require("./utils");
function extractAudioClip(bundle, instance) {
    return function (asset, audioClip, output) {
        if (audioClip.ctor !== "cc.AudioClip") {
            return [];
        }
        var destination = (0, path_1.join)(output, "".concat((0, utils_1.getPath)(asset)).concat(audioClip._native));
        (0, utils_1.copyFile)(asset.nativePath, destination);
        return [asset.uuid];
    };
}
exports.extractAudioClip = extractAudioClip;
