import { IBundle } from "./parse";

export function addPath(bundle: IBundle) {
  if (!bundle.configs.paths) {
    return;
  }

  const paths = bundle.configs.paths;
  const storage = bundle.storage;

  for (const uuid in paths) {
    const info = paths[uuid];
    const path = info[0];
    const type = info[1];
    const assetInfo = storage[uuid];

    assetInfo.path = path;
    assetInfo.ctor = type;
  }

  return bundle;
}
