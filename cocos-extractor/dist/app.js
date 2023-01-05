"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.start = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var parse_1 = require("./cocos/bundle/parse");
var deserializer_1 = require("./cocos/deserializer");
var import_1 = require("./cocos/import");
var package_1 = require("./cocos/package");
var download_bundle_1 = require("./downloader/download-bundle");
var download_import_1 = require("./downloader/download-import");
var download_native_1 = require("./downloader/download-native");
var extractor_1 = require("./extractor");
var statistic_1 = require("./statistic");
function buildOutputDirectory(input) {
    var uri = new URL(input.uri);
    var result = {
        raw: (0, path_1.join)(input.output, "raw"),
        extracted: (0, path_1.join)(input.output, "extracted", uri.pathname),
        data: (0, path_1.join)(input.output, "data", uri.pathname)
    };
    Object.values(result).forEach(function (directory) {
        return (0, fs_1.mkdirSync)(directory, { recursive: true });
    });
    return result;
}
function start(input) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, raw, data, extracted, bundleUri, bundle, instances;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = buildOutputDirectory(input), raw = _a.raw, data = _a.data, extracted = _a.extracted;
                    return [4 /*yield*/, (0, download_bundle_1.downloadBundle)(input, raw)];
                case 1:
                    bundleUri = _b.sent();
                    bundle = (0, parse_1.parse)(bundleUri);
                    instances = {};
                    return [4 /*yield*/, (0, download_import_1.downloadImport)(input.uri, bundle, raw)];
                case 2:
                    _b.sent();
                    (0, package_1.unpack)(bundle);
                    (0, import_1.importJsonFiles)(bundle);
                    Object.entries(bundle.imported).forEach(function (_a) {
                        var uuid = _a[0], imported = _a[1];
                        instances[uuid] = (0, deserializer_1.deserialize)(imported, {
                            asset: bundle.storage[uuid]
                        });
                    });
                    return [4 /*yield*/, (0, download_native_1.downloadNative)(input.uri, bundle, instances, raw)];
                case 3:
                    _b.sent();
                    (0, extractor_1.extract)(bundle, instances, extracted);
                    (0, statistic_1.printStatistic)(bundle, instances);
                    (0, fs_1.writeFileSync)((0, path_1.join)(data, "instance.json"), JSON.stringify(instances, null, 2));
                    (0, fs_1.writeFileSync)((0, path_1.join)(data, "bundle.json"), JSON.stringify(bundle, null, 2));
                    return [2 /*return*/];
            }
        });
    });
}
exports.start = start;
