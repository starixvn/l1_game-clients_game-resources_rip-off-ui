import { download } from "cocos-extractor/dist/downloader/downloader";
import * as fse from "fs-extra";
import { decode } from "js-base64";
import { decode as decodeImage } from "node-base64-image";
import { join } from "path";
import * as plist from "plist";

const WRITE_JSON_OPTIONS = {
  spaces: 2,
  EOL: "\r\n",
};

downloadGame("vs10goldfish");

async function downloadGame(gameCode: string) {
  const URL = `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=${gameCode}&websiteUrl=https://demogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https://www.pragmaticplay.com/en/`;

  const CLIENT_PATH = `https://demogamesfree.pragmaticplay.net/gs2c/common/games-html5/games/vs/${gameCode}/desktop/client/`;
  const FOLDER_PATH = `https://demogamesfree.pragmaticplay.net/gs2c/common/games-html5/games/vs/${gameCode}/desktop/game/`;

  const clientJsonFiles = ["resources", "game"];

  const gameJsonFiles = [
    "game",
    "GUI",
    "main_resources",
    "GUI_resources",
    "other_resources",
  ];

  const output = join(__dirname, "output", gameCode);
  const rawJson = join(output, "raw_json");
  const gameJsonPath = join(output, "game_jsons");
  const clientJsonPath = join(output, "client_jsons");
  const textureOutput = join(output, "textures");
  fse.mkdirSync(rawJson, { recursive: true });
  fse.mkdirSync(gameJsonPath, { recursive: true });
  fse.mkdirSync(clientJsonPath, { recursive: true });
  fse.mkdirSync(textureOutput, { recursive: true });

  const allResources = [];

  for (const name of gameJsonFiles) {
    const mergeFile = join(gameJsonPath, `${name}.json`);
    let index = 0;
    while (index < 100) {
      const fileName = `${name}${String(index).padStart(3, "0")}.json`;
      const filePath = join(rawJson, fileName);
      try {
        await download(`${FOLDER_PATH}${fileName}`, filePath, false);

        const data = fse.readFileSync(filePath);
        if (data.includes("<Error><Code>NoSuchKey")) {
          fse.removeSync(filePath);
          break;
        }
      } catch (err) {
        console.log(err);
        break;
      }
      index++;
    }

    //join file
    for (let i = 0; i < index; i++) {
      const fileName = `${name}${String(i).padStart(3, "0")}.json`;
      const filePath = join(rawJson, fileName);
      const data = fse.readFileSync(filePath);
      fse.appendFileSync(mergeFile, data, { encoding: "utf8" });
    }

    //
    try {
      const data = fse.readFileSync(mergeFile, { encoding: "utf8" });
      const jsonData = JSON.parse(data);
      allResources.push(...jsonData.resources);
    } catch (err) {
      console.log(`read file error ${mergeFile}`, err);
    }
  }

  for (const name of clientJsonFiles) {
    const mergeFile = join(clientJsonPath, `${name}.json`);
    try {
      await download(join(CLIENT_PATH, `${name}.json`), mergeFile, false);
    } catch (err) {
      console.log(err);
    }
    try {
      const data = fse.readFileSync(mergeFile, { encoding: "utf8" });
      const jsonData = JSON.parse(data);
      allResources.push(...jsonData.resources);
    } catch (err) {
      console.log(`read file error ${mergeFile}`, err);
    }
  }

  //browser file
  const allTypes = {};
  const allComponents = {};
  const spineNames = {};
  const spineAtlas = {};
  for (const item of allResources) {
    const { isInline, data, id, type } = item;
    allTypes[type] = true;

    if (type === "Texture") {
      if (isInline) {
        await decodeImageBase64(data, textureOutput, id);
      } else {
        const fileName = join(textureOutput, data.replace("res/", ""));
        await download(`${FOLDER_PATH}${data}`, fileName, false);
      }
    }

    if (type === "UHTSpine") {
      spineNames[id] = data.name.replace("_SkeletonData", "");
      decodeSpineJson(data, textureOutput, spineNames[id]);
    }

    if (type === "GameObject") {
      const nodes = data.root;
      for (let node of nodes) {
        const components = node.components;
        for (let component of components) {
          if (component.componentType === "SpineController") {
            const { serializableData } = component;
            const { spineAtlases, spineData } = serializableData;

            const atlases = spineAtlases[0].serializableData.atlases;
            const atlas = atlases[0];

            spineAtlas[atlas.guid] = spineData.guid;
          }
        }
      }
    }
  }

  for (const item of allResources) {
    const { data, id, type } = item;
    if (type === "GameObject") {
      const nodes = data.root;
      for (let node of nodes) {
        const components = node.components;
        for (let component of components) {
          allComponents[component.componentType] = true;
          if (component.componentType === "UIAtlas") {
            const { serializableData } = component;
            const { spriteList } = serializableData;
            const guid = serializableData.textureContent.guid;

            const isSpineAtlas = !!spineAtlas[id];
            if (isSpineAtlas) {
              const atlasName = spineNames[spineAtlas[id]];
              fse.renameSync(
                join(textureOutput, `${guid}.png`),
                join(textureOutput, `${atlasName}.png`)
              );
              generateSpineAtlas(atlasName, spriteList, textureOutput);
            } else {
              const textureName = `${guid}.png`;
              generateSpriteSheet(textureName, spriteList, textureOutput, guid);
            }
          }
        }
      }
    }
  }
}

