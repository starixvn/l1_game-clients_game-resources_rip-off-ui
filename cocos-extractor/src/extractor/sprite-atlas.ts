import { basename, join } from "path";
import { and, findAsset, isSameCtor, isSamePath } from "../cocos/asset-filter";
import { IAsset, IBundle } from "../cocos/bundle";
import { Instance, SpriteAtlas, SpriteFrame } from "../instances";
import { buildPlist } from "./build-plist";
import { getPath, writeFile } from "./utils";

function getFrames(spriteAtlas: SpriteAtlas, instance: Instance) {
	if (!spriteAtlas || !spriteAtlas._spriteFrames) {
		return [];
	}

	return Object.values(spriteAtlas._spriteFrames).map(
		({ uuid }) => instance[uuid] as SpriteFrame
	);
}

function getFrameIds(spriteAtlas: SpriteAtlas) {
	if (!spriteAtlas || !spriteAtlas._spriteFrames) {
		return [];
	}
	return Object.values(spriteAtlas._spriteFrames).map(({ uuid }) => uuid);
}

function getTextureName(bundle: IBundle, instance: Instance, path: string) {
	const textureAsset = findAsset(
		bundle,
		and(isSamePath(path), isSameCtor("cc.Texture2D"))
	);
	const textureInstance = textureAsset ? instance[textureAsset.uuid] : null;
	const texturePath = `${textureAsset?.path ?? path}${
		textureInstance?._native ?? ".png"
	}`;

	return basename(texturePath);
}

export function extractSpriteAtlas(bundle: IBundle, instance: Instance) {
	return function (asset: IAsset, spriteAtlas: SpriteAtlas, output: string) {
		if (spriteAtlas?.ctor !== "cc.SpriteAtlas") {
			return [];
		}

		const path = getPath(asset);
		const textureName = getTextureName(bundle, instance, path);
		const destination = join(output, `${path}.plist`);
		const frames = getFrames(spriteAtlas, instance);
		const plist = buildPlist(textureName, frames);

		writeFile(destination, plist);

		return [asset.uuid, ...getFrameIds(spriteAtlas)];
	};
}
