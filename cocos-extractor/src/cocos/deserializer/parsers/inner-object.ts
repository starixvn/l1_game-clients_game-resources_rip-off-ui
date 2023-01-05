import { DEPEND_OBJECT } from "../../package/constants";

export function innerObject(data: any, owner: any, key: string, value: number) {
  owner[key] = null;
  data[DEPEND_OBJECT][value] = owner;
}
