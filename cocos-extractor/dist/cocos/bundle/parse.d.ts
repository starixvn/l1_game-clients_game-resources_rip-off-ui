export interface IConfigs {
    uuids: string[];
    paths: Record<string, string[]>;
    packs: Record<string, string[]>;
    versions: Record<"import" | "native", string[]>;
    redirect: string[];
}
export interface IAsset {
    uuid: string;
    path?: string;
    ctor?: string;
    packedUuids?: string[];
    ext?: string;
    ver?: string;
    nativeVer?: string;
    importUri?: string;
    importPath?: string;
    nativeUri?: string;
    nativePath?: string;
}
export interface IBundle {
    configs: IConfigs;
    storage: Record<string, IAsset>;
    imported: Record<string, string>;
}
export declare function parse(bundleUri: string): IBundle;
