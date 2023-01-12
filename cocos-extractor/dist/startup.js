"use strict";
exports.__esModule = true;
var path_1 = require("path");
var app_1 = require("./app");
var input = {
    output: (0, path_1.join)(__dirname, "..", "output"),
    uri: "https://static.pgsoft-games.com/119/assets/resources",
    versions: { config: "6be3d", index: "e1dc8" }
};
(0, app_1.start)(input);
