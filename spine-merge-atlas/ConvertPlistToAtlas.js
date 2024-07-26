const fse = require("fs-extra");
const plist = require("plist");

// const inputFolder = "D:/working/Luminet/rip-off-ui/spine-merge-atlas";
const inputFolder = "D:/0_tool_UI/rip-off-ui/spine-merge-atlas";
const config = {
  atlasFile: `${inputFolder}/assets/atlas/symbol-10.atlas`,
  plistFile: `${inputFolder}/assets/plist/optimize-multiplier.plist`,
};

const { atlasFile, plistFile } = config;
let coordinatePlistArr;
let metaDataImage;

readFilePlist();
updateFileAtlas();

function readFilePlist() {
  const fileData = fse.readFileSync(plistFile, "utf8");
  const plistData = plist.parse(fileData);
  coordinatePlistArr = plistData.frames;
  metaDataImage = plistData.metadata;
}

function formatTextRect(textRect) {
  const textRectArr = textRect.split(",");
  return `${textRectArr[0].replace("{{", "")}, ${textRectArr[1].replace(
    "}",
    ""
  )}`;
}

function formatPropertiesImage(propertiesValue, rotation = false) {
  const trimString = propertiesValue.replace("{", "").replace("}", "");
  const textRectArr = trimString.split(",");

  return `${textRectArr[rotation ? 1 : 0]}, ${textRectArr[rotation ? 0 : 1]}`;
}

async function updateFileAtlas() {
  const data = fse.readFileSync(atlasFile, "utf-8");
  const outputPath = `${inputFolder}/output/symbol-10.atlas`;
  // const outputPath = `D:/L1_client/assets/ztest/output/symbol-10.atlas`;
  let outputData = "";
  let imgObj = {};
  let curFrame = "";
  data.split(/\r?\n/).forEach((line, index) => {
    if (index === 1) {
      outputData += `${metaDataImage.textureFileName}\n`;
    } else if (index === 2) {
      outputData += `size: ${formatPropertiesImage(metaDataImage.size)}\n`;
    } else {
      if ((index + 1) % 7 === 0) {
        curFrame = `${line}.png`;
        imgObj = coordinatePlistArr[curFrame];
      } else if (imgObj && line.includes("rotate")) {
        line = `  rotate: ${imgObj.textureRotated}`;
      } else if (line.includes("xy") && imgObj) {
        line = `  xy: ${formatTextRect(imgObj.textureRect)}`;
      } else if (imgObj && line.includes("size") && index > 7) {
        line = `  size: ${formatPropertiesImage(imgObj.spriteSize)}`;
      } else if (imgObj && line.includes("orig")) {
        line = `  orig: ${formatPropertiesImage(imgObj.spriteSourceSize)}`;
      } else if (imgObj && line.includes("offset")) {
        // line = `  offset: ${formatPropertiesImage(imgObj.spriteOffset)}`;
      }

      outputData += `${line}\n`;
    }
  });

  await fse.ensureFileSync(outputPath);
  await fse.writeFileSync(outputPath, outputData);
}
