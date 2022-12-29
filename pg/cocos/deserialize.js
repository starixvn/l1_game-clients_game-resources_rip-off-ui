function preprocess(data) {
  const masks = data[4];

  if (masks) {
    const classes = data[3];

    for (let i = 0; i < masks.length; ++i) {
      const mask = masks[i];

      mask[0] = classes[mask[0]];
    }
  }
}

function deserializeCCObject(data, instance) {
  const mask = data[4][instance[0]];
  const clazz = mask[0];
  const ctor = clazz[0];

  const keys = clazz[1];
  const classTypeOffset = clazz[2];
  const maskTypeOffset = mask[mask.length - 1];
  const obj = { ctor };

  // parse simple type
  let i = 1;

  for (; i < maskTypeOffset; ++i) {
    const key = keys[mask[i]];

    obj[key] = instance[i];
  }

  // parse advanced type
  for (; i < instance.length; ++i) {
    const key = keys[mask[i]];
    const type = clazz[mask[i] + classTypeOffset];

    obj["parseType"] = type;
    obj[key] = instance[i];
  }

  return obj;
}

function deserializeCustomCCObject(ctor, value) {
  const obj = Object.assign({ ctor }, value);

  return obj;
}

function parseInstances(data) {
  const instances = data[5];
  const instanceTypes = data[6];
  const instanceTypesLen = !instanceTypes ? 0 : instanceTypes.length;
  let rootIndex = instances[instances.length - 1];
  let normalObjectCount = instances.length - instanceTypesLen;

  if (typeof rootIndex !== "number") {
    rootIndex = 0;
  } else {
    if (rootIndex < 0) {
      rootIndex = ~rootIndex;
    }
    --normalObjectCount;
  }

  let insIndex = 0;
  for (; insIndex < normalObjectCount; ++insIndex) {
    instances[insIndex] = deserializeCCObject(data, instances[insIndex]);
  }

  const classes = data[3];

  for (
    let typeIndex = 0;
    typeIndex < instanceTypesLen;
    ++typeIndex, ++insIndex
  ) {
    let type = instanceTypes[typeIndex];
    const eachData = instances[insIndex];

    if (type >= 0) {
      const ctor = classes[type];

      instances[insIndex] = deserializeCustomCCObject(ctor, eachData);
    } else {
      console.log("TODO: with other data");
      type = ~type;

      //op(data, instances, insIndex, eachData);
    }
  }

  return rootIndex;
}

function deserialize(data) {
  if (typeof data === "string") {
    data = JSON.parse(data);
  }

  let version = data[0];
  let preprocessed = false;

  if (typeof version === "object") {
    version = version.version;
    preprocessed = version.preprocessed;
  }

  if (!preprocessed) {
    preprocess(data);
  }

  const instances = data[5];
  const rootIndex = parseInstances(data);

  return instances[rootIndex];
}

module.exports = deserialize;
