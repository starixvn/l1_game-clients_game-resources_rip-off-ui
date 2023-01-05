import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { IAsset, IBundle } from "../cocos/bundle";
import { Instance, SpriteAtlas, SpriteFrame } from "../instances";
import { buildPlist } from "./build-plist";
import { getPath } from "./utils";

function reference(spriteAtlas: SpriteAtlas, instance: Instance) {
  return Object.keys(spriteAtlas._spriteFrames).map((key) => {
    const { uuid } = spriteAtlas._spriteFrames[key];

    const frame = instance[uuid] as SpriteFrame;
    spriteAtlas._spriteFrames[key] = frame;

    return uuid;
  });
}

export function extractSpriteAtlas(bundle: IBundle, instance: Instance) {
  return function (asset: IAsset, spriteAtlas: SpriteAtlas, output: string) {
    if (spriteAtlas.ctor !== "cc.SpriteAtlas") {
      return [];
    }

    const path = getPath(asset);
    const destination = join(output, `${path}.plist`);
    const uuids = reference(spriteAtlas, instance);
    const textureAsset = Object.values(bundle.storage).find(
      (asset) => asset.path === path
    );
    const textureInstance = textureAsset ? instance[textureAsset.uuid] : null;

    const frames = Object.values(spriteAtlas._spriteFrames);
    const textureName =
      spriteAtlas._name.split(".")[0] + (textureInstance?._native ?? ".png");

    const plist = buildPlist(textureName, frames);

    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, plist);

    return [asset.uuid, ...uuids];
  };
}
