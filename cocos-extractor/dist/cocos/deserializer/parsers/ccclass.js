"use strict";
exports.__esModule = true;
exports.ccclass = void 0;
var deserialize_instance_1 = require("../deserialize-instance");
function ccclass(data, owner, key, value) {
    owner[key] = (0, deserialize_instance_1.buildCCObject)(data, value);
}
exports.ccclass = ccclass;
