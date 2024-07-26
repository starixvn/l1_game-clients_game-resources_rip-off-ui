import { join } from "path";
import { IAsset, IBundle } from "../cocos/bundle";
import { Instance, SpriteFrame, Texture2D } from "../instances";
import { buildPlist } from "./build-plist";
import { copyFile, getPath, writeFile } from "./utils";

function extractNormalTexture(
	texture: Texture2D,
	asset: IAsset,
	output: string
) {
	const destination = join(output, `${getPath(asset)}${texture._native}`);

	copyFile(asset.nativePath, destination);

	return [asset.uuid];
}

function getFrameEntries(instance: Instance, uuid: string) {
	if (!instance) {
		return [];
	}
	return Object.entries(instance).filter(
		([_, value]) =>
			value &&
			value.ctor === "cc.SpriteFrame" &&
			(value as SpriteFrame)?._textureSetter?.uuid === uuid
	) as [string, SpriteFrame][];
}

function extractCustomPlist(
	asset: IAsset,
	texture: Texture2D,
	frameEntries: [string, SpriteFrame][],
	output: string
) {
	const uuids = frameEntries.map(([uuid]) => uuid);
	const folder = "unknown/atlas";
	const path = getPath(asset, folder);
	const textureName = `${asset.uuid}${texture._native}`;
	const frames = frameEntries.map(([_, frame]) => frame);
	const plist = buildPlist(textureName, frames);
	const plistDestination = join(output, `${path}.plist`);
	const textureDestination = join(output, `${path}${texture._native}`);

	copyFile(asset.nativePath, textureDestination);
	writeFile(plistDestination, plist);

	return [asset.uuid, ...uuids];
}

export function extractTexture2D(bundle: IBundle, instance: Instance) {
	return function (asset: IAsset, texture: Texture2D, output: string) {
		if (texture?.ctor !== "cc.Texture2D" || texture?.exported) {
			return [];
		}

		const isNormalTexture = !!asset.path;

		if (isNormalTexture) {
			return extractNormalTexture(texture, asset, output);
		} else {
			const entries = getFrameEntries(instance, asset.uuid);

			// Custom Plist
			if (entries.length !== 0) {
				return extractCustomPlist(asset, texture, entries, output);
			}
		}

		return [];
	};
}
