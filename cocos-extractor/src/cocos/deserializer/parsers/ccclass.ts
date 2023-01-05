import { buildCCObject } from "../deserialize-instance";

export function ccclass(data: any, owner: any, key: string, value: any) {
  owner[key] = buildCCObject(data, value);
}
