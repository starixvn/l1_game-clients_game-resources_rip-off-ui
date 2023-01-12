import { texture2dExtensions } from "../../package/texture2d";

export function texture2D(data: any, context: any) {
  if (typeof data === "string") {
    const frame = data.split(",").map((x) => parseInt(x));

    return {
      base: frame[0],
      mipmaps: frame[1],
      frame,
      _native: texture2dExtensions[frame[0]],
    };
  }

  return data;
}
