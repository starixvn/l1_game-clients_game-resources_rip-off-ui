"use strict";
exports.__esModule = true;
exports.preprocessConfigs = void 0;
var uuid_1 = require("../uuid");
function preprocessConfigs(options) {
    var uuids = options.uuids;
    var paths = options.paths;
    var types = options.types;
    var bundles = options.deps;
    var realEntries = (options.paths = Object.create(null));
    for (var i = 0, l = uuids.length; i < l; i++) {
        uuids[i] = (0, uuid_1.decodeUUID)(uuids[i]);
    }
    for (var id in paths) {
        var entry = paths[id];
        var type = entry[1];
        entry[1] = types[type];
        realEntries[uuids[id]] = entry;
    }
    var scenes = options.scenes;
    for (var name_1 in scenes) {
        var uuid = scenes[name_1];
        scenes[name_1] = uuids[uuid];
    }
    var packs = options.packs;
    for (var packId in packs) {
        var packedIds = packs[packId];
        for (var j = 0; j < packedIds.length; ++j) {
            packedIds[j] = uuids[packedIds[j]];
        }
    }
    var versions = options.versions;
    if (versions) {
        for (var folder in versions) {
            var entries = versions[folder];
            for (var i = 0; i < entries.length; i += 2) {
                var uuid = entries[i];
                entries[i] = uuids[uuid] || uuid;
            }
        }
    }
    var redirect = options.redirect;
    if (redirect) {
        for (var i = 0; i < redirect.length; i += 2) {
            redirect[i] = uuids[redirect[i]];
            redirect[i + 1] = bundles[redirect[i + 1]];
        }
    }
    var extensionMap = options.extensionMap;
    if (extensionMap) {
        var _loop_1 = function (ext) {
            if (!Object.prototype.hasOwnProperty.call(options.extensionMap, ext)) {
                return "continue";
            }
            options.extensionMap[ext].forEach(function (uuid, index) {
                options.extensionMap[ext][index] = uuids[uuid] || uuid;
            });
        };
        for (var ext in options.extensionMap) {
            _loop_1(ext);
        }
    }
    return options;
}
exports.preprocessConfigs = preprocessConfigs;
