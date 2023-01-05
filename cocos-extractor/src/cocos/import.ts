import { getAssets, isNativeImport } from "./asset-filter";
import { IBundle } from "./bundle";
import { readJsonFile } from "./read-json";

export function importJsonFiles(bundle: IBundle) {
  const assets = getAssets(bundle, isNativeImport);

  assets.forEach((asset) => {
    bundle.imported[asset.uuid] = readJsonFile(asset.importPath);
  });

  return bundle;
}
