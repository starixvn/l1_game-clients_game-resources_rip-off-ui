const { ensureDirSync, readFileSync } = require("fs-extra");
const { compilers } = require("./compilers");
const { walkDir, walk, writeFiles } = require("./fs");

const INDEXES = {
  VERSION: 0,
  SHARED_UUIDS: 1,
  SHARED_CLASSES: 3,
  SHARED_MASKS: 4,
  INSTANCES: 5,
  INSTANCE_TYPES: 6,
};

const SUPPORT_MIN_FORMAT_VERSION = 1;

function decompile(json) {
  if (
    Array.isArray(json) &&
    json[INDEXES.VERSION] >= SUPPORT_MIN_FORMAT_VERSION
  ) {
    const instances = json[INDEXES.INSTANCES];
    const classes = json[INDEXES.SHARED_CLASSES];
    const masks = json[INDEXES.SHARED_MASKS];
    const uuids = json[INDEXES.SHARED_UUIDS];

    const files = compilers.flatMap((compile) =>
      compile({ instances, classes, masks, uuids })
    );

    return files;
  }

  return [];
}

async function start(folder = "..") {
  const now = new Date();
  const defaultFolder = `${now
    .toISOString()
    .slice(0, 10)}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
  const output = `./output/${defaultFolder}`;
  ensureDirSync(output);

  const files = await walk(folder);
  const jsonFiles = files.filter((file) => file.endsWith(".json"));

  const compiledFiles = jsonFiles.flatMap((file) => {
    try {
      console.log(`Reading ${file}`);
      const metadata = JSON.parse(readFileSync(file));

      return decompile(metadata);
    } catch (error) {
      console.error(error);
      // Skip this file

      return [];
    }
  });

  writeFiles(compiledFiles, files, output);
}

start();
