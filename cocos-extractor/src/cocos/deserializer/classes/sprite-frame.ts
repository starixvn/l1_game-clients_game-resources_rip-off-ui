export interface SpriteFrameData {
  name: string;
  rect: number[];
  offset: number[];
  originalSize: number[];
  capInsets: number[];
}

export function spriteFrame(data: SpriteFrameData, context: any) {
  return data;
}
