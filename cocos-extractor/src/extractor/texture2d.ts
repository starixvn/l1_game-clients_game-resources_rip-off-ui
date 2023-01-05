import { copyFileSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { IAsset, IBundle } from "../cocos/bundle";
import { Instance, SpriteFrame, Texture2D } from "../instances";
import { buildPlist } from "./build-plist";
import { getPath } from "./utils";

function copyTexture(
  texture: Texture2D,
  asset: IAsset,
  output: string,
  unknownPrefix = "unknown"
) {
  const path = getPath(asset, unknownPrefix);
  const destination = join(output, `${path}${texture._native}`);

  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(asset.nativePath, destination);
}

export function extractTexture2D(bundle: IBundle, instance: Instance) {
  return function (asset: IAsset, texture: Texture2D, output: string) {
    if (texture.ctor !== "cc.Texture2D") {
      return [];
    }

    if (!!asset.path) {
      copyTexture(texture, asset, output);

      return [asset.uuid];
    } else {
      const entries = Object.entries(instance).filter(
        ([_, value]) =>
          value.ctor === "cc.SpriteFrame" &&
          (value as SpriteFrame)._textureSetter.uuid === asset.uuid
      );

      // Custom Plist
      if (entries.length !== 0) {
        const uuids = entries.map(([uuid]) => uuid);

        const folder = "unknown/atlas";
        const path = getPath(asset, folder);

        const textureName = `${asset.uuid}${texture._native}`;
        const frames = entries.map(([_, frame]) => frame);
        const plist = buildPlist(textureName, frames as SpriteFrame[]);
        const plistDestination = join(output, `${path}.plist`);

        copyTexture(texture, asset, output, folder);
        writeFileSync(plistDestination, plist);

        return [asset.uuid, ...uuids];
      } else {
        // Unknown textures
        copyTexture(texture, asset, output, "unknown/images");

        return [asset.uuid];
      }
    }
  };
}
