import { spriteFrame } from "./sprite-frame";
import { texture2D } from "./texture2d";

export function getClass(ctor: string) {
  // TODO: Class Serializer
  switch (ctor) {
    case "cc.SpriteFrame":
      return spriteFrame;
    case "cc.Texture2D":
      return texture2D;
    default:
      return () => console.warn(ctor);
  }
}
