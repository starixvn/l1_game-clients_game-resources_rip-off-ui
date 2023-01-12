import { copyFileSync, mkdirSync, writeFileSync } from "fs";
import { dirname } from "path";
import { IAsset } from "../cocos/bundle";

export function getPath(asset: IAsset, unknownPrefix = "unknown") {
  return asset?.path ?? `${unknownPrefix}/${asset.uuid}`;
}

export function copyFile(from: string, to: string) {
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
}

export function writeFile(to: string, data: string) {
  mkdirSync(dirname(to), { recursive: true });
  writeFileSync(to, data);
}
