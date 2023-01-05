import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { IAsset, IBundle } from "../cocos/bundle";
import { Instance, Skeleton } from "../instances";
import { getPath } from "./utils";

export function extractSkeleton(bundle: IBundle, instance: Instance) {
  return function (asset: IAsset, skeleton: Skeleton, output: string) {
    if (skeleton.ctor !== "sp.SkeletonData") {
      return [];
    }

    const path = getPath(asset, "unknown/spine");
    const jsonFile = join(output, `${path}.json`);
    const atlasFile = join(output, `${path}.atlas`);

    mkdirSync(dirname(jsonFile), { recursive: true });

    writeFileSync(jsonFile, JSON.stringify(skeleton._skeletonJson));
    writeFileSync(atlasFile, skeleton._atlasText);

    return [asset.uuid];
  };
}
