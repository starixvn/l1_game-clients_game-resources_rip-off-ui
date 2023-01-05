import { IBundle, IConfigs } from "./parse";

export function cacheWithUuid(configs: IConfigs): IBundle {
  if (!configs.uuids) {
    return;
  }

  const uuids = configs.uuids;
  const storage = {};

  for (let i = 0, l = uuids.length; i < l; i++) {
    const uuid = uuids[i];

    storage[uuid] = { uuid };
  }

  return { configs, storage, imported: {} };
}
