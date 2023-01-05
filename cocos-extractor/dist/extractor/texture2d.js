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
var fs_1 = require("fs");
var path_1 = require("path");
var build_plist_1 = require("./build-plist");
var utils_1 = require("./utils");
function copyTexture(texture, asset, output, unknownPrefix) {
    if (unknownPrefix === void 0) { unknownPrefix = "unknown"; }
    var path = (0, utils_1.getPath)(asset, unknownPrefix);
    var destination = (0, path_1.join)(output, "".concat(path).concat(texture._native));
    (0, fs_1.mkdirSync)((0, path_1.dirname)(destination), { recursive: true });
    (0, fs_1.copyFileSync)(asset.nativePath, destination);
}
function extractTexture2D(bundle, instance) {
    return function (asset, texture, output) {
        if (texture.ctor !== "cc.Texture2D") {
            return [];
        }
        if (!!asset.path) {
            copyTexture(texture, asset, output);
            return [asset.uuid];
        }
        else {
            var entries = Object.entries(instance).filter(function (_a) {
                var _ = _a[0], value = _a[1];
                return value.ctor === "cc.SpriteFrame" &&
                    value._textureSetter.uuid === asset.uuid;
            });
            // Custom Plist
            if (entries.length !== 0) {
                var uuids = entries.map(function (_a) {
                    var uuid = _a[0];
                    return uuid;
                });
                var folder = "unknown/atlas";
                var path = (0, utils_1.getPath)(asset, folder);
                var textureName = "".concat(asset.uuid).concat(texture._native);
                var frames_1 = entries.map(function (_a) {
                    var _ = _a[0], frame = _a[1];
                    return frame;
                });
                var plist_1 = (0, build_plist_1.buildPlist)(textureName, frames_1);
                var plistDestination = (0, path_1.join)(output, "".concat(path, ".plist"));
                copyTexture(texture, asset, output, folder);
                (0, fs_1.writeFileSync)(plistDestination, plist_1);
                return __spreadArray([asset.uuid], uuids, true);
            }
            else {
                // Unknown textures
                copyTexture(texture, asset, output, "unknown/images");
                return [asset.uuid];
            }
        }
    };
}
exports.extractTexture2D = extractTexture2D;
