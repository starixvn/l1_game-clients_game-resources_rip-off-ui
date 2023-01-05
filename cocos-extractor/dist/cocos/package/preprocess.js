"use strict";
exports.__esModule = true;
exports.preprocess = void 0;
var constants_1 = require("./constants");
function preprocess(data) {
    var masks = data[constants_1.SHARED_MASK];
    if (masks) {
        var classes = data[constants_1.SHARED_CLASS];
        for (var i = 0; i < masks.length; ++i) {
            var mask = masks[i];
            mask[0] = classes[mask[0]];
        }
    }
}
exports.preprocess = preprocess;
