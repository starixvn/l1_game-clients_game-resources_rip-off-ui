"use strict";
exports.__esModule = true;
exports.addPath = void 0;
function addPath(bundle) {
    if (!bundle.configs.paths) {
        return;
    }
    var paths = bundle.configs.paths;
    var storage = bundle.storage;
    for (var uuid in paths) {
        var info = paths[uuid];
        var path = info[0];
        var type = info[1];
        var assetInfo = storage[uuid];
        assetInfo.path = path;
        assetInfo.ctor = type;
    }
    return bundle;
}
exports.addPath = addPath;
