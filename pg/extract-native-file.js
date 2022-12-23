const { copyFileSync, mkdirSync } = require("fs");
const { join, dirname } = require("path");

const output = join(__dirname, "output", "extracted");

function extractNativeFiles(bundle, gameId) {
  const nativeAssets = Object.values(bundle).filter(
    (asset) => !!asset.nativePath
  );

  nativeAssets.forEach((asset) => {
    const destination = join(output, `${gameId}`, asset.path);

    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(asset.nativePath, destination);
  });

  return bundle;
}

module.exports = extractNativeFiles;
