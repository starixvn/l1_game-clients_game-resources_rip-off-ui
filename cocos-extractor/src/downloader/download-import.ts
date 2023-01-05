import { getAssets, isImportAsset } from "../cocos/asset-filter";
import { IAsset, IBundle } from "../cocos/bundle";
import { defaultOutputPath, download } from "./downloader";

async function downloadSingleAsset(uri: string, asset: IAsset, output: string) {
  const assetUri = `${uri}/${asset.importUri}`;

  const destination = await download(assetUri, output);

  asset.importPath = destination;
}

export async function downloadImport(
  uri: string,
  bundle: IBundle,
  output = defaultOutputPath
) {
  const assets = getAssets(bundle, isImportAsset);

  for (const asset of assets) {
    await downloadSingleAsset(uri, asset, output);
  }
}
