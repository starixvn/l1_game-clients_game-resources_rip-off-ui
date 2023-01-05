"use strict";
exports.__esModule = true;
exports.deserializeInstance = exports.buildCustomCCObject = exports.buildCCObject = void 0;
var constants_1 = require("../package/constants");
var classes_1 = require("./classes");
var parsers_1 = require("./parsers");
function buildCCObject(data, instance) {
    var mask = data[constants_1.SHARED_MASK][instance[0]];
    var clazz = mask[0];
    var ctor = clazz && clazz[0];
    var keys = clazz[1];
    var classTypeOffset = clazz[2];
    var maskTypeOffset = mask[mask.length - 1];
    var obj = { ctor: ctor };
    // parse simple type
    var i = 1;
    for (; i < maskTypeOffset; ++i) {
        var key = keys[mask[i]];
        obj[key] = instance[i];
    }
    // parse advanced type
    for (; i < instance.length; ++i) {
        var key = keys[mask[i]];
        var type = clazz[mask[i] + classTypeOffset];
        var parse = (0, parsers_1.getParser)(type);
        parse(data, obj, key, instance[i]);
    }
    return obj;
}
exports.buildCCObject = buildCCObject;
function buildCustomCCObject(data, ctor, value) {
    var deserialize = (0, classes_1.getClass)(ctor);
    if (deserialize) {
        return Object.assign({ ctor: ctor }, deserialize(value, data[0]));
    }
    return Object.assign({ ctor: ctor }, value);
}
exports.buildCustomCCObject = buildCustomCCObject;
function deserializeInstance(data) {
    var instances = data[constants_1.INSTANCES];
    var instanceTypes = data[constants_1.INSTANCE_TYPES];
    var instanceTypesLen = !instanceTypes ? 0 : instanceTypes.length;
    var rootIndex = instances[instances.length - 1];
    var normalObjectCount = instances.length - instanceTypesLen;
    if (typeof rootIndex !== "number") {
        rootIndex = 0;
    }
    else {
        if (rootIndex < 0) {
            rootIndex = ~rootIndex;
        }
        --normalObjectCount;
    }
    var insIndex = 0;
    for (; insIndex < normalObjectCount; ++insIndex) {
        instances[insIndex] = buildCCObject(data, instances[insIndex]);
    }
    var classes = data[3];
    for (var typeIndex = 0; typeIndex < instanceTypesLen; ++typeIndex, ++insIndex) {
        var type = instanceTypes[typeIndex];
        var eachData = instances[insIndex];
        if (type >= 0) {
            var ctor = classes[type];
            instances[insIndex] = buildCustomCCObject(data, ctor, eachData);
        }
        else {
            var op = (0, parsers_1.getParser)(~type);
            op(data, instances, insIndex, eachData);
        }
    }
    return rootIndex;
}
exports.deserializeInstance = deserializeInstance;
