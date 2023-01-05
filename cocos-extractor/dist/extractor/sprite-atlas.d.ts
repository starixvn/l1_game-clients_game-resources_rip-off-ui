import { IAsset, IBundle } from "../cocos/bundle";
import { Instance, SpriteAtlas } from "../instances";
export declare function extractSpriteAtlas(bundle: IBundle, instance: Instance): (asset: IAsset, spriteAtlas: SpriteAtlas, output: string) => any[];
