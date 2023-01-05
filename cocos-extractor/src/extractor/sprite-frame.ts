import { IAsset, IBundle } from "../cocos/bundle";
import { Instance, SpriteFrame, Texture2D } from "../instances";

export function extractSpriteFrame(bundle: IBundle, instance: Instance) {
  return function (asset: IAsset, frame: SpriteFrame, output: string) {
    if (frame.ctor !== "cc.SpriteFrame") {
      return [];
    }

    frame.texture = instance[frame._textureSetter.uuid] as Texture2D;

    return [];
  };
}
