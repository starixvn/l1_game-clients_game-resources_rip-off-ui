import { join } from "path";
import { IInput } from "./app";
import { parse } from "./cocos/bundle";
import { deserialize } from "./cocos/deserializer";
import { importJsonFiles } from "./cocos/import";
import { unpack } from "./cocos/package";
import { downloadBundle } from "./downloader/download-bundle";
import { downloadImport } from "./downloader/download-import";
import { downloadNative } from "./downloader/download-native";
import { Instance } from "./instances";

export async function download(input: IInput) {
  const output = join(input.output, "raw");
  const bundleUri = await downloadBundle(input, output);
  const bundle = parse(bundleUri);
  const instance: Instance = {};

  await downloadImport(input.uri, bundle, output);

  unpack(bundle);
  importJsonFiles(bundle);

  Object.entries(bundle.imported).forEach(([uuid, imported]) => {
    instance[uuid] = deserialize(imported as any, {
      asset: bundle.storage[uuid],
    });
  });

  await downloadNative(input.uri, bundle, instance, output);

  return { instance, bundle };
}
