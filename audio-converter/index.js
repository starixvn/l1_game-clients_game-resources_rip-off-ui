const fs = require("fs");

const inputFolder = "./input";
const outputFolder = "./output";

const transformJsonFileV1 = (data) => {
  if (data.sounds) {
    return data.sounds;
  }

  return [];
};

const convert = ({ id, data }) =>
  fs.writeFileSync(
    `${outputFolder}/${id}.ogg`,
    Buffer.from(
      data.replace("data:audio/ogg; codecs=opus;base64,", ""),
      "base64"
    )
  );

const readJsonFile = (filePath) => JSON.parse(fs.readFileSync(filePath));

const start = () => {
  !fs.existsSync(outputFolder) && fs.mkdirSync(outputFolder);

  if (fs.existsSync(inputFolder)) {
    const files = fs.readdirSync(inputFolder);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    jsonFiles.forEach((file) => {
      const filePath = `${inputFolder}/${file}`;
      const data = readJsonFile(filePath);
      const sounds = transformJsonFileV1(data);

      sounds.forEach(convert);
    });
  }
};

start();
