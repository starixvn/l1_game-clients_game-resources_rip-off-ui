"use strict";
exports.__esModule = true;
exports.array = exports.generateArrayParser = void 0;
var _1 = require(".");
function generateArrayParser(parser) {
    return function (data, owner, key, value) {
        for (var i = 0; i < value.length; ++i) {
            parser(data, value, i, value[i]);
        }
        owner[key] = value;
    };
}
exports.generateArrayParser = generateArrayParser;
function array(data, owner, key, value) {
    var ARRAY_ITEM_VALUES = 0;
    var array = value[ARRAY_ITEM_VALUES];
    for (var i = 0; i < array.length; ++i) {
        var subValue = array[i];
        var type = value[i + 1];
        if (type !== 0) {
            var op = (0, _1.getParser)(type);
            op(data, array, i, subValue);
        }
    }
    owner[key] = array;
}
exports.array = array;
