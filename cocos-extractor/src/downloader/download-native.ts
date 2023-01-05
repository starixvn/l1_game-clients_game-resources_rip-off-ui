import { getAssets, isNative } from "../cocos/asset-filter";
import { IAsset, IBundle } from "../cocos/bundle";
import { BaseInstance, Instance } from "../instances";
import { defaultOutputPath, download } from "./downloader";

async function downloadSingleAsset(
  uri: string,
  asset: IAsset,
  instance: BaseInstance,
  output: string
) {
  const assetUri = `${uri}/${asset.nativeUri}${instance._native}`;

  const destination = await download(assetUri, output);

  asset.nativePath = destination;
}

export async function downloadNative(
  uri: string,
  bundle: IBundle,
  instance: Instance,
  output = defaultOutputPath
) {
  const assets = getAssets(bundle, isNative);

  await Promise.all(
    assets.map((asset) =>
      downloadSingleAsset(uri, asset, instance[asset.uuid], output)
    )
  );
}
