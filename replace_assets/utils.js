const glob = require("glob");
const fse = require("fs-extra");
const plist = require("plist");
const path = require("path");

const renameFilePlist = (filePath, newName) => {
  const dirName = filePath.slice(0, filePath.lastIndexOf("/"));
  const newPath = `${dirName}/${newName}`;
  fse.renameSync(`${filePath}.plist`, `${newPath}.plist`);

  const newPlist = `${newPath}.plist`;
  const fileData = fse.readFileSync(newPlist, "utf8");
  const plistData = plist.parse(fileData);
  const metadata = plistData["metadata"];
  const textureFileName = metadata["textureFileName"];
  const textureExtension = textureFileName.substring(
    textureFileName.lastIndexOf(".")
  );
  metadata["textureFileName"] = `${newName}${textureExtension}`;
  metadata["realTextureFileName"] = `${newName}${textureExtension}`;
  fse.writeFileSync(newPlist, plist.build(plistData));
  fse.renameSync(
    `${filePath}${textureExtension}`,
    `${newPath}${textureExtension}`
  );
};

module.exports = {
  renameFilePlist,
};
