"use strict";
exports.__esModule = true;
exports.printStatistic = void 0;
function printStatistic(bundle, instance) {
    var total = Object.keys(instance).length;
    var withoutExported = Object.entries(instance).filter(function (_a) {
        var _ = _a[0], value = _a[1];
        return !value.exported;
    });
    var ctors = new Set(withoutExported.map(function (_a) {
        var _ = _a[0], value = _a[1];
        return value.ctor;
    }));
    console.log("Exported: ".concat(total - withoutExported.length, "/").concat(total));
    console.log("Remaining constructors: ".concat(Array.from(ctors).join(", ")));
    delete bundle.configs;
    Object.entries(instance).forEach(function (_a) {
        var uuid = _a[0], value = _a[1];
        if (value.exported) {
            delete bundle.storage[uuid];
            delete bundle.imported[uuid];
            delete instance[uuid];
        }
    });
}
exports.printStatistic = printStatistic;
