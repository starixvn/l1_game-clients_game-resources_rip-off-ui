import { IBundle } from "./cocos/bundle";
import { Instance } from "./instances";

export function printStatistic(bundle: IBundle, instance: Instance) {
	const total = Object.keys(instance).length;
	const withoutExported = Object.entries(instance).filter(
		([_, value]) => !value?.exported
	);
	const ctors = new Set(withoutExported.map(([_, value]) => value?.ctor));

	console.log(`Exported: ${total - withoutExported.length}/${total}`);
	console.log(`Remaining constructors: ${Array.from(ctors).join(", ")}`);

	delete bundle.configs;
	Object.entries(instance).forEach(([uuid, value]) => {
		if (value?.exported) {
			delete bundle.storage[uuid];
			delete bundle.imported[uuid];
			delete instance[uuid];
		}
	});
}
