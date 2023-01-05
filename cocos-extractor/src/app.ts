import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { parse } from "./cocos/bundle/parse";
import { deserialize } from "./cocos/deserializer";
import { importJsonFiles } from "./cocos/import";
import { unpack } from "./cocos/package";
import { downloadBundle } from "./downloader/download-bundle";
import { downloadImport } from "./downloader/download-import";
import { downloadNative } from "./downloader/download-native";
import { extract } from "./extractor";
import { printStatistic } from "./statistic";

export interface IInput {
  uri: string;
  output: string;
  versions: {
    config: string;
    index: string;
  };
}

function buildOutputDirectory(input: IInput) {
  const uri = new URL(input.uri);

  const result = {
    raw: join(input.output, "raw"),
    extracted: join(input.output, "extracted", uri.pathname),
    data: join(input.output, "data", uri.pathname),
  };

  Object.values(result).forEach((directory) =>
    mkdirSync(directory, { recursive: true })
  );

  return result;
}

export async function start(input: IInput) {
  const { raw, data, extracted } = buildOutputDirectory(input);
  const bundleUri = await downloadBundle(input, raw);
  const bundle = parse(bundleUri);
  const instances = {};

  await downloadImport(input.uri, bundle, raw);

  unpack(bundle);
  importJsonFiles(bundle);

  Object.entries(bundle.imported).forEach(([uuid, imported]) => {
    instances[uuid] = deserialize(imported as any, {
      asset: bundle.storage[uuid],
    });
  });

  await downloadNative(input.uri, bundle, instances, raw);

  extract(bundle, instances, extracted);
  printStatistic(bundle, instances);

  writeFileSync(
    join(data, "instance.json"),
    JSON.stringify(instances, null, 2)
  );
  writeFileSync(join(data, "bundle.json"), JSON.stringify(bundle, null, 2));
}
