import { join } from "path";
import { IAsset, IBundle } from "../cocos/bundle";
import { Instance, Skeleton, Texture2D } from "../instances";
import { copyFile, getPath, writeFile } from "./utils";

export function extractSkeleton(bundle: IBundle, instance: Instance) {
  return function (asset: IAsset, skeleton: Skeleton, output: string) {
    if (skeleton.ctor !== "sp.SkeletonData") {
      return [];
    }

    const name = (skeleton.textureNames[0] ?? asset.uuid).split(".")[0];
    const isUnknownSpine = !asset.path;
    const path = getPath(asset, "unknown/spine");
    const jsonFile = isUnknownSpine
      ? join(output, path, `${name}.json`)
      : join(output, `${path}.json`);
    const atlasFile = isUnknownSpine
      ? join(output, path, `${name}.atlas`)
      : join(output, `${path}.atlas`);

    writeFile(jsonFile, JSON.stringify(skeleton._skeletonJson));
    writeFile(atlasFile, skeleton._atlasText);

    isUnknownSpine &&
      skeleton.textures.forEach(({ uuid }, index) => {
        if (instance[uuid]) {
          const asset = bundle.storage[uuid];
          const texture = instance[uuid] as Texture2D;
          const destination = join(
            output,
            path,
            `${skeleton.textureNames[index]}`
          );

          texture.exported = true;
          copyFile(asset.nativePath, destination);
        }
      });

    return [asset.uuid];
  };
}
