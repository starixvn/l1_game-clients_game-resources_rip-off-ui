import { IAsset, IBundle } from "../cocos/bundle";
import { AudioClip, Instance } from "../instances";
export declare function extractAudioClip(bundle: IBundle, instance: Instance): (asset: IAsset, audioClip: AudioClip, output: string) => string[];