function generateSpineAtlas(
  textureName: string,
  spriteList: any,
  textureOutput: string
) {
  const fileName = `${textureName}.atlas`;
  const filePath = join(textureOutput, fileName);
  fse.createFileSync(filePath);
  let dataString = "";
  dataString = `${dataString}${textureName}.png
size: 2048,2048
format: RGBA8888
filter: Linear,Linear
repeat: none
`;
  for (const sprite of Object.keys(spriteList)) {
    const value = spriteList[sprite];
    const originName = sprite.slice(2);

    const size = value.rotate
      ? `${value.height}, ${value.width}`
      : `${value.width}, ${value.height}`;

    dataString = `${dataString}${originName}
 rotate: ${value.rotate ? "true" : "false"}
 xy: ${value.x || 0}, ${value.y || 0}
 size: ${size}
 orig: ${size}
 offset: 0, 0
 index: -1
`;
  }

  fse.writeFileSync(filePath, dataString);
}
function generateSpriteSheet(
  textureName: string,
  spriteList: any,
  textureOutput: string,
  guid: any
) {
  const plistData = {};
  const frames = {};
  const metadata = {};
  plistData["frames"] = frames;
  plistData["metadata"] = metadata;

  metadata["format"] = 3;
  metadata["pixelFormat"] = "RGBA8888";
  metadata["premultiplyAlpha"] = false;
  metadata["textureFileName"] = textureName;
  metadata["realTextureFileName"] = textureName;
  metadata["size"] = `{2048,2048}`;
  for (const sprite of Object.keys(spriteList)) {
    const value = spriteList[sprite];
    const originName = sprite.slice(2);
    const frameData = {};
    frames[originName] = frameData;
    frameData["aliases"] = [];
    frameData["spriteOffset"] = `{0,0}`;
    frameData["spriteSize"] = `{${value.width},${value.height}}`;
    frameData["spriteSourceSize"] = `{${value.width},${value.height}}`;
    frameData["textureRect"] = `{{${value.x || 0},${value.y || 0}},{${
      value.width
    },${value.height}}}`;
    frameData["textureRotated"] = value.rotate ? true : false;
  }

  fse.writeFileSync(
    join(textureOutput, `${guid}.plist`),
    plist.build(plistData)
  );
}

function decodeSpineJson(data: any, textureOutput: string, spineName) {
  const jsonData = decode(data.spineJSON);
  const fileName = join(textureOutput, `${spineName}.json`);
  fse.createFileSync(fileName);
  fse.writeJsonSync(fileName, JSON.parse(jsonData), WRITE_JSON_OPTIONS);
}

async function decodeImageBase64(data: any, textureOutput: string, id: any) {
  const pngPrefix = "data:image/png;base64,";
  const jpgPrefix = "data:image/jpeg;base64,";
  let ext = "png";
  let base64Data = data.replace(pngPrefix, "");
  if (data.length === base64Data.length) {
    base64Data = data.replace(jpgPrefix, "");
    ext = "jpg";
  }
  const fileName = join(textureOutput, `${id}`);
  await decodeImage(base64Data, { fname: fileName, ext });
}
