const puppeteer = require("puppeteer");
const { URL } = require("url");
const fse = require("fs-extra");
const path = require("path");
const { argv } = require("process");
const configs = require("./configs.json");

async function start(urlToFetch, outputParameter) {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  let accessedUrl = "about:blank";

  page.on("response", async (response) => {
    const url = new URL(response.url());
    const isIndexFile = path.extname(url.pathname).trim() === "";
    const output = `./output/${outputParameter}`;
    const host = url.host;
    const urlFilePath = `${output}/accessed.url`;

    if (!configs.excludeSites.includes(host)) {
      let filePath = path.resolve(`${output}/${host}/${url.pathname}`);

      if (isIndexFile) {
        filePath = `${filePath}/index.html`;
      }

      try {
        const url = await page.url();

        if (url.toString() !== accessedUrl) {
          accessedUrl = url;

          if (fse.existsSync(urlFilePath)) {
            await fse.appendFile(urlFilePath, "\n" + url);
          } else {
            await fse.outputFile(urlFilePath, url);
          }
        }

        await fse.outputFile(filePath, await response.buffer());
      } catch (error) {
        console.error(error);
      }
    }
  });

  await page.goto(urlToFetch, { waitUntil: "networkidle2" });
}

const now = new Date();
const outputParameter =
  argv[2] ??
  `${now
    .toISOString()
    .slice(0, 10)}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;

start("https://google.com", outputParameter);
