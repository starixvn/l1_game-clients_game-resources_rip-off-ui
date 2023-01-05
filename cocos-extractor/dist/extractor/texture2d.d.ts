import { IAsset, IBundle } from "../cocos/bundle";
import { Instance, Texture2D } from "../instances";
export declare function extractTexture2D(bundle: IBundle, instance: Instance): (asset: IAsset, texture: Texture2D, output: string) => string[];
