export declare const texture2dExtensions: string[];
export declare function unpackTexture2D(json: {
    type: string;
    data: string;
}): (number | string[] | number[] | {
    base: number;
    mipmaps: number;
    frame: number[];
    _native: string;
}[])[][];
