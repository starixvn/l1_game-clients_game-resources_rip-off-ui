import { simple } from "./simple";

export function valueTypeCreated(
  data: any,
  owner: any,
  key: string,
  value: any
) {
  simple(data, owner, key, value);
}

export function valueType(data: any, owner: any, key: string, value: any) {
  simple(data, owner, key, value);
}
