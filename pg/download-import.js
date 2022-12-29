const download = require("./downloader");

async function downloadImport(bundle) {
  const hasImportUri = (config) => !!config.importUri && !config.isPack;

  await Promise.all(
    Object.values(bundle)
      .filter(hasImportUri)
      .map(async (config) => {
        const uri = await download(config.importUri);

        config.importPath = uri;

        return config;
      })
  );

  return bundle;
}

module.exports = downloadImport;
