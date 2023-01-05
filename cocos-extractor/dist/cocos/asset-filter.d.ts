import { IAsset, IBundle } from "./bundle";
export declare const isImportAsset: (asset: IAsset) => boolean;
export declare const isPackage: (asset: IAsset) => boolean;
export declare const isNativeImport: (asset: IAsset) => boolean;
export declare const isNative: (asset: IAsset) => boolean;
export declare function getAssets(bundle: IBundle, filter: (asset: IAsset) => boolean): IAsset[];
