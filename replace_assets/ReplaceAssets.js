const glob = require("glob");
const fse = require("fs-extra");
const plist = require("plist");
const path = require("path");

const WRITE_JSON_OPTIONS = {
  spaces: 2,
  EOL: "\r\n",
};

function loadGameConfig() {
  const fileName = `NewClassicGameConfig.json`;
  const fileData = fse.readJSONSync(fileName);
  return fileData["config"];
}

const newGameConfig = loadGameConfig();
replaceAssets(newGameConfig);
createLanguageFiles(newGameConfig);

function createLanguageFiles(input) {
  const { gameId, i18nTextFolderPath, gameNameLanguages, lobbyNamesLanguages, langList } =
    input;

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

function replaceAssets(input) {
  const { gameName, gameId, folder, oldResourcesPath, newResourcesPath } = input;
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
  const { gameId, colorList } = input;
  const filePaths = glob.sync(`${folder}/**/*@(.fire|.prefab)`);

  const supportTypes = {
    "cc.Sprite": "_spriteFrame",
    "sp.Skeleton": "_N$skeletonData",
    "cc.ParticleSystem": "_file",
    "cc.Label": "_N$file",
  };

  filePaths.forEach((path) => {
    const fileData = fse.readJSONSync(path);
    const isScene = path.endsWith(".fire");

    fileData.forEach((data) => {
      if (isScene) {
        replaceColorProperties(data, colorList);
      }

      replaceGameId(data, gameId);

      Object.keys(supportTypes).forEach((key) => {
        if (data["__type__"] === key) {
          const temp = data[supportTypes[key]];
          if (!temp) {
            return;
          }

          replaceUUID(temp, "__uuid__", currentMap, newMap);
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

function replaceColorProperties(data, colorList) {
  Object.keys(colorList).forEach((key) => {
    if (data[key]) {
      data[key] = colorList[key];
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
    if (importer === "spine" || importer === "particle" || importer === "bitmap-font") {
      if (keyByUUID) {
        uuidMap[uuid] = filename;
      } else {
        uuidMap[filename] = uuid;
      }
    }
  });
  return uuidMap;
}
