export const texture2dExtensions = [
  ".png",
  ".jpg",
  ".jpeg",
  ".bmp",
  ".webp",
  ".pvr",
  ".pkm",
  ".astc",
];

export function unpackTexture2D(json: { type: string; data: string }) {
  const { data } = json;

  return data
    .split("|")
    .map((e) => e.split(",").map((x) => parseInt(x)))
    .map((frame) => [
      1,
      0,
      0,
      ["cc.Texture2D"],
      0,
      [
        {
          base: frame[0],
          mipmaps: frame[1],
          frame,
          _native: texture2dExtensions[frame[0]],
        },
      ],
      [0],
      0,
      [],
      [],
      [],
    ]);
}
