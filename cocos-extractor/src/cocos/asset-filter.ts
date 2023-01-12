import { IAsset, IBundle } from "./bundle";

export const isImportAsset = (asset: IAsset) => !!asset.importUri;

export const isPackage = (asset: IAsset) => !!asset.packedUuids;

export const isNativeImport = (asset: IAsset) =>
  !asset.packedUuids && !!asset.importUri;

export const isNative = (asset: IAsset) => !!asset.nativeVer;

export const isSamePath = (path: string) => (asset: IAsset) =>
  asset.path === path;

export const isSameCtor = (ctor: string) => (asset: IAsset) =>
  asset.ctor === ctor;

export const and =
  (...conditions: ((asset: IAsset) => boolean)[]) =>
  (asset: IAsset) =>
    !conditions.map((execute) => execute(asset)).includes(false);

export function getAssets(bundle: IBundle, filter: (asset: IAsset) => boolean) {
  return Object.values(bundle.storage).filter(filter);
}

export function findAsset(bundle: IBundle, filter: (asset: IAsset) => boolean) {
  return Object.values(bundle.storage).filter(filter).at(0);
}
