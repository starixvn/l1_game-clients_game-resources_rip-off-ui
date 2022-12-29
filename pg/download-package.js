const download = require("./downloader");

async function downloadPackage(bundle) {
  const isPackage = (config) => !!config.importUri && config.isPack;

  await Promise.all(
    Object.values(bundle)
      .filter(isPackage)
      .map(async (config) => {
        const uri = await download(config.importUri);

        config.importPath = uri;

        return config;
      })
  );

  return bundle;
}

module.exports = downloadPackage;
