"use strict";
exports.__esModule = true;
exports.buildImportUri = void 0;
var uuid_1 = require("../uuid");
function buildImportUri(bundle) {
    var _a;
    var uuids = Object.keys(bundle.storage);
    var storage = bundle.storage;
    for (var i = 0, l = uuids.length; i < l; i++) {
        var uuid = uuids[i];
        var assetInfo = storage[uuid];
        if (assetInfo === null || assetInfo === void 0 ? void 0 : assetInfo.ver) {
            var extension = (_a = assetInfo.ext) !== null && _a !== void 0 ? _a : ".json";
            var folder = (0, uuid_1.getUuidFolder)(uuid);
            var version = assetInfo.ver;
            var uri = "import/".concat(folder, "/").concat(uuid, ".").concat(version).concat(extension);
            assetInfo.importUri = uri;
        }
        if (assetInfo === null || assetInfo === void 0 ? void 0 : assetInfo.nativeVer) {
            var folder = (0, uuid_1.getUuidFolder)(uuid);
            var version = assetInfo.nativeVer;
            var uri = "native/".concat(folder, "/").concat(uuid, ".").concat(version);
            assetInfo.nativeUri = uri;
        }
    }
    return bundle;
}
exports.buildImportUri = buildImportUri;
