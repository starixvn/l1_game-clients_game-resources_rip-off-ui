"use strict";
exports.__esModule = true;
exports.extractSpriteFrame = void 0;
function extractSpriteFrame(bundle, instance) {
    return function (asset, frame, output) {
        if (frame.ctor !== "cc.SpriteFrame") {
            return [];
        }
        frame.texture = instance[frame._textureSetter.uuid];
        return [];
    };
}
exports.extractSpriteFrame = extractSpriteFrame;
