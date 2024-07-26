import { join } from "path";

import { IInput, start } from "./app";

const input: IInput = {
	output: join(__dirname, "..", "output"),
	// uri: "https://cdn.kingdomhall729.com/qat/xoc-dia/2023-03-23-05-51-07/assets/resources",
	// versions: { config: "c6620", index: "c6620" },
	// uri: "https://play.iwin8.club/assets/bundle6998",

	// uri: "https://game.by100.site/assets/mjtwo",
	// versions: { config: "4b45e", index: "4b45e" },

	// uri: "https://wbgame-demo.tadagaming.com/sudm/assets/Game",
	// versions: { config: "c9255", index: "c9255" },
	uri: "https://wbgame-demo.tadagaming.com/436/assets/main",
	versions: { config: "39573", index: "39573" },
};

start(input);
