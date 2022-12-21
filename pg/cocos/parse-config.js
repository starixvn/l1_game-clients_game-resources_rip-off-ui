const decodeUuid = require("./decode-uuid");
const { readFileSync } = require("fs");

/**
 * @param {IConfigOption} options
 */
function standardizeOptions(options) {
  let uuids = options.uuids;
  const paths = options.paths;
  const types = options.types;
  const bundles = options.deps;

  options.paths = null;

  for (let i = 0, l = uuids.length; i < l; i++) {
    uuids[i] = decodeUuid(uuids[i]);
  }

  for (const id in paths) {
    const entry = paths[id];
    const type = entry[1];
    entry[1] = types[type];
  }

  const scenes = options.scenes;
  for (const name in scenes) {
    const uuid = scenes[name];
    scenes[name] = uuids[uuid];
  }

  const packs = options.packs;
  for (const packId in packs) {
    const packedIds = packs[packId];
    for (let j = 0; j < packedIds.length; ++j) {
      packedIds[j] = uuids[packedIds[j]];
    }
  }

  const versions = options.versions;
  if (versions) {
    for (const folder in versions) {
      const entries = versions[folder];
      for (let i = 0; i < entries.length; i += 2) {
        const uuid = entries[i];
        entries[i] = uuids[uuid] || uuid;
      }
    }
  }

  const redirect = options.redirect;
  if (redirect) {
    for (let i = 0; i < redirect.length; i += 2) {
      redirect[i] = uuids[redirect[i]];
      redirect[i + 1] = bundles[redirect[i + 1]];
    }
  }

  const extensionMap = options.extensionMap;
  if (extensionMap) {
    for (const ext in options.extensionMap) {
      if (!Object.prototype.hasOwnProperty.call(options.extensionMap, ext)) {
        continue;
      }
      options.extensionMap[ext].forEach((uuid, index) => {
        options.extensionMap[ext][index] = uuids[uuid] || uuid;
      });
    }
  }
}

function initUuid(uuids, storage) {
  if (!uuids) {
    return;
  }

  for (let i = 0, l = uuids.length; i < l; i++) {
    const uuid = uuids[i];

    storage[uuid] = { uuid };
  }
}

function initPath(paths, storage) {
  if (!paths) {
    return;
  }

  for (const uuid in paths) {
    const info = paths[uuid];
    const path = info[0];
    const type = info[1];
    const assetInfo = storage[uuid];

    assetInfo.path = path;
    assetInfo.ctor = type;
  }
}

function initPackage(packages, storage) {
  if (!packages) {
    return;
  }

  for (const packUuid in packages) {
    const uuids = packages[packUuid];
    const pack = { uuid: packUuid, packedUuids: uuids, ext: ".json" };

    storage[packUuid] = pack;
  }
}

function initVersion(versions, storage) {
  if (!versions) {
    return;
  }

  let entries = versions.import;

  if (entries) {
    for (let i = 0, l = entries.length; i < l; i += 2) {
      const uuid = entries[i];
      const assetInfo = storage[uuid];
      assetInfo.ver = entries[i + 1];
    }
  }

  entries = versions.native;

  if (entries) {
    for (let i = 0, l = entries.length; i < l; i += 2) {
      const uuid = entries[i];
      const assetInfo = storage[uuid];
      assetInfo.nativeVer = entries[i + 1];
    }
  }
}

function initRedirect(redirect, storage) {
  if (!redirect) {
    return;
  }

  for (let i = 0, l = redirect.length; i < l; i += 2) {
    const uuid = redirect[i];
    const assetInfo = storage[uuid];
    assetInfo.redirect = redirect[i + 1];
  }
}

function initUris(assetsUri, configs, storage) {
  if (!configs) {
    return;
  }

  const uuids = Object.keys(storage);
  const name = configs.name;

  for (let i = 0, l = uuids.length; i < l; i++) {
    const uuid = uuids[i];
    const assetInfo = storage[uuid];

    if (assetInfo.ver) {
      const ext = assetInfo.ext ?? ".json";
      const folder = uuid.slice(0, 2);
      const version = assetInfo.ver;
      const uri = `${assetsUri}/${name}/import/${folder}/${uuid}.${version}${ext}`;

      assetInfo.importUri = uri;
    }
  }
}

function cleanStorage(storage) {
  const uuids = Object.keys(storage);

  for (let i = 0, l = uuids.length; i < l; i++) {
    const uuid = uuids[i];
    const assetInfo = storage[uuid];

    if (!assetInfo.ver && !assetInfo.nativeVer) {
      delete storage[uuid];
    }

    if (assetInfo.packUuids) {
      const packUuids = assetInfo.packUuids;

      assetInfo.packUuids = packUuids.filter((id) => !storage[id]);
    }
  }
}

function parseConfig(filePath, assetsUri) {
  const configInString = readFileSync(filePath, "utf-8");
  const configs = JSON.parse(configInString);

  const storage = {};

  standardizeOptions(configs);
  initUuid(configs.uuids, storage);
  initPath(configs.paths, storage);
  initPackage(configs.packs, storage);
  initVersion(configs.versions, storage);
  initRedirect(configs.redirect, storage);
  initUris(assetsUri, configs, storage);
  cleanStorage(storage);

  return storage;
}

module.exports = parseConfig;
