"use strict";
exports.__esModule = true;
exports.unpack = void 0;
var asset_filter_1 = require("../asset-filter");
var read_json_1 = require("../read-json");
var array_1 = require("./array");
var texture2d_1 = require("./texture2d");
function unpack(bundle) {
    var packages = (0, asset_filter_1.getAssets)(bundle, asset_filter_1.isPackage);
    packages.forEach(function (pack) {
        var json = (0, read_json_1.readJsonFile)(pack.importPath);
        var sections = [];
        if (Array.isArray(json)) {
            sections = (0, array_1.unpackArray)(json);
        }
        else {
            if (!json.type || !json.data) {
                return;
            }
            if (json.type === "cc.Texture2D") {
                sections = (0, texture2d_1.unpackTexture2D)(json);
            }
            else if (json.type === "cc.ImageAsset") {
                console.warn("TODO: cc.ImageAsset");
            }
        }
        for (var i = 0; i < pack.packedUuids.length; i++) {
            var uuid = pack.packedUuids[i];
            bundle.imported[uuid] = sections[i];
        }
    });
}
exports.unpack = unpack;
