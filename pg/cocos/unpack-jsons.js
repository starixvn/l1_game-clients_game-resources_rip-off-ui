function preprocess(data) {
  const masks = data[4];

  if (masks) {
    const classes = data[3];

    for (let i = 0; i < masks.length; ++i) {
      const mask = masks[i];

      mask[0] = classes[mask[0]];
    }
  }
}

function unpackJSons(data) {
  preprocess(data);
  const version = { version: data[0], preprocessed: true };
  const sharedUuids = data[1];
  const sharedStrings = data[2];
  const sharedClasses = data[3];
  const sharedMasks = data[4];
  const sections = data[5];
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

module.exports = unpackJSons;
