"use strict";
exports.__esModule = true;
exports.addPackage = void 0;
function addPackage(bundle) {
    if (!bundle.configs.packs) {
        return;
    }
    var packages = bundle.configs.packs;
    var storage = bundle.storage;
    for (var packUuid in packages) {
        var uuids = packages[packUuid];
        var pack = {
            uuid: packUuid,
            packedUuids: uuids,
            ext: ".json"
        };
        storage[packUuid] = pack;
    }
    return bundle;
}
exports.addPackage = addPackage;
