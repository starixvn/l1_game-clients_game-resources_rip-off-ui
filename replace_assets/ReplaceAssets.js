const glob = require("glob");
const fse = require("fs-extra");
const plist = require("plist");

replaceAssets();

function replaceAssets() {
    const currentAssetsPath = process.argv[2];
    const newAssetsPath = process.argv[3];

    const newUUIDMap = getUUIDMap(newAssetsPath, false);
    const currentUUIDMap = getUUIDMap(currentAssetsPath);

    replaceUUIDInSceneAndPrefab(currentAssetsPath, currentUUIDMap, newUUIDMap);
    replaceUUIDInAnimation(currentAssetsPath, currentUUIDMap, newUUIDMap);
    replaceUUIDInParticle(currentAssetsPath, currentUUIDMap, newUUIDMap);
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
            console.log(`Missing resource for ${currentMap[uuid]}`);
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
                                console.log(`Missing resource for ${currentMap[uuid]}`);
                            }
                        }
                    });
                }
            }
        });

        fse.writeJSONSync(path, fileData);
    });
}

function replaceUUIDInSceneAndPrefab(currentPath, currentMap, newMap) {
    const filePaths = glob.sync(`${currentPath}/**/*@(.fire|.prefab)`);
    filePaths.forEach((path) => {
        const fileData = fse.readJSONSync(path);
        fileData.forEach((data) => {
            if (data["__type__"] === "cc.Sprite") {
                const uuid = data["_spriteFrame"]["__uuid__"];
                const newUUID = newMap[currentMap[uuid]];
                if (newUUID) {
                    data["_spriteFrame"]["__uuid__"] = newUUID;
                } else {
                    console.log(`Missing resource for ${currentMap[uuid]}`);
                }
            }
        });
        fse.writeJSONSync(path, fileData);
    });
}

function getUUIDMap(path, keyByUUID = true) {
    const uuidMap = {};
    const filePaths = glob.sync(`${path}/**/*.meta`);
    filePaths.forEach((path) => {
        const data = fse.readJSONSync(path);
        const { subMetas } = data;
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
    });
    return uuidMap;
}
