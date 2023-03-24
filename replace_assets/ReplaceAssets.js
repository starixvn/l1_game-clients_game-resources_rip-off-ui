const glob = require("glob");
const fse = require("fs-extra");
const plist = require("plist");
const path = require("path");

const uuid4 = require("uuid4");

const WRITE_JSON_OPTIONS = {
  spaces: 2,
  EOL: "\r\n",
};

const config = loadGameConfig();
const { templateFolder, folder, newResources, command } = config;

//step1: clone game from template
if (command["clone-game"]) {
  cloneGameFromTemplate(templateFolder, folder);
}

//step2: create new language files
if (command["create-languages-files"]) {
  createLanguageFiles(config);
}

//step3: create new json files
if (command["create-color-music-json-files"]) {
  createColorMusicJsonFiles(config);
}

//step4: override by new resources
const resourceDest = `${folder}/`;
if (command["copy-new-resource"]) {
  copyNewResources(newResources, resourceDest);
}

//step5: auto generate new uuid for new resources
if (command["generate-new-uuid"]) {
  generateNewUUID(resourceDest);
}

//step6: replace uuid
if (command["replace-assets"]) {
  replaceAssets(config);
}

function generateNewUUID(dirPath) {
  const filePaths = glob.sync(`${dirPath}/**/*.meta`);
  const uuidMap = {};
  filePaths.forEach((filePath) => {
    const data = fse.readJSONSync(filePath);
    uuidMap[data.uuid] = uuid4();

    const { subMetas } = data;
    Object.keys(subMetas).forEach((key) => {
      const subData = subMetas[key];
      uuidMap[subData.uuid] = uuid4();
    });

    fse.writeJSONSync(filePath, data, WRITE_JSON_OPTIONS);
  });

  //replace
  filePaths.forEach((filePath) => {
    const data = fse.readJSONSync(filePath);
    data.uuid = uuidMap[data.uuid];
    if (data.textureUuid) {
      data.textureUuid = uuidMap[data.textureUuid];
    }
    if (data.rawTextureUuid) {
      data.rawTextureUuid = uuidMap[data.rawTextureUuid];
    }

    if (data.textures) {
      const temp = [];
      data.textures.forEach((key) => temp.push(uuidMap[key]));
      data.textures = temp;
    }

    const { subMetas } = data;
    Object.keys(subMetas).forEach((key) => {
      const subData = subMetas[key];
      subData.uuid = uuidMap[subData.uuid];

      if (subData.rawTextureUuid) {
        subData.rawTextureUuid = uuidMap[subData.rawTextureUuid];
      }
    });

    fse.writeJSONSync(filePath, data, WRITE_JSON_OPTIONS);
  });
}

function copyNewResources(newResources, resourceDest) {
  fse.copySync(newResources, resourceDest);
}

function cloneGameFromTemplate(templateFolder, folder) {
  fse.copySync(templateFolder, folder);

  fse.copyFileSync(`${templateFolder}.meta`, `${folder}.meta`);
}

function loadGameConfig() {
  const fileName = `NewClassicGameConfig.json`;
  const fileData = fse.readJSONSync(fileName);
  return fileData;
}

function createLanguageFiles(input) {
  const { gameId, folder, gameNameLanguages, lobbyNamesLanguages, langList } = input;

  const i18nTextFolderPath = `${folder}/i18n/texts/`;
  // delete all files
  fse.emptyDirSync(i18nTextFolderPath);

  // create language files
  langList.forEach((lang) => {
    let lobbyName = "";
    if (lobbyNamesLanguages[lang]) {
      lobbyName = `,
    lobbyNames: {
        ${gameId}: "${lobbyNamesLanguages[lang]}"
    }`;
    }

    const content = `import { reloadLanguageData } from "../../../../common/i18n/CustomLanguageData";

export const phrases = {
    gameNames: {
        ${gameId}: "${gameNameLanguages[lang]}"
    }${lobbyName}
};

reloadLanguageData("${lang}", phrases);`;

    fse.appendFile(
      `${i18nTextFolderPath}game-${gameId}-${lang}.ts`,
      content,
      function (err) {
        if (err) throw err;
      }
    );
  });
}

function createColorMusicJsonFiles(input) {
  const { colorList, music } = input;
  const content = {
    bottomAreaTextColor: colorList.bottomAreaTextColor,
    bottomAreaNumberColor: colorList.bottomAreaNumberColor,
    bottomAreaButtonBorderColor: colorList.bottomAreaButtonBorderColor,
    previewOddsBorderColor: colorList.previewOddsBorderColor,
    previewOddsSymbolNumberColor: colorList.previewOddsSymbolNumberColor,
    previewOddsWinValueColor: colorList.previewOddsWinValueColor,
    noticeTextColor: colorList.noticeTextColor,
    noticeHighlightTextColor: colorList.noticeHighlightTextColor,
    bonusCountItemTextColor: colorList.bonusCountItemTextColor,
  };

  createJsonFile("color", content);
  createJsonFile("music", { SC1: music });
}

async function createJsonFile(fileName, content) {
  try {
    const path = `${config.folder}/resources/json/${fileName}.json`;
    await fse.remove(path);
    await fse.writeJson(path, content, {
      spaces: 2,
    });
  } catch (err) {
    console.error(err);
  }
}

