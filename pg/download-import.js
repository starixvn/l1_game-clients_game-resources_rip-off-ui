const download = require("./downloader");

async function downloadImport(bundle) {
  const downloaded = await Promise.all(
    Object.values(bundle)
      .filter((config) => !!config.importUri)
      .map((config) => download(config.importUri))
  );

  return { downloaded, bundle };
}

module.exports = downloadImport;
