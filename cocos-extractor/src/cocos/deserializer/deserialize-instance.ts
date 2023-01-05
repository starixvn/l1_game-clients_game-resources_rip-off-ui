import {
  INSTANCES,
  INSTANCE_TYPES,
  SHARED_MASK,
  SHARED_UUID,
} from "../package/constants";
import { getClass } from "./classes";
import { getParser } from "./parsers";

export function buildCCObject(data: any[], instance: any[]) {
  const mask = data[SHARED_MASK][instance[0]];
  const clazz = mask[0];
  const ctor = clazz && clazz[0];

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

    const parse = getParser(type);

    parse(data, obj, key, instance[i]);
  }

  return obj;
}

export function buildCustomCCObject(data: any[], ctor: string, value: any) {
  const deserialize = getClass(ctor);

  if (deserialize) {
    return Object.assign({ ctor }, deserialize(value, data[0]));
  }

  return Object.assign({ ctor }, value);
}

export function deserializeInstance(data: any[]) {
  const instances = data[INSTANCES];
  const instanceTypes = data[INSTANCE_TYPES];
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
    instances[insIndex] = buildCCObject(data, instances[insIndex]);
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

      instances[insIndex] = buildCustomCCObject(data, ctor, eachData);
    } else {
      const op = getParser(~type);

      op(data, instances, insIndex as any, eachData);
    }
  }

  return rootIndex;
}
