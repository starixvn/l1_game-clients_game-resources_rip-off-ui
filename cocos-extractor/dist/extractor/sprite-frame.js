"use strict";
exports.__esModule = true;
exports.extractSpriteFrame = void 0;
function extractSpriteFrame(bundle, instance) {
    return function (asset, frame, output) {
        var _a;
        if (frame.ctor !== "cc.SpriteFrame") {
            return [];
        }
        frame.texture = instance[(_a = frame._textureSetter) === null || _a === void 0 ? void 0 : _a.uuid];
        return [];
    };
}
exports.extractSpriteFrame = extractSpriteFrame;
