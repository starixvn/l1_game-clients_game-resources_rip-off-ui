"use strict";
exports.__esModule = true;
exports.getPath = void 0;
function getPath(asset, unknownPrefix) {
    var _a;
    if (unknownPrefix === void 0) { unknownPrefix = "unknown"; }
    return (_a = asset === null || asset === void 0 ? void 0 : asset.path) !== null && _a !== void 0 ? _a : "".concat(unknownPrefix, "/").concat(asset.uuid);
}
exports.getPath = getPath;
