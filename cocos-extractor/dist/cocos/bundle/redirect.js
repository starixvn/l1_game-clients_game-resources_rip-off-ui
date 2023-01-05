"use strict";
exports.__esModule = true;
exports.removeRedirectAssets = void 0;
function removeRedirectAssets(bundle) {
    if (!bundle.configs.redirect) {
        return;
    }
    var redirect = bundle.configs.redirect;
    var storage = bundle.storage;
    for (var i = 0, l = redirect.length; i < l; i += 2) {
        var uuid = redirect[i];
        delete storage[uuid];
    }
    return bundle;
}
exports.removeRedirectAssets = removeRedirectAssets;
