"use strict";
exports.__esModule = true;
exports.customClass = void 0;
var constants_1 = require("../../package/constants");
var deserialize_instance_1 = require("../deserialize-instance");
function customClass(data, owner, key, value) {
    var ctor = data[constants_1.SHARED_CLASS][value[0]];
    owner[key] = (0, deserialize_instance_1.buildCustomCCObject)(data, ctor, value[1]);
}
exports.customClass = customClass;
