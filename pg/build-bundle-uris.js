function buildBundleUris(ccSettings, assetsUri) {
  if (!ccSettings || !ccSettings.bundleVers) {
    return [];
  }

  return Object.keys(ccSettings.bundleVers)
    .map((bundleName) => {
      const { config, index } = ccSettings.bundleVers[bundleName];

      return [
        `${assetsUri}/${bundleName}/config.${config}.json`,
        `${assetsUri}/${bundleName}/index.${index}.js`,
      ];
    })
    .flat();
}

module.exports = buildBundleUris;
