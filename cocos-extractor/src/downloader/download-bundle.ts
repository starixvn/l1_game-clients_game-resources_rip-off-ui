import { IInput } from "../app";
import { defaultOutputPath, download } from "./downloader";

export async function downloadBundle(
  input: IInput,
  output = defaultOutputPath
) {
  const configUri = `${input.uri}/config.${input.versions.config}.json`;
  const indexUri = `${input.uri}/index.${input.versions.index}.js`;

  await download(indexUri, output);

  return download(configUri, output);
}
