import { IAsset, IBundle } from "../cocos/bundle";
import { BaseInstance, Instance } from "../instances";
import { extractAudioClip } from "./audio-clip";
import { extractSkeleton } from "./skeleton";
import { extractSpriteAtlas } from "./sprite-atlas";
import { extractSpriteFrame } from "./sprite-frame";
import { extractTexture2D } from "./texture2d";

function skipInstances(asset: IAsset, texture: BaseInstance) {
  const skipCtors = ["cc.Prefab", "cc.SceneAsset"];

  if (skipCtors.includes(texture.ctor)) {
    return [asset.uuid];
  }

  return [];
}

function executePipeline(bundle: IBundle, instance: Instance, output: string) {
  return function ([uuid, base]: [string, BaseInstance]) {
    const pipelines = [
      extractSpriteFrame(bundle, instance),
      extractSpriteAtlas(bundle, instance),
      extractAudioClip(bundle, instance),
      extractSkeleton(bundle, instance),
      extractTexture2D(bundle, instance),
      skipInstances,
    ];
    const asset = bundle.storage[uuid];

    return pipelines
      .map((execute) => execute(asset, base as any, output))
      .flat();
  };
}

export function extract(bundle: IBundle, instance: Instance, output: string) {
  const uuids = Object.entries(instance)
    .map(executePipeline(bundle, instance, output))
    .flat();

  uuids.forEach((uuid) => (instance[uuid].exported = true));
}
