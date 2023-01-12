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
exports.download = void 0;
var path_1 = require("path");
var bundle_1 = require("./cocos/bundle");
var deserializer_1 = require("./cocos/deserializer");
var import_1 = require("./cocos/import");
var package_1 = require("./cocos/package");
var download_bundle_1 = require("./downloader/download-bundle");
var download_import_1 = require("./downloader/download-import");
var download_native_1 = require("./downloader/download-native");
function download(input) {
    return __awaiter(this, void 0, void 0, function () {
        var output, bundleUri, bundle, instance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    output = (0, path_1.join)(input.output, "raw");
                    return [4 /*yield*/, (0, download_bundle_1.downloadBundle)(input, output)];
                case 1:
                    bundleUri = _a.sent();
                    bundle = (0, bundle_1.parse)(bundleUri);
                    instance = {};
                    return [4 /*yield*/, (0, download_import_1.downloadImport)(input.uri, bundle, output)];
                case 2:
                    _a.sent();
                    (0, package_1.unpack)(bundle);
                    (0, import_1.importJsonFiles)(bundle);
                    Object.entries(bundle.imported).forEach(function (_a) {
                        var uuid = _a[0], imported = _a[1];
                        instance[uuid] = (0, deserializer_1.deserialize)(imported, {
                            asset: bundle.storage[uuid]
                        });
                    });
                    return [4 /*yield*/, (0, download_native_1.downloadNative)(input.uri, bundle, instance, output)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, { instance: instance, bundle: bundle }];
            }
        });
    });
}
exports.download = download;
