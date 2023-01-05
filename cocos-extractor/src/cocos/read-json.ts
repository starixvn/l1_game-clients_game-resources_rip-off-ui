import { readFileSync } from "fs";

export function readJsonFile(path: string) {
  try {
    const data = readFileSync(path, "utf-8");

    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Read JSON Failed: ${path}`);
  }
}
