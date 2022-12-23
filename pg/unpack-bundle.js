const { readFileSync } = require("fs");
const { unpackJSONs } = require("./cocos");

function unpackBundle(bundle) {
  const assets = Object.values(bundle).filter((asset) => asset.isPack);

  assets.forEach((asset) => {
    const importData = readFileSync(asset.importPath, "utf-8");
    const json = JSON.parse(importData);
    const output = bundle;

    if (Array.isArray(json)) {
      const result = unpackJSONs(json);

      for (let i = 0; i < asset.packedUuids.length; i++) {
        const uuid = asset.packedUuids[i];

        output[`${uuid}@import`] = result[i];

        if (output[uuid]) {
          output[uuid].importUri = asset.importUri;
        }
      }
    } else {
      if (!json.type || !json.data) {
        return;
      }

      let data = json.data;

      if (json.type === "cc.Texture2D") {
        data = data.split("|").map((e) => e.split(",").map((x) => parseInt(x)));

        for (let i = 0; i < asset.packedUuids.length; i++) {
          const uuid = asset.packedUuids[i];

          output[`${uuid}@import`] = [
            1,
            0,
            0,
            ["cc.Texture2D"],
            0,
            [{ base: data[i][0], mipmaps: data[i][1] }],
            [0],
            0,
            [],
            [],
            [],
          ];

          if (output[uuid]) {
            output[uuid].importUri = asset.importUri;
          }
        }
      } else if (json.type === "cc.ImageAsset") {
        console.log("TODO: cc.ImageAsset");
        for (let i = 0; i < asset.packedUuids.length; i++) {
          output[`${asset.packedUuids[i]}@import`] = data[i];
        }
      }
    }
  });

  return bundle;
}

module.exports = unpackBundle;
