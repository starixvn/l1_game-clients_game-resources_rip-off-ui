import { IBundle } from "./parse";

export function addVersion(bundle: IBundle) {
  if (!bundle.configs.versions) {
    return;
  }

  const versions = bundle.configs.versions;
  const storage = bundle.storage;
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

  return bundle;
}
