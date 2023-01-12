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
exports.extractTexture2D = void 0;
var path_1 = require("path");
var build_plist_1 = require("./build-plist");
var utils_1 = require("./utils");
function extractNormalTexture(texture, asset, output) {
    var destination = (0, path_1.join)(output, "".concat((0, utils_1.getPath)(asset)).concat(texture._native));
    (0, utils_1.copyFile)(asset.nativePath, destination);
    return [asset.uuid];
}
function getFrameEntries(instance, uuid) {
    return Object.entries(instance).filter(function (_a) {
        var _b;
        var _ = _a[0], value = _a[1];
        return value.ctor === "cc.SpriteFrame" &&
            ((_b = value === null || value === void 0 ? void 0 : value._textureSetter) === null || _b === void 0 ? void 0 : _b.uuid) === uuid;
    });
}
function extractCustomPlist(asset, texture, frameEntries, output) {
    var uuids = frameEntries.map(function (_a) {
        var uuid = _a[0];
        return uuid;
    });
    var folder = "unknown/atlas";
    var path = (0, utils_1.getPath)(asset, folder);
    var textureName = "".concat(asset.uuid).concat(texture._native);
    var frames = frameEntries.map(function (_a) {
        var _ = _a[0], frame = _a[1];
        return frame;
    });
    var plist = (0, build_plist_1.buildPlist)(textureName, frames);
    var plistDestination = (0, path_1.join)(output, "".concat(path, ".plist"));
    var textureDestination = (0, path_1.join)(output, "".concat(path).concat(texture._native));
    (0, utils_1.copyFile)(asset.nativePath, textureDestination);
    (0, utils_1.writeFile)(plistDestination, plist);
    return __spreadArray([asset.uuid], uuids, true);
}
function extractTexture2D(bundle, instance) {
    return function (asset, texture, output) {
        if (texture.ctor !== "cc.Texture2D" || texture.exported) {
            return [];
        }
        var isNormalTexture = !!asset.path;
        if (isNormalTexture) {
            return extractNormalTexture(texture, asset, output);
        }
        else {
            var entries = getFrameEntries(instance, asset.uuid);
            // Custom Plist
            if (entries.length !== 0) {
                return extractCustomPlist(asset, texture, entries, output);
            }
        }
        return [];
    };
}
exports.extractTexture2D = extractTexture2D;
