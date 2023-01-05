import { build } from "plist";
import { SpriteFrame } from "../instances";

export function array2String(array: number[]) {
  if (array.length === 2) {
    return `{${array.join(",")}}`;
  } else {
    const postfix = [...array];
    const prefix = postfix.splice(0, 2);

    return `{${[prefix, postfix].map(array2String).join(",")}}`;
  }
}

export function spriteFramesToPlistFrames(frames: SpriteFrame[]) {
  return frames.reduce((result, frame) => {
    const data = {
      aliases: [],
      spriteOffset: array2String(frame.offset),
      spriteSize: array2String(frame.originalSize),
      spriteSourceSize: array2String(frame.originalSize),
      textureRect: array2String(frame.rect),
      textureRotated: frame.rotated === 1 ? true : false,
    };
    const ext = frame?.texture?._native ?? ".png";

    result[`${frame.name}${ext}`] = data;

    return result;
  }, {});
}

export function buildPlist(textureName: string, frames: SpriteFrame[]) {
  const json = {
    frames: spriteFramesToPlistFrames(frames),
    metadata: {
      format: 3,
      textureFileName: textureName,
      realTextureFileName: textureName,
    },
  };

  return build(json);
}
