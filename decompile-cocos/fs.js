const {
  readdir,
  stat,
  ensureDirSync,
  writeFileSync,
  copySync,
} = require("fs-extra");
const path = require("path");

const cached = {
  directories: [],
};

async function walk(dir) {
  let files = await readdir(dir);
  files = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(dir, file);
      const stats = await stat(filePath);
      if (stats.isDirectory()) return walk(filePath);
      else if (stats.isFile()) return filePath;
    })
  );

  return files.reduce((all, folderContents) => all.concat(folderContents), []);
}

async function walkDir(dir) {
  let files = await readdir(dir);
  files = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(dir, file);
      const stats = await stat(filePath);

      if (stats.isFile()) {
        return [];
      } else if (stats.isDirectory()) {
        const dirs = await walkDir(filePath);

        return [...dirs, filePath];
      }
    })
  );

  return files.reduce((all, folderContents) => all.concat(folderContents), []);
}

async function writeFiles(files, allFiles, output) {
  files.forEach((file) => {
    const { folder, name, data, action, uuid } = file;
    const destination = `${output}/${folder}`;

    ensureDirSync(destination);

    if (action === "create") {
      writeFileSync(
        `${destination}/${name}`,
        typeof data === "string" ? data : JSON.stringify(data)
      );
    } else if (action === "copy") {
      const filePath = allFiles.find((file) => file.includes(uuid));

      copySync(filePath, `${destination}/${name}`);
    }
  });
}

module.exports = { walk, walkDir, writeFiles };
