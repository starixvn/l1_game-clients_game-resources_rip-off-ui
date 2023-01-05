"use strict";
exports.__esModule = true;
exports.extract = void 0;
var audio_clip_1 = require("./audio-clip");
var skeleton_1 = require("./skeleton");
var sprite_atlas_1 = require("./sprite-atlas");
var sprite_frame_1 = require("./sprite-frame");
var texture2d_1 = require("./texture2d");
function skipInstances(asset, texture) {
    var skipCtors = ["cc.Prefab", "cc.SceneAsset"];
    if (skipCtors.includes(texture.ctor)) {
        return [asset.uuid];
    }
    return [];
}
function executePipeline(bundle, instance, output) {
    return function (_a) {
        var uuid = _a[0], base = _a[1];
        var pipelines = [
            (0, sprite_frame_1.extractSpriteFrame)(bundle, instance),
            (0, sprite_atlas_1.extractSpriteAtlas)(bundle, instance),
            (0, audio_clip_1.extractAudioClip)(bundle, instance),
            (0, skeleton_1.extractSkeleton)(bundle, instance),
            (0, texture2d_1.extractTexture2D)(bundle, instance),
            skipInstances,
        ];
        var asset = bundle.storage[uuid];
        return pipelines
            .map(function (execute) { return execute(asset, base, output); })
            .flat();
    };
}
function extract(bundle, instance, output) {
    var uuids = Object.entries(instance)
        .map(executePipeline(bundle, instance, output))
        .flat();
    uuids.forEach(function (uuid) { return (instance[uuid].exported = true); });
}
exports.extract = extract;
