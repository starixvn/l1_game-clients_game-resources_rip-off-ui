"use strict";
exports.__esModule = true;
exports.dictionary = void 0;
var index_1 = require("./index");
function dictionary(data, owner, key, value) {
    var DICT_JSON_LAYOUT = 0;
    var dict = value[DICT_JSON_LAYOUT];
    owner[key] = dict;
    for (var i = DICT_JSON_LAYOUT + 1; i < value.length; i += 3) {
        var subKey = value[i];
        var subType = value[i + 1];
        var subValue = value[i + 2];
        var op = (0, index_1.getParser)(subType);
        op(data, dict, subKey, subValue);
    }
}
exports.dictionary = dictionary;
