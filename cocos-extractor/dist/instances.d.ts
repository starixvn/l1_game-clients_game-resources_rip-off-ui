export type Instance = Record<string, BaseInstance>;
export interface BaseInstance {
    ctor: string;
    _native: string;
    exported: boolean;
}
export interface Texture2D extends BaseInstance {
    ctor: "cc.Texture2D";
    name: string;
    base: number;
    mipmaps: number;
}
export interface AudioClip extends BaseInstance {
    ctor: "cc.AudioClip";
    _name: string;
    duration: number;
}
export interface Skeleton extends BaseInstance {
    ctor: "sp.SkeletonData";
    _name: string;
    _atlasText: string;
    textureNames: string[];
    _skeletonJson: unknown;
}
export interface SpriteFrame extends BaseInstance {
    ctor: "cc.SpriteFrame";
    name: string;
    rect: number[];
    offset: number[];
    originalSize: number[];
    capInsets: number[];
    _textureSetter: {
        uuid: string;
    };
    texture: Texture2D;
    rotated: number;
}
export interface SpriteAtlas extends BaseInstance {
    ctor: "cc.SpriteAtlas";
    _name: string;
    parseType: number;
    _spriteFrames: Record<string, SpriteFrame> | {
        uuid: string;
    };
}
