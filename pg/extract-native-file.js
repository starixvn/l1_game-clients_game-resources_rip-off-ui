const { copyFileSync, mkdirSync, writeFileSync } = require("fs");
const { join, dirname } = require("path");

const output = join(__dirname, "output", "extracted");

function extractNativeFiles(bundle, gameId) {
  const nativeAssets = Object.values(bundle).filter(
    (asset) => !!asset.shouldExtract
  );

  nativeAssets.forEach((asset) => {
    if (asset.nativePath) {
      const destination = join(output, `${gameId}`, asset.path);

      mkdirSync(dirname(destination), { recursive: true });
      copyFileSync(asset.nativePath, destination);
    }

    if (asset.files) {
      asset.files.forEach(({ path, data }) => {
        const destination = join(output, `${gameId}`, path);

        mkdirSync(dirname(destination), { recursive: true });
        writeFileSync(destination, data);
      });
    }
  });

  return bundle;
}

module.exports = extractNativeFiles;
