import {
  SESSION,
  SHARED_CLASS,
  SHARED_MASK,
  SHARED_STRING,
  SHARED_UUID,
  VERSION,
} from "./constants";
import { preprocess } from "./preprocess";

export function unpackArray(data: any[]) {
  preprocess(data);

  const version = { version: data[VERSION], preprocessed: true };
  const sharedUuids = data[SHARED_UUID];
  const sharedStrings = data[SHARED_STRING];
  const sharedClasses = data[SHARED_CLASS];
  const sharedMasks = data[SHARED_MASK];
  const sections = data[SESSION];

  for (let i = 0; i < sections.length; ++i) {
    sections[i].unshift(
      version,
      sharedUuids,
      sharedStrings,
      sharedClasses,
      sharedMasks
    );
  }

  return sections;
}
