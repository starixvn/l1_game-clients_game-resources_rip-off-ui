"use strict";
exports.__esModule = true;
exports.extractSkeleton = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var utils_1 = require("./utils");
function extractSkeleton(bundle, instance) {
    return function (asset, skeleton, output) {
        if (skeleton.ctor !== "sp.SkeletonData") {
            return [];
        }
        var path = (0, utils_1.getPath)(asset, "unknown/spine");
        var jsonFile = (0, path_1.join)(output, "".concat(path, ".json"));
        var atlasFile = (0, path_1.join)(output, "".concat(path, ".atlas"));
        (0, fs_1.mkdirSync)((0, path_1.dirname)(jsonFile), { recursive: true });
        (0, fs_1.writeFileSync)(jsonFile, JSON.stringify(skeleton._skeletonJson));
        (0, fs_1.writeFileSync)(atlasFile, skeleton._atlasText);
        return [asset.uuid];
    };
}
exports.extractSkeleton = extractSkeleton;
