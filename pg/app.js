const getHtml = require("./get-html");
const getCCSettings = require("./get-cc-settings");
const buildBundleUris = require("./build-bundle-uris");
const download = require("./downloader");
const { parseConfigs } = require("./cocos");
const downloadImport = require("./download-import");
const { writeFileSync, mkdirSync } = require("fs");
const buildNativeUris = require("./build-native-uris");
const downloadNative = require("./download-native");
const extractNativeFiles = require("./extract-native-file");
const unpackBundle = require("./unpack-bundle");
const { join, dirname } = require("path");
const downloadPackage = require("./download-package");

const gameUri = process.env.GAME_URI || "https://m.pgsoft-games.com";
const resourceUri =
  process.env.RESOURCE_URI || "https://static.pgsoft-games.com";
const gameId = process.env.GAME_ID || "135";

const assetsUri = `${resourceUri}/${gameId}/assets`;

getHtml(gameUri, gameId)
  .then(getCCSettings)
  .then((settings) => buildBundleUris(settings, assetsUri, gameId))
  .then((paths) => Promise.all(paths.map(download)))
  .then((paths) => paths.filter((path) => path.endsWith(".json")))
  .then((paths) => paths.map((path) => parseConfigs(path, assetsUri)))
  .then((bundles) => Promise.all(bundles.map(downloadPackage)))
  .then((bundles) => bundles.map(unpackBundle))
  .then((bundles) => Promise.all(bundles.map(downloadImport)))
  .then((bundles) => bundles.map(buildNativeUris))
  .then((bundles) => Promise.all(bundles.map(downloadNative)))
  .then((bundles) =>
    bundles.map((bundle) => extractNativeFiles(bundle, gameId))
  )
  .then((bundles) => {
    const destination = join("output", "data", `${gameId}.json`);

    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, JSON.stringify(bundles, null, 2));
  })
  .catch((error) => console.error(error));
