"use strict";
exports.__esModule = true;
exports.extractSkeleton = void 0;
var path_1 = require("path");
var utils_1 = require("./utils");
function extractSkeleton(bundle, instance) {
    return function (asset, skeleton, output) {
        var _a;
        if (skeleton.ctor !== "sp.SkeletonData") {
            return [];
        }
        var name = ((_a = skeleton.textureNames[0]) !== null && _a !== void 0 ? _a : asset.uuid).split(".")[0];
        var isUnknownSpine = !asset.path;
        var path = (0, utils_1.getPath)(asset, "unknown/spine");
        var jsonFile = isUnknownSpine
            ? (0, path_1.join)(output, path, "".concat(name, ".json"))
            : (0, path_1.join)(output, "".concat(path, ".json"));
        var atlasFile = isUnknownSpine
            ? (0, path_1.join)(output, path, "".concat(name, ".atlas"))
            : (0, path_1.join)(output, "".concat(path, ".atlas"));
        (0, utils_1.writeFile)(jsonFile, JSON.stringify(skeleton._skeletonJson));
        (0, utils_1.writeFile)(atlasFile, skeleton._atlasText);
        isUnknownSpine &&
            skeleton.textures.forEach(function (_a, index) {
                var uuid = _a.uuid;
                if (instance[uuid]) {
                    var asset_1 = bundle.storage[uuid];
                    var texture = instance[uuid];
                    var destination = (0, path_1.join)(output, path, "".concat(skeleton.textureNames[index]));
                    texture.exported = true;
                    (0, utils_1.copyFile)(asset_1.nativePath, destination);
                }
            });
        return [asset.uuid];
    };
}
exports.extractSkeleton = extractSkeleton;
