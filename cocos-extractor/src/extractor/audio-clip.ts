import { join } from "path";
import { IAsset, IBundle } from "../cocos/bundle";
import { AudioClip, Instance } from "../instances";
import { copyFile, getPath } from "./utils";

export function extractAudioClip(bundle: IBundle, instance: Instance) {
	return function (asset: IAsset, audioClip: AudioClip, output: string) {
		if (audioClip?.ctor !== "cc.AudioClip") {
			return [];
		}

		const destination = join(output, `${getPath(asset)}${audioClip._native}`);

		copyFile(asset.nativePath, destination);

		return [asset.uuid];
	};
}
