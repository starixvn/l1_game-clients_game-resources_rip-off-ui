import { SHARED_CLASS } from "../../package/constants";
import { buildCustomCCObject } from "../deserialize-instance";

export function customClass(data: any, owner: any, key: string, value: any) {
  const ctor = data[SHARED_CLASS][value[0]];

  owner[key] = buildCustomCCObject(data, ctor, value[1]);
}
