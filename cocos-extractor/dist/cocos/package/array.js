"use strict";
exports.__esModule = true;
exports.unpackArray = void 0;
var constants_1 = require("./constants");
var preprocess_1 = require("./preprocess");
function unpackArray(data) {
    (0, preprocess_1.preprocess)(data);
    var version = { version: data[constants_1.VERSION], preprocessed: true };
    var sharedUuids = data[constants_1.SHARED_UUID];
    var sharedStrings = data[constants_1.SHARED_STRING];
    var sharedClasses = data[constants_1.SHARED_CLASS];
    var sharedMasks = data[constants_1.SHARED_MASK];
    var sections = data[constants_1.SESSION];
    for (var i = 0; i < sections.length; ++i) {
        sections[i].unshift(version, sharedUuids, sharedStrings, sharedClasses, sharedMasks);
    }
    return sections;
}
exports.unpackArray = unpackArray;
