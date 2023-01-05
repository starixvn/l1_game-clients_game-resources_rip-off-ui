"use strict";
exports.__esModule = true;
exports.getClass = void 0;
var sprite_frame_1 = require("./sprite-frame");
var texture2d_1 = require("./texture2d");
function getClass(ctor) {
    // TODO: Class Serializer
    switch (ctor) {
        case "cc.SpriteFrame":
            return sprite_frame_1.spriteFrame;
        case "cc.Texture2D":
            return texture2d_1.texture2D;
        default:
            return function () { return console.warn(ctor); };
    }
}
exports.getClass = getClass;
