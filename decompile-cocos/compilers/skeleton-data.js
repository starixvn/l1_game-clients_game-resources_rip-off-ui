const UuidUtils = require("../UUIDUtil");

function filterSkeletonData({ instances, classes, masks, uuids }) {
  return classes
    .map((sharedClass, classIndex) => {
      if (Array.isArray(sharedClass) && sharedClass[0] === "sp.SkeletonData") {
        const { mask, maskIndex } = masks.reduce((result, mask, maskIndex) => {
          if (mask && mask[0] === classIndex) {
            return { mask, maskIndex };
          } else {
            return result;
          }
        }, {});
        let instance = instances.find(
          (instance) =>
            instance[0] === maskIndex || instance[0][0][0] === maskIndex
        );
        const uuid = uuids[instance[5]];

        if (instance[0][0] && instance[0][0][0] === maskIndex) {
          instance = instance[0][0];
        }

        const decompressedUUID = UuidUtils.decompressUuid(uuid);

        return { sharedClass, instance, mask, uuid: decompressedUUID };
      }
    })
    .filter((x) => !!x);
}

function createFiles({ instance, uuid }) {
  const name = instance[1];
  const atlas = instance[2];
  const json = instance[4];
  const images = instance[3];

  return [
    {
      uuid,
      folder: name,
      name: `${name}.atlas`,
      data: atlas,
      action: "create",
    },
    {
      uuid,
      folder: name,
      name: `${name}.json`,
      data: json,
      action: "create",
    },
    ...images.map((path) => ({
      uuid,
      folder: name,
      name: path,
      action: "copy",
    })),
  ];
}

function compileSkeletonData(data) {
  const skeletons = filterSkeletonData(data);

  return skeletons.flatMap((skeleton) => createFiles(skeleton));
}

module.exports = { compileSkeletonData };
