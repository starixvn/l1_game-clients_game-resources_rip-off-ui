const download = require("./downloader");

async function downloadNative(bundle) {
  const hasNativeUri = (config) => !!config.nativeUri;

  await Promise.all(
    Object.values(bundle)
      .filter(hasNativeUri)
      .map(async (config) => {
        const uri = await download(config.nativeUri);

        config.nativePath = uri;

        return config;
      })
  );

  return bundle;
}

module.exports = downloadNative;
