import { getUuidFolder } from "../uuid";
import { IBundle } from "./parse";

export function buildImportUri(bundle: IBundle) {
  if (!bundle?.storage) {
    return;
  }
  const uuids = Object.keys(bundle.storage);
  const storage = bundle.storage;

  for (let i = 0, l = uuids.length; i < l; i++) {
    const uuid = uuids[i];
    const assetInfo = storage[uuid];

    if (assetInfo?.ver) {
      const extension = assetInfo.ext ?? ".json";
      const folder = getUuidFolder(uuid);
      const version = assetInfo.ver;

      const uri = `import/${folder}/${uuid}.${version}${extension}`;

      assetInfo.importUri = uri;
    }

    if (assetInfo?.nativeVer) {
      const folder = getUuidFolder(uuid);
      const version = assetInfo.nativeVer;

      const uri = `native/${folder}/${uuid}.${version}`;

      assetInfo.nativeUri = uri;
    }
  }

  return bundle;
}
