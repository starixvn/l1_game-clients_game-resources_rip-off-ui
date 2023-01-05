"use strict";
exports.__esModule = true;
exports.getUuidFolder = exports.decodeUUID = void 0;
var BASE64_KEYS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var values = new Array(123);
for (var i = 0; i < 123; ++i) {
    values[i] = 64;
}
for (var i = 0; i < 64; ++i) {
    values[BASE64_KEYS.charCodeAt(i)] = i;
}
var BASE64_VALUES = values;
var HexChars = "0123456789abcdef".split("");
var template = ["", "", "", ""];
var UuidTemplate = template.concat(template, "-", template, "-", template, "-", template, "-", template, template, template);
var Indices = UuidTemplate.map(function (x, i) { return (x === "-" ? NaN : i); }).filter(isFinite);
function decodeUUID(base64) {
    var array = base64.split("@");
    var uuid = array[0];
    if (uuid.length !== 22) {
        return base64;
    }
    UuidTemplate[0] = base64[0];
    UuidTemplate[1] = base64[1];
    for (var i = 2, j = 2; i < 22; i += 2) {
        var lhs = BASE64_VALUES[base64.charCodeAt(i)];
        var rhs = BASE64_VALUES[base64.charCodeAt(i + 1)];
        UuidTemplate[Indices[j++]] = HexChars[lhs >> 2];
        UuidTemplate[Indices[j++]] = HexChars[((lhs & 3) << 2) | (rhs >> 4)];
        UuidTemplate[Indices[j++]] = HexChars[rhs & 0xf];
    }
    return base64.replace(uuid, UuidTemplate.join(""));
}
exports.decodeUUID = decodeUUID;
function getUuidFolder(uuid) {
    return uuid.slice(0, 2);
}
exports.getUuidFolder = getUuidFolder;
