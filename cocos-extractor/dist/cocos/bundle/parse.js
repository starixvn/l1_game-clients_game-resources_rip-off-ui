"use strict";
exports.__esModule = true;
exports.parse = void 0;
var read_json_1 = require("../read-json");
var cache_with_uuid_1 = require("./cache-with-uuid");
var package_1 = require("./package");
var path_1 = require("./path");
var preprocess_config_1 = require("./preprocess-config");
var redirect_1 = require("./redirect");
var uri_1 = require("./uri");
var version_1 = require("./version");
function parse(bundleUri) {
    var configs = (0, read_json_1.readJsonFile)(bundleUri);
    var pipelines = [
        preprocess_config_1.preprocessConfigs,
        cache_with_uuid_1.cacheWithUuid,
        path_1.addPath,
        package_1.addPackage,
        version_1.addVersion,
        redirect_1.removeRedirectAssets,
        uri_1.buildImportUri,
    ];
    return pipelines.reduce(function (result, handle) { return handle(result); }, configs);
}
exports.parse = parse;
