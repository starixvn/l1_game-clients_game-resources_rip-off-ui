import { IInput, start } from "cocos-extractor";
import { download } from "cocos-extractor/dist/downloader/downloader";
import { join } from "path";
import { gameIds } from "./gameIds";
import { CCSettings, getCCSettings } from "./get-cc-settings";

const LOBBY_URL = "https://m.pgsoft-games.com";
const RESOURCE_URI = "https://static.pgsoft-games.com";

function buildInputs(
  settings: CCSettings,
  gameId: number,
  output: string
): IInput[] {
  return Object.entries(settings.bundleVers).map(([name, versions]) => ({
    uri: `${RESOURCE_URI}/${gameId}/assets/${name}`,
    versions,
    output,
  }));
}

async function startGame(gameId: number) {
  const output = join(__dirname, "output");

  const indexFile = `${LOBBY_URL}/${gameId}/index.html`;
  const indexOutput = join(output, "raw");
  const indexPath = await download(indexFile, indexOutput);
  const ccSettings = getCCSettings(indexPath);

  const inputs = buildInputs(ccSettings, gameId, output);

  for (const input of inputs) {
    console.log(input);
    await start(input);
  }
}

async function startCrawlPG() {
  for (const id of gameIds) {
    await startGame(id);
  }
}

startCrawlPG();
