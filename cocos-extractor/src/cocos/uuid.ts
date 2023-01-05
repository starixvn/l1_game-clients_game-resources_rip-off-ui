const BASE64_KEYS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

const values = new Array(123);
for (let i = 0; i < 123; ++i) {
  values[i] = 64;
}

for (let i = 0; i < 64; ++i) {
  values[BASE64_KEYS.charCodeAt(i)] = i;
}

const BASE64_VALUES = values;
const HexChars = "0123456789abcdef".split("");
const template = ["", "", "", ""];
const UuidTemplate = template.concat(
  template,
  "-",
  template,
  "-",
  template,
  "-",
  template,
  "-",
  template,
  template,
  template
);
const Indices = UuidTemplate.map((x, i) => (x === "-" ? NaN : i)).filter(
  isFinite
);

export function decodeUUID(base64: string) {
  const array = base64.split("@");
  const uuid = array[0];

  if (uuid.length !== 22) {
    return base64;
  }

  UuidTemplate[0] = base64[0];
  UuidTemplate[1] = base64[1];

  for (let i = 2, j = 2; i < 22; i += 2) {
    const lhs = BASE64_VALUES[base64.charCodeAt(i)];
    const rhs = BASE64_VALUES[base64.charCodeAt(i + 1)];

    UuidTemplate[Indices[j++]] = HexChars[lhs >> 2];
    UuidTemplate[Indices[j++]] = HexChars[((lhs & 3) << 2) | (rhs >> 4)];
    UuidTemplate[Indices[j++]] = HexChars[rhs & 0xf];
  }

  return base64.replace(uuid, UuidTemplate.join(""));
}

export function getUuidFolder(uuid: string) {
  return uuid.slice(0, 2);
}
