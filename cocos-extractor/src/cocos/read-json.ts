import { readFileSync } from "fs";

export function readJsonFile(path: string) {
	try {
		const data = readFileSync(path, "utf-8");

		return JSON.parse(data);
	} catch (error) {
		console.error(`Read JSON Failed: ${path}`);
	}
}
