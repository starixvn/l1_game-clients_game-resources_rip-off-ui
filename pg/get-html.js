const { get } = require("https");

function getHtml(gameUri, gameId = 1) {
  const path = `${gameUri}/${gameId}/index.html`;

  return new Promise((resolve) => {
    get(path, (response) => {
      if (response.statusCode !== 200) {
        response.resume();

        resolve("");
        return;
      }

      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("close", () => {
        resolve(data);
      });
    });
  });
}

module.exports = getHtml;
