"use strict";
exports.__esModule = true;
exports.getParser = void 0;
var array_1 = require("./array");
var ccclass_1 = require("./ccclass");
var custom_class_1 = require("./custom-class");
var dictionary_1 = require("./dictionary");
var inner_object_1 = require("./inner-object");
var instance_reference_1 = require("./instance-reference");
var simple_1 = require("./simple");
var trs_1 = require("./trs");
var value_type_1 = require("./value-type");
function getParser(type) {
    var _a;
    var parsers = [
        simple_1.simple,
        instance_reference_1.instanceReference,
        (0, array_1.generateArrayParser)(instance_reference_1.instanceReference),
        (0, array_1.generateArrayParser)(inner_object_1.innerObject),
        ccclass_1.ccclass,
        value_type_1.valueTypeCreated,
        inner_object_1.innerObject,
        trs_1.trs,
        value_type_1.valueType,
        (0, array_1.generateArrayParser)(ccclass_1.ccclass),
        custom_class_1.customClass,
        dictionary_1.dictionary,
        array_1.array,
    ];
    return (_a = parsers[type]) !== null && _a !== void 0 ? _a : simple_1.simple;
}
exports.getParser = getParser;
