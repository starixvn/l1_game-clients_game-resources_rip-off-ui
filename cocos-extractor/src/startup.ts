import { join } from "path";
import { start, IInput } from "./app";

const input: IInput = {
  output: join(__dirname, "..", "output"),
  uri: "https://static.pgsoft-games.com/119/assets/resources",
  versions: { config: "6be3d", index: "e1dc8" },
};

start(input);
