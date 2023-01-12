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
var path_1 = require("path");
var asset_filter_1 = require("../cocos/asset-filter");
var build_plist_1 = require("./build-plist");
var utils_1 = require("./utils");
function getFrames(spriteAtlas, instance) {
    return Object.values(spriteAtlas._spriteFrames).map(function (_a) {
        var uuid = _a.uuid;
        return instance[uuid];
    });
}
function getFrameIds(spriteAtlas) {
    return Object.values(spriteAtlas._spriteFrames).map(function (_a) {
        var uuid = _a.uuid;
        return uuid;
    });
}
function getTextureName(bundle, instance, path) {
    var _a, _b;
    var textureAsset = (0, asset_filter_1.findAsset)(bundle, (0, asset_filter_1.and)((0, asset_filter_1.isSamePath)(path), (0, asset_filter_1.isSameCtor)("cc.Texture2D")));
    var textureInstance = textureAsset ? instance[textureAsset.uuid] : null;
    var texturePath = "".concat((_a = textureAsset === null || textureAsset === void 0 ? void 0 : textureAsset.path) !== null && _a !== void 0 ? _a : path).concat((_b = textureInstance === null || textureInstance === void 0 ? void 0 : textureInstance._native) !== null && _b !== void 0 ? _b : ".png");
    return (0, path_1.basename)(texturePath);
}
function extractSpriteAtlas(bundle, instance) {
    return function (asset, spriteAtlas, output) {
        if (spriteAtlas.ctor !== "cc.SpriteAtlas") {
            return [];
        }
        var path = (0, utils_1.getPath)(asset);
        var textureName = getTextureName(bundle, instance, path);
        var destination = (0, path_1.join)(output, "".concat(path, ".plist"));
        var frames = getFrames(spriteAtlas, instance);
        var plist = (0, build_plist_1.buildPlist)(textureName, frames);
        (0, utils_1.writeFile)(destination, plist);
        return __spreadArray([asset.uuid], getFrameIds(spriteAtlas), true);
    };
}
exports.extractSpriteAtlas = extractSpriteAtlas;
