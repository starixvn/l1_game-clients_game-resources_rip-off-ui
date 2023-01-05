import { decodeUUID } from "../uuid";

export function preprocessConfigs(options: any) {
  let uuids = options.uuids;
  const paths = options.paths;
  const types = options.types;
  const bundles = options.deps;
  const realEntries = (options.paths = Object.create(null));

  for (let i = 0, l = uuids.length; i < l; i++) {
    uuids[i] = decodeUUID(uuids[i]);
  }

  for (const id in paths) {
    const entry = paths[id];
    const type = entry[1];
    entry[1] = types[type];
    realEntries[uuids[id]] = entry;
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
      options.extensionMap[ext].forEach((uuid: string, index: number) => {
        options.extensionMap[ext][index] = uuids[uuid] || uuid;
      });
    }
  }

  return options;
}
