import { join } from "path";
import { download } from "./download";
import { extract } from "./extractor";
import { writeFile } from "./extractor/utils";
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
    extracted: join(input.output, "extracted", uri.pathname),
    data: join(input.output, "data", uri.pathname),
  };

  return result;
}

export async function start(input: IInput) {
  const { data, extracted } = buildOutputDirectory(input);
  const { bundle, instance } = await download(input);

  extract(bundle, instance, extracted);
  printStatistic(bundle, instance);

  writeFile(join(data, "instance.json"), JSON.stringify(instance, null, 2));
  writeFile(join(data, "bundle.json"), JSON.stringify(bundle, null, 2));
}
