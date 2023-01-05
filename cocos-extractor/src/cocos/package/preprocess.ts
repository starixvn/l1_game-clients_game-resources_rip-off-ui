import { SHARED_CLASS, SHARED_MASK } from "./constants";

export function preprocess(data: any[]) {
  const masks = data[SHARED_MASK];

  if (masks) {
    const classes = data[SHARED_CLASS];

    for (let i = 0; i < masks.length; ++i) {
      const mask = masks[i];

      mask[0] = classes[mask[0]];
    }
  }
}
