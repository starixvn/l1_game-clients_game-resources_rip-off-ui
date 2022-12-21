const getHtml = require("./get-html");
const getCCSettings = require("./get-cc-settings");
const buildBundleUris = require("./build-bundle-uris");
const download = require("./downloader");
const { parseConfigs } = require("./cocos");
const downloadImport = require("./download-import");
const { writeFileSync } = require("fs");

const gameUri = process.env.GAME_URI || "https://m.pgsoft-games.com";
const resourceUri =
  process.env.RESOURCE_URI || "https://static.pgsoft-games.com";
const gameId = process.env.GAME_ID || 29;

const assetsUri = `${resourceUri}/${gameId}/assets`;

getHtml(gameUri, gameId)
  .then(getCCSettings)
  .then((settings) => buildBundleUris(settings, assetsUri, gameId))
  .then((paths) => Promise.all(paths.map(download)))
  .then((paths) => paths.filter((path) => path.endsWith(".json")))
  .then((paths) => paths.map((path) => parseConfigs(path, assetsUri)))
  .then((bundles) => Promise.all(bundles.map(downloadImport)))
  .then((bundles) =>
    writeFileSync("data.json", JSON.stringify(bundles, null, 2))
  );
