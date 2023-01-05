import { IAsset, IBundle } from "../cocos/bundle";
import { Instance, Skeleton } from "../instances";
export declare function extractSkeleton(bundle: IBundle, instance: Instance): (asset: IAsset, skeleton: Skeleton, output: string) => string[];
