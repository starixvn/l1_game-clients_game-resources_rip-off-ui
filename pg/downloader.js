const { get } = require("https");
const { join, dirname } = require("path");
const { createWriteStream, mkdirSync } = require("fs");

const output = join(__dirname, "output");
function download(path) {
  const uri = new URL(path);
  const destination = join(output, uri.pathname);

  mkdirSync(dirname(destination), { recursive: true });

  return new Promise((resolve) => {
    get(path)
      .on("response", (response) =>
        response.pipe(createWriteStream(destination, {}))
      )
      .on("close", () => resolve(destination));
  });
}

module.exports = download;