function replaceAssets(input) {
  const { gameName, gameId, folder } = input;

  const oldResourcesPath = `${templateFolder}/resources/`;
  const newResourcesPath = `${folder}/resources/`;

  const newUUIDMap = getUUIDMap(newResourcesPath, false); // [nam]: uuid
  const oldUUIDMap = getUUIDMap(oldResourcesPath); // [uuid]: name

  const folders = [
    //
    folder + "/preload",
    folder + "/icons",
  ];
  const preloadFolder = folders[0];

  replaceBundleId(folder, gameId);
  renameSceneFile(preloadFolder, gameName);
  folders.forEach((f) => replaceInfoSceneAndPrefab(f, input, oldUUIDMap, newUUIDMap));
  replaceUUIDInAnimation(preloadFolder, oldUUIDMap, newUUIDMap);
  replaceUUIDInParticle(preloadFolder, oldUUIDMap, newUUIDMap);
}

function replaceBundleId(folder, gameId) {
  const fileName = `${folder}.meta`;
  const fileData = fse.readJSONSync(fileName);
  fileData["bundleName"] = gameId.toString();
  fse.writeJSONSync(fileName, fileData, WRITE_JSON_OPTIONS);
}

function renameSceneFile(folder, gameName) {
  const sceneName = gameName.replace(" ", "");
  const filePaths = glob.sync(`${folder}/**/*@(.fire)`);
  filePaths.forEach((filePath) => {
    const newName = path.dirname(filePath) + `/${sceneName}.fire`;
    fse.renameSync(filePath, newName);

    fse.renameSync(`${filePath}.meta`, `${newName}.meta`);
  });
}

function replaceUUID(data, key, oldMap, newMap) {
  const uuid = data[key];
  const oldAssetName = oldMap[uuid];
  const newUUID = newMap[oldAssetName];
  if (!!oldAssetName && !!newUUID) {
    data[key] = newUUID;
  } else {
    if (!!oldAssetName) {
      console.log(`Missing resource for ${uuid} => ${oldAssetName}`);
    }
  }
}

function replaceUUIDInParticle(folder, currentMap, newMap) {
  const filePaths = glob.sync(`${folder}/**/*@(.plist)`);
  filePaths.forEach((path) => {
    const fileData = fse.readFileSync(path, "utf8");
    const plistData = plist.parse(fileData);

    replaceUUID(plistData, "spriteFrameUuid", currentMap, newMap);

    fse.writeFileSync(path, plist.build(plistData));
  });
}

function replaceUUIDInAnimation(folder, currentMap, newMap) {
  const filePaths = glob.sync(`${folder}/**/*@(.anim)`);
  filePaths.forEach((path) => {
    const fileData = fse.readJSONSync(path);

    const curveData = fileData["curveData"];
    const paths = curveData["paths"];

    paths.forEach((node) => {
      const comps = node["comps"];
      if (comps) {
        const sprite = comps["cc.Sprite"];
        if (sprite) {
          const spriteFrames = sprite["spriteFrame"];
          spriteFrames.forEach((spriteFrame) => {
            if (spriteFrame["value"]) {
              replaceUUID(spriteFrame["value"], "__uuid__", currentMap, newMap);
            }
          });
        }
      }
    });

    fse.writeJSONSync(path, fileData, WRITE_JSON_OPTIONS);
  });
}

function replaceInfoSceneAndPrefab(folder, input, currentMap, newMap) {
  const { gameId } = input;
  const filePaths = glob.sync(`${folder}/**/*@(.fire|.prefab)`);

  const supportTypes = {
    "cc.Sprite": "_spriteFrame",
    "sp.Skeleton": "_N$skeletonData",
    "cc.ParticleSystem": "_file",
    "cc.Label": "_N$file",
  };

  filePaths.forEach((path) => {
    const fileData = fse.readJSONSync(path);

    fileData.forEach((data) => {
      replaceGameId(data, gameId);

      Object.keys(supportTypes).forEach((key) => {
        if (data["__type__"] === key) {
          const temp = data[supportTypes[key]];
          if (!temp) {
            return;
          }

          replaceUUID(temp, "__uuid__", currentMap, newMap);
        }

        if (data["colorInfo"]) {
          replaceUUID(data["colorInfo"], "__uuid__", currentMap, newMap);
        }

        if (data["musicInfo"]) {
          replaceUUID(data["musicInfo"], "__uuid__", currentMap, newMap);
        }
      });
    });
    fse.writeJSONSync(path, fileData, WRITE_JSON_OPTIONS);
  });
}

function replaceGameId(data, gameId) {
  const supportKeys = ["gameId", "_gameId"];

  supportKeys.forEach((key) => {
    if (data[key]) {
      data[key] = gameId;
    }
  });
}

function getUUIDMap(dirPath, keyByUUID = true) {
  const uuidMap = {};
  const filePaths = glob.sync(`${dirPath}/**/*.meta`);
  filePaths.forEach((filePath) => {
    const data = fse.readJSONSync(filePath);
    const { subMetas, importer, uuid } = data;

    Object.keys(subMetas).forEach((key) => {
      const subData = subMetas[key];
      const { uuid, importer } = subData;

      if (importer === "sprite-frame") {
        if (keyByUUID) {
          uuidMap[uuid] = key;
        } else {
          uuidMap[key] = uuid;
        }
      }
    });

    const filename = path.basename(filePath);
    if (
      importer === "json" ||
      importer === "spine" ||
      importer === "particle" ||
      importer === "bitmap-font"
    ) {
      if (keyByUUID) {
        uuidMap[uuid] = filename;
      } else {
        uuidMap[filename] = uuid;
      }
    }
  });
  return uuidMap;
}
