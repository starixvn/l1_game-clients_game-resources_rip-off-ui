import { getParser } from "./index";

export function dictionary(data: any, owner: any, key: string, value: any) {
  const DICT_JSON_LAYOUT = 0;
  const dict = value[DICT_JSON_LAYOUT];

  owner[key] = dict;

  for (let i = DICT_JSON_LAYOUT + 1; i < value.length; i += 3) {
    const subKey = value[i] as string;
    const subType = value[i + 1];
    const subValue = value[i + 2];

    const op = getParser(subType);

    op(data, dict, subKey, subValue);
  }
}
