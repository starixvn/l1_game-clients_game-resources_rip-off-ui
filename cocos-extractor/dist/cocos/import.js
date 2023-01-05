"use strict";
exports.__esModule = true;
exports.importJsonFiles = void 0;
var asset_filter_1 = require("./asset-filter");
var read_json_1 = require("./read-json");
function importJsonFiles(bundle) {
    var assets = (0, asset_filter_1.getAssets)(bundle, asset_filter_1.isNativeImport);
    assets.forEach(function (asset) {
        bundle.imported[asset.uuid] = (0, read_json_1.readJsonFile)(asset.importPath);
    });
    return bundle;
}
exports.importJsonFiles = importJsonFiles;
