"use strict";
exports.__esModule = true;
exports.cacheWithUuid = void 0;
function cacheWithUuid(configs) {
    if (!configs.uuids) {
        return;
    }
    var uuids = configs.uuids;
    var storage = {};
    for (var i = 0, l = uuids.length; i < l; i++) {
        var uuid = uuids[i];
        storage[uuid] = { uuid: uuid };
    }
    return { configs: configs, storage: storage, imported: {} };
}
exports.cacheWithUuid = cacheWithUuid;
