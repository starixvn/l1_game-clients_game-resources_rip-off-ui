const glob = require("glob");
const fse = require("fs-extra");
const plist = require("plist");
const path = require("path");

replaceAssets();

function replaceAssets() {
  const currentAssetsPath = process.argv[2];
  const oldAssetsPath = process.argv[3];
  const newAssetsPath = process.argv[4];

  const newUUIDMap = getUUIDMap(newAssetsPath, false); // [nam]: uuid
  const oldUUIDMap = getUUIDMap(oldAssetsPath); // [uuid]: name

  replaceUUIDInSceneAndPrefab(currentAssetsPath, oldUUIDMap, newUUIDMap);
  replaceUUIDInAnimation(currentAssetsPath, oldUUIDMap, newUUIDMap);
  replaceUUIDInParticle(currentAssetsPath, oldUUIDMap, newUUIDMap);
}

function replaceUUIDInParticle(currentPath, currentMap, newMap) {
  const filePaths = glob.sync(`${currentPath}/**/*@(.plist)`);
  filePaths.forEach((path) => {
    const fileData = fse.readFileSync(path, "utf8");
    const plistData = plist.parse(fileData);
    const uuid = plistData["spriteFrameUuid"];

    const newUUID = newMap[currentMap[uuid]];
    if (newUUID) {
      plistData["spriteFrameUuid"] = newUUID;
    } else {
      console.log(`Missing resource for ${uuid}`);
    }
    fse.writeFileSync(path, plist.build(plistData));
  });
}

function replaceUUIDInAnimation(currentPath, currentMap, newMap) {
  const filePaths = glob.sync(`${currentPath}/**/*@(.anim)`);
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
              const uuid = spriteFrame["value"]["__uuid__"];
              const newUUID = newMap[currentMap[uuid]];
              if (newUUID) {
                spriteFrame["value"]["__uuid__"] = newUUID;
              } else {
                console.log(`Missing resource for ${uuid}`);
              }
            }
          });
        }
      }
    });

    fse.writeJSONSync(path, fileData, {
      spaces: 2,
      EOL: "\r\n",
    });
  });
}

function replaceUUIDInSceneAndPrefab(currentPath, currentMap, newMap) {
  const filePaths = glob.sync(`${currentPath}/**/*@(.fire|.prefab)`);
  filePaths.forEach((path) => {
    const fileData = fse.readJSONSync(path);
    fileData.forEach((data) => {
      if (data["__type__"] === "cc.Sprite") {
        const temp = data["_spriteFrame"];
        if (!temp) {
          return;
        }
        const uuid = temp["__uuid__"];
        const newUUID = newMap[currentMap[uuid]];
        if (newUUID) {
          data["_spriteFrame"]["__uuid__"] = newUUID;
        } else {
          console.log(`Missing resource for ${uuid}`);
        }
      }

      if (data["__type__"] === "sp.Skeleton") {
        const temp = data["_N$skeletonData"];
        if (!temp) {
          return;
        }
        const uuid = temp["__uuid__"];
        const newUUID = newMap[currentMap[uuid]];
        if (newUUID) {
          data["_N$skeletonData"]["__uuid__"] = newUUID;
        } else {
          console.log(`Missing resource for ${uuid}`);
        }
      }
    });
    fse.writeJSONSync(path, fileData, {
      spaces: 2,
      EOL: "\r\n",
    });
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
    if (importer === "spine") {
      if (keyByUUID) {
        uuidMap[uuid] = filename;
      } else {
        uuidMap[filename] = uuid;
      }
    }
  });
  return uuidMap;
}
