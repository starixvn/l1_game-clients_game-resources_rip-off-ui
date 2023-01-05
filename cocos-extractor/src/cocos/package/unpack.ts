import { getAssets, isPackage } from "../asset-filter";
import { IBundle } from "../bundle";
import { readJsonFile } from "../read-json";
import { unpackArray } from "./array";
import { unpackTexture2D } from "./texture2d";

export function unpack(bundle: IBundle) {
  const packages = getAssets(bundle, isPackage);

  packages.forEach((pack) => {
    const json = readJsonFile(pack.importPath);
    let sections = [];

    if (Array.isArray(json)) {
      sections = unpackArray(json);
    } else {
      if (!json.type || !json.data) {
        return;
      }

      if (json.type === "cc.Texture2D") {
        sections = unpackTexture2D(json);
      } else if (json.type === "cc.ImageAsset") {
        console.warn("TODO: cc.ImageAsset");
      }
    }

    for (let i = 0; i < pack.packedUuids.length; i++) {
      const uuid = pack.packedUuids[i];

      bundle.imported[uuid] = sections[i];
    }
  });
}
