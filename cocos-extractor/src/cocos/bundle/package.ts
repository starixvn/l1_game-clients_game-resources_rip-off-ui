import { IBundle } from "./parse";

export function addPackage(bundle: IBundle) {
  if (!bundle.configs.packs) {
    return;
  }

  const packages = bundle.configs.packs;
  const storage = bundle.storage;

  for (const packUuid in packages) {
    const uuids = packages[packUuid];
    const pack = {
      uuid: packUuid,
      packedUuids: uuids,
      ext: ".json",
    };

    storage[packUuid] = pack;
  }

  return bundle;
}
