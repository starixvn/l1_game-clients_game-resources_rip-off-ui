"use strict";
exports.__esModule = true;
exports.getAssets = exports.isNative = exports.isNativeImport = exports.isPackage = exports.isImportAsset = void 0;
var isImportAsset = function (asset) { return !!asset.importUri; };
exports.isImportAsset = isImportAsset;
var isPackage = function (asset) { return !!asset.packedUuids; };
exports.isPackage = isPackage;
var isNativeImport = function (asset) {
    return !asset.packedUuids && !!asset.importUri;
};
exports.isNativeImport = isNativeImport;
var isNative = function (asset) { return !!asset.nativeVer; };
exports.isNative = isNative;
function getAssets(bundle, filter) {
    return Object.values(bundle.storage).filter(filter);
}
exports.getAssets = getAssets;
