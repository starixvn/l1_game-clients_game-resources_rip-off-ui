"use strict";
exports.__esModule = true;
exports.addVersion = void 0;
function addVersion(bundle) {
    if (!bundle.configs.versions) {
        return;
    }
    var versions = bundle.configs.versions;
    var storage = bundle.storage;
    var entries = versions["import"];
    if (entries) {
        for (var i = 0, l = entries.length; i < l; i += 2) {
            var uuid = entries[i];
            var assetInfo = storage[uuid];
            assetInfo.ver = entries[i + 1];
        }
    }
    entries = versions.native;
    if (entries) {
        for (var i = 0, l = entries.length; i < l; i += 2) {
            var uuid = entries[i];
            var assetInfo = storage[uuid];
            assetInfo.nativeVer = entries[i + 1];
        }
    }
    return bundle;
}
exports.addVersion = addVersion;
