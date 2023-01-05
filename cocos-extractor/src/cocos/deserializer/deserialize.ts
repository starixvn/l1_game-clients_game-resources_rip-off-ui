import {
  DEPEND_KEYS,
  DEPEND_OBJECT,
  DEPEND_UUID_INDICES,
  INSTANCES,
  SHARED_STRING,
  SHARED_UUID,
  VERSION,
} from "../package/constants";
import { preprocess } from "../package/preprocess";
import { decodeUUID } from "../uuid";
import { deserializeInstance } from "./deserialize-instance";

function parseResult(data: any[]) {
  const instances = data[INSTANCES];
  const sharedStrings = data[SHARED_STRING];
  const dependSharedUuids = data[SHARED_UUID];

  const dependObjs = data[DEPEND_OBJECT];
  const dependKeys = data[DEPEND_KEYS];
  const dependUuids = data[DEPEND_UUID_INDICES];

  for (let i = 0; i < dependObjs.length; ++i) {
    const obj: any = dependObjs[i];
    if (typeof obj === "number") {
      dependObjs[i] = instances[obj];
    } else {
      // assigned by DataTypeID.AssetRefByInnerObj or added by Details object directly in _deserialize
    }
    let key: any = dependKeys[i];
    if (typeof key === "number") {
      if (key >= 0) {
        key = sharedStrings[key];
      } else {
        key = ~key;
      }
      dependKeys[i] = key;
    } else {
      // added by Details object directly in _deserialize
    }
    const uuid = dependUuids[i];
    if (typeof uuid === "number") {
      dependUuids[i] = dependSharedUuids[uuid];
    } else {
      // added by Details object directly in _deserialize
    }
  }

  dependObjs.forEach((object, index) => {
    const key = dependKeys[index];
    const uuid = dependUuids[index];

    object[key] = { uuid: decodeUUID(uuid) };
  });
}

export function deserialize(data: any[], options: any = {}) {
  let version = data[VERSION];
  let preprocessed = false;
  options = options || {};

  if (typeof version === "object") {
    preprocessed = version.preprocessed;
    version = version.version;
  }

  if (!preprocessed) {
    preprocess(data);
  }

  options.version = version;
  data[VERSION] = options;

  const instances = data[INSTANCES];
  const rootIndex = deserializeInstance(data);

  parseResult(data);

  data[0] = 1;

  return instances[rootIndex];
}
