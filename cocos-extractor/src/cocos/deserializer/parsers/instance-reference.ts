import { INSTANCES, REFS } from "../../package/constants";

export function instanceReference(
  data: any,
  owner: any,
  key: string,
  value: any
) {
  if (value >= 0) {
    owner[key] = data[INSTANCES][value];
  } else {
    data[REFS][~value * 3] = owner;
  }
}
