import { IAsset } from "../cocos/bundle";

export function getPath(asset: IAsset, unknownPrefix = "unknown") {
  return asset?.path ?? `${unknownPrefix}/${asset.uuid}`;
}
