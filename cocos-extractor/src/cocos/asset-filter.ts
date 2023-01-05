import { IAsset, IBundle } from "./bundle";

export const isImportAsset = (asset: IAsset) => !!asset.importUri;

export const isPackage = (asset: IAsset) => !!asset.packedUuids;

export const isNativeImport = (asset: IAsset) =>
  !asset.packedUuids && !!asset.importUri;

export const isNative = (asset: IAsset) => !!asset.nativeVer;

export function getAssets(bundle: IBundle, filter: (asset: IAsset) => boolean) {
  return Object.values(bundle.storage).filter(filter);
}
