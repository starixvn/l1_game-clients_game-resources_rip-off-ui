"use strict";
exports.__esModule = true;
exports.deserialize = void 0;
var constants_1 = require("../package/constants");
var preprocess_1 = require("../package/preprocess");
var uuid_1 = require("../uuid");
var deserialize_instance_1 = require("./deserialize-instance");
function parseResult(data) {
    var instances = data[constants_1.INSTANCES];
    var sharedStrings = data[constants_1.SHARED_STRING];
    var dependSharedUuids = data[constants_1.SHARED_UUID];
    var dependObjs = data[constants_1.DEPEND_OBJECT];
    var dependKeys = data[constants_1.DEPEND_KEYS];
    var dependUuids = data[constants_1.DEPEND_UUID_INDICES];
    for (var i = 0; i < dependObjs.length; ++i) {
        var obj = dependObjs[i];
        if (typeof obj === "number") {
            dependObjs[i] = instances[obj];
        }
        else {
            // assigned by DataTypeID.AssetRefByInnerObj or added by Details object directly in _deserialize
        }
        var key = dependKeys[i];
        if (typeof key === "number") {
            if (key >= 0) {
                key = sharedStrings[key];
            }
            else {
                key = ~key;
            }
            dependKeys[i] = key;
        }
        else {
            // added by Details object directly in _deserialize
        }
        var uuid = dependUuids[i];
        if (typeof uuid === "number") {
            dependUuids[i] = dependSharedUuids[uuid];
        }
        else {
            // added by Details object directly in _deserialize
        }
    }
    dependObjs.forEach(function (object, index) {
        var key = dependKeys[index];
        var uuid = dependUuids[index];
        object[key] = { uuid: (0, uuid_1.decodeUUID)(uuid) };
    });
}
function deserialize(data, options) {
    if (options === void 0) { options = {}; }
    var version = data[constants_1.VERSION];
    var preprocessed = false;
    options = options || {};
    if (typeof version === "object") {
        preprocessed = version.preprocessed;
        version = version.version;
    }
    if (!preprocessed) {
        (0, preprocess_1.preprocess)(data);
    }
    options.version = version;
    data[constants_1.VERSION] = options;
    var instances = data[constants_1.INSTANCES];
    var rootIndex = (0, deserialize_instance_1.deserializeInstance)(data);
    parseResult(data);
    data[0] = 1;
    return instances[rootIndex];
}
exports.deserialize = deserialize;
