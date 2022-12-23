const { readFileSync } = require("fs");
const { deserialize } = require("./cocos");

function audioClipBuilder(asset) {
  const { importUri, uuid, nativeVer, extracted } = asset;

  const ext = extracted._native ?? ".mp3";
  const baseUri = importUri.split("import")[0];
  const folder = uuid.slice(0, 2);
  const nativeUri = `${baseUri}native/${folder}/${uuid}.${nativeVer}${ext}`;

  asset.nativeUri = nativeUri;
  asset.path = `${asset.path}${ext}`;
}

function texture2DBuilder(asset) {
  const extnames = [
    ".png",
    ".jpg",
    ".jpeg",
    ".bmp",
    ".webp",
    ".pvr",
    ".pkm",
    ".astc",
  ];
  const { importUri, uuid, nativeVer, extracted } = asset;
  const ext = extnames[extracted.base || 0];
  const baseUri = importUri.split("import")[0];
  const folder = uuid.slice(0, 2);
  const nativeUri = `${baseUri}native/${folder}/${uuid}.${nativeVer}${ext}`;

  asset.nativeUri = nativeUri;
  asset.path = `${asset.path ?? asset.uuid}${ext}`;
}

const builders = {
  "cc.AudioClip": audioClipBuilder,
  "cc.Texture2D": texture2DBuilder,
};
const ctorCounter = {};

function executeBuilder(asset) {
  const extracted = asset.extracted;
  const builder = builders[extracted.ctor];

  builder && builder(asset);
  ctorCounter[extracted.ctor] = (ctorCounter[extracted.ctor] || 0) + 1;
}

function buildNativeUris(bundle) {
  const assets = Object.values(bundle).filter(
    (asset) => !!asset.importPath && !asset.isPack
  );
  const imported = Object.keys(bundle)
    .filter((name) => name.endsWith("@import"))
    .map((key) => ({ key, data: bundle[key] }));

  assets.forEach((asset) => {
    const importData = readFileSync(asset.importPath, "utf-8");

    try {
      const result = deserialize(importData);

      if (result) {
        asset.extracted = result;
        executeBuilder(asset);
      }
    } catch (error) {
      //console.error(error);
    }
  });

  imported.forEach(({ key, data }) => {
    try {
      const result = deserialize(data);
      const uuid = key.slice(0, key.length - "@import".length);
      const asset = bundle[uuid];

      if (result) {
        asset.extracted = result;
        executeBuilder(asset);
      }
    } catch (error) {
      //console.error(error);
    } finally {
      delete bundle[key];
    }
  });

  console.log(ctorCounter);

  return bundle;
}

module.exports = buildNativeUris;
