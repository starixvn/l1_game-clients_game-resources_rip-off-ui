"use strict";
exports.__esModule = true;
exports.findAsset = exports.getAssets = exports.and = exports.isSameCtor = exports.isSamePath = exports.isNative = exports.isNativeImport = exports.isPackage = exports.isImportAsset = void 0;
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
var isSamePath = function (path) { return function (asset) {
    return asset.path === path;
}; };
exports.isSamePath = isSamePath;
var isSameCtor = function (ctor) { return function (asset) {
    return asset.ctor === ctor;
}; };
exports.isSameCtor = isSameCtor;
var and = function () {
    var conditions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        conditions[_i] = arguments[_i];
    }
    return function (asset) {
        return !conditions.map(function (execute) { return execute(asset); }).includes(false);
    };
};
exports.and = and;
function getAssets(bundle, filter) {
    return Object.values(bundle.storage).filter(filter);
}
exports.getAssets = getAssets;
function findAsset(bundle, filter) {
    return Object.values(bundle.storage).filter(filter).at(0);
}
exports.findAsset = findAsset;
