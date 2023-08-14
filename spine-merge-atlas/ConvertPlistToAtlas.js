const fse = require("fs-extra");
const plist = require("plist");

const config = {
  atlasFile:
    "D:/working/Luminet/rip-off-ui/spine-merge-atlas/assets/atlas/symbol-10.atlas",
  plistFile:
    "D:/working/Luminet/rip-off-ui/spine-merge-atlas/assets/plist/optimize-multiplier.plist",
};

const { atlasFile, plistFile } = config;
let coordinatePlistArr;
let metaDataImage;

readFilePlist();
readFileAtlas();

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

function formatPropertiesImage(propertiesValue) {
  const textRectArr = propertiesValue.split(",");
  return `${textRectArr[0].replace("{", "")}, ${textRectArr[1].replace(
    "}",
    ""
  )}`;
}

function readFileAtlas() {
  const data = fse.readFileSync(atlasFile, "utf-8");
  const outputPath =
    "D:/working/Luminet/rip-off-ui/spine-merge-atlas/output/symbol-10.atlas";
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
        line = `  orig: ${formatPropertiesImage(imgObj.spriteSize)}`;
      } else if (imgObj && line.includes("offset")) {
        //line = `  offset: ${formatPropertiesImage(imgObj.spriteOffset)}`;
      }

      outputData += `${line}\n`;
    }
  });

  fse.writeFile(outputPath, outputData);
}
