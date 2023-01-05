import { getParser } from ".";

export function generateArrayParser(parser: Function) {
  return (data: any, owner: any, key: string, value: any) => {
    for (let i = 0; i < value.length; ++i) {
      parser(data, value, i as unknown as string, value[i]);
    }

    owner[key] = value;
  };
}

export function array(data: any, owner: any, key: string, value: any) {
  const ARRAY_ITEM_VALUES = 0;
  const array = value[ARRAY_ITEM_VALUES];

  for (let i = 0; i < array.length; ++i) {
    const subValue = array[i];
    const type = value[i + 1];
    if (type !== 0) {
      const op = getParser(type);

      op(data, array, i as any, subValue);
    }
  }

  owner[key] = array;
}
