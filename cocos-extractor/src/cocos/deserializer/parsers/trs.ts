export function trs(data: any, owner: any, key: string, value: any) {
  if (!owner[key]) {
    owner[key] = new Float64Array(value);
  }

  const typedArray = owner[key] as Float32Array | Float64Array;

  typedArray.set(value);
}
