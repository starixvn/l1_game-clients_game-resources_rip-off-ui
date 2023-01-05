export interface SpriteFrameData {
    name: string;
    rect: number[];
    offset: number[];
    originalSize: number[];
    capInsets: number[];
}
export declare function spriteFrame(data: SpriteFrameData, context: any): SpriteFrameData;
