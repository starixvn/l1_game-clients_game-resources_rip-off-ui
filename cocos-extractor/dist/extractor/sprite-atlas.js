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
exports.extractSpriteAtlas = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var build_plist_1 = require("./build-plist");
var utils_1 = require("./utils");
function reference(spriteAtlas, instance) {
    return Object.keys(spriteAtlas._spriteFrames).map(function (key) {
        var uuid = spriteAtlas._spriteFrames[key].uuid;
        var frame = instance[uuid];
        spriteAtlas._spriteFrames[key] = frame;
        return uuid;
    });
}
function extractSpriteAtlas(bundle, instance) {
    return function (asset, spriteAtlas, output) {
        var _a;
        if (spriteAtlas.ctor !== "cc.SpriteAtlas") {
            return [];
        }
        var path = (0, utils_1.getPath)(asset);
        var destination = (0, path_1.join)(output, "".concat(path, ".plist"));
        var uuids = reference(spriteAtlas, instance);
        var textureAsset = Object.values(bundle.storage).find(function (asset) { return asset.path === path; });
        var textureInstance = textureAsset ? instance[textureAsset.uuid] : null;
        var frames = Object.values(spriteAtlas._spriteFrames);
        var textureName = spriteAtlas._name.split(".")[0] + ((_a = textureInstance === null || textureInstance === void 0 ? void 0 : textureInstance._native) !== null && _a !== void 0 ? _a : ".png");
        var plist = (0, build_plist_1.buildPlist)(textureName, frames);
        (0, fs_1.mkdirSync)((0, path_1.dirname)(destination), { recursive: true });
        (0, fs_1.writeFileSync)(destination, plist);
        return __spreadArray([asset.uuid], uuids, true);
    };
}
exports.extractSpriteAtlas = extractSpriteAtlas;
