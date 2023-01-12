import { IInput } from "./app";
import { Instance } from "./instances";
export declare function download(input: IInput): Promise<{
    instance: Instance;
    bundle: import("./cocos/bundle").IBundle;
}>;
