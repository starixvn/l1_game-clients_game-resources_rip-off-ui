import { IAsset, IBundle } from "../cocos/bundle";
import { Instance, SpriteFrame } from "../instances";
export declare function extractSpriteFrame(bundle: IBundle, instance: Instance): (asset: IAsset, frame: SpriteFrame, output: string) => any[];
