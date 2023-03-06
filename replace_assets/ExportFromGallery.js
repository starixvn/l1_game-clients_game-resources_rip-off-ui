const glob = require("glob");
const fse = require("fs-extra");
const plist = require("plist");
const path = require("path");
const { renameFilePlist } = require("./utils");

const config = {
  output: "C:/Users/eros.pham/Desktop/export/",
  gallery: "D:/SlotCollection/",

  data: {
    symbol_spines: {
      0: "symbols/106/symbol-0",
      1: "symbols/106/symbol-1",
      2: "symbols/106/symbol-10",
      3: "symbols/106/symbol-11",
      4: "symbols/106/symbol-12",
      5: "symbols/106/symbol-2",
      6: "symbols/106/symbol-3",
      7: "symbols/106/symbol-4",
      8: "symbols/106/symbol-5",
      9: "symbols/106/symbol-6",
      10: "symbols/106/symbol-7",
      11: "symbols/101/symbol-8",
    },
    symbol_images: {
      0: "letter-symbols/128/symbol-0",
      1: "letter-symbols/128/symbol-1",
      2: "letter-symbols/128/symbol-2",
      3: "letter-symbols/128/symbol-3",
    },
    winning_effect: "winning-animations/winning-effect-47",
    spin_button: "spin-buttons/2/bttn-spin",
    pay_line: "paylines/pack3/",
    audio: "audios/33 - Audition/",
  },
};

const { output, gallery, data } = config;
const resourcePath = `${gallery}/assets/resources/`;

exportSymbolSpines();
exportSymbolImages();
exportWinningEffect();
exportSpinButton();
exportAudio();
exportPaylines();

function exportPaylines() {
  const { pay_line } = data;
  const dataOutput = `${output}/pay_line/`;
  const path = pay_line;

  const files = ["line-glow.png", "line-normal.png"];
  for (const file of files) {
    fse.copySync(`${resourcePath}${path}${file}`, `${dataOutput}${file}`, {
      overwrite: true,
    });
  }
}

function exportSpinButton() {
  const dataOutput = `${output}/spin_button/`;
  const path = data.spin_button;
  const lastSplitor = path.lastIndexOf("/") + 1;
  const folder = path.slice(0, lastSplitor);
  const newName = `btn-spin`;

  const jsonFileName = `${resourcePath}${path}.json`;
  const atlasFileName = `${resourcePath}${path}.atlas`;
  const atlasData = fse.readFileSync(atlasFileName, { encoding: "utf8" });
  const textureFileNames = atlasData.match(/.+(.jpg|.png)$/gm);

  const packOutput = `${dataOutput}`;
  fse.copySync(jsonFileName, `${packOutput}${newName}.json`, {
    overwrite: true,
  });
  fse.copySync(atlasFileName, `${packOutput}${newName}.atlas`, {
    overwrite: true,
  });
  for (const texture of textureFileNames) {
    fse.copySync(
      `${resourcePath}${folder}/${texture}`,
      `${packOutput}${texture}`,
      {
        overwrite: true,
      }
    );
  }
}
function exportWinningEffect() {
  const { winning_effect } = data;
  const dataOutput = `${output}/winning_effect/`;
  const newName = "winning_effect";
  for (const ext of [".jpg", ".plist", ".png"]) {
    const fileName = `${resourcePath}${winning_effect}${ext}`;
    try {
      fse.copySync(fileName, `${dataOutput}${newName}${ext}`, {
        overwrite: true,
      });
    } catch (e) {}
  }

  renameFilePlist(`${dataOutput}${newName}`, newName);
}
function exportAudio() {
  const { audio } = data;
  if (audio.length) {
    const dataOutput = `${output}/audio/`;
    fse.copySync(`${resourcePath}${audio}`, dataOutput);
  }
}

function exportSymbolImages() {
  const { symbol_images } = data;
  const dataOutput = `${output}/symbol_images/`;
  for (const key of Object.keys(symbol_images)) {
    const path = symbol_images[key];
    const newName = `symbol-${key}`;

    const fileName = `${resourcePath}${path}.png`;
    fse.copySync(fileName, `${dataOutput}${newName}.png`, {
      overwrite: true,
    });
  }
}
function exportSymbolSpines() {
  const { symbol_spines } = data;
  const dataOutput = `${output}/symbol_spines/`;
  for (const key of Object.keys(symbol_spines)) {
    const path = symbol_spines[key];
    const lastSplitor = path.lastIndexOf("/") + 1;
    const folder = path.slice(0, lastSplitor);
    const packName = folder.substring(folder.indexOf("/") + 1);
    const newName = `symbol-${key}`;

    const jsonFileName = `${resourcePath}${path}.json`;
    const atlasFileName = `${resourcePath}${path}.atlas`;
    const atlasData = fse.readFileSync(atlasFileName, { encoding: "utf8" });
    const textureFileNames = atlasData.match(/.+(.jpg|.png)$/gm);

    const packOutput = `${dataOutput}${packName}/`;
    fse.copySync(jsonFileName, `${packOutput}${newName}.json`, {
      overwrite: true,
    });
    fse.copySync(atlasFileName, `${packOutput}${newName}.atlas`, {
      overwrite: true,
    });
    for (const texture of textureFileNames) {
      fse.copySync(
        `${resourcePath}${folder}/${texture}`,
        `${packOutput}${texture}`,
        {
          overwrite: true,
        }
      );
    }
  }
}
