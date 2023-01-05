import { readJsonFile } from "../read-json";
import { cacheWithUuid } from "./cache-with-uuid";
import { addPackage } from "./package";
import { addPath } from "./path";
import { preprocessConfigs } from "./preprocess-config";
import { removeRedirectAssets } from "./redirect";
import { buildImportUri } from "./uri";
import { addVersion } from "./version";

export interface IConfigs {
  uuids: string[];
  paths: Record<string, string[]>;

  packs: Record<string, string[]>;

  versions: Record<"import" | "native", string[]>;

  redirect: string[];
}

export interface IAsset {
  uuid: string;

  path?: string;

  ctor?: string;

  packedUuids?: string[];

  ext?: string;

  ver?: string;

  nativeVer?: string;

  importUri?: string;

  importPath?: string;

  nativeUri?: string;

  nativePath?: string;
}

export interface IBundle {
  configs: IConfigs;

  storage: Record<string, IAsset>;

  imported: Record<string, string>;
}

export function parse(bundleUri: string): IBundle {
  const configs = readJsonFile(bundleUri);
  const pipelines = [
    preprocessConfigs,
    cacheWithUuid,
    addPath,
    addPackage,
    addVersion,
    removeRedirectAssets,
    buildImportUri,
  ];

  return pipelines.reduce((result, handle) => handle(result), configs);
}
