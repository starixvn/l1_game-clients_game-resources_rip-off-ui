const glob = require("glob");
const fse = require("fs-extra");
const plist = require("plist");
const path = require("path");

const WRITE_JSON_OPTIONS = {
  spaces: 2,
  EOL: "\r\n",
};

const folder = "D:/SlotCollection/assets/resources/letter-symbols/spine";

// convertFixedSpine(folder);
autoRenameFiles();

function autoRenameFiles() {
  const filePaths = glob.sync(`${folder}/**/*@(.json)`);
  filePaths.forEach((filePath, index) => {
    const basename = path.basename(filePath, `.json`);
    const dirname = path.dirname(filePath);
    const newName = dirname + `/symbol-${index}`;
    fse.renameSync(filePath, `${newName}.json`);

    const atlasPath = dirname + `/${basename}.atlas`;
    fse.renameSync(atlasPath, `${newName}.atlas`);
  });
}

function convertFixedSpine() {
  const filePaths = glob.sync(`${folder}/**/*@(.json)`);
  filePaths.forEach((path) => {
    const fileData = fse.readJSONSync(path);
    if (fileData["skeleton"]["spine"]) {
      fileData["skeleton"]["spine"] = "3.8.99";
    }
    if (fileData["skins"]) {
      const rawData = fileData["skins"];
      if (!Array.isArray(rawData)) {
        fileData["skins"] = [
          {
            name: "default",
            attachments: rawData["default"],
          },
        ];
      }
    }
    fse.writeJSONSync(path, fileData, WRITE_JSON_OPTIONS);
  });
}
