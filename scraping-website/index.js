const puppeteer = require("puppeteer");
const { URL } = require("url");
const fse = require("fs-extra");
const path = require("path");
const { argv } = require("process");
const configs = require("./configs.json");

const now = new Date();
const defaultFolder = `${now
  .toISOString()
  .slice(0, 10)}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
const output = `./output/${argv[2] ?? defaultFolder}`;

/**
 * @param {puppeteer.Page} page
 * @param {string} previousUrl
 * @returns
 */
async function saveAccessedUrl(page, previousUrl) {
  const filePath = `${output}/accessed.url`;
  const url = page.url();

  if (url.toString() !== previousUrl) {
    if (fse.existsSync(filePath)) {
      await fse.appendFile(filePath, "\n" + url);
    } else {
      await fse.outputFile(filePath, url);
    }

    return url;
  }

  return previousUrl;
}

/**
 * @param {puppeteer.Page} page
 * @param {URL} url
 */
function getFilePath(page, url) {
  const pageUrl = new URL(page.url());
  const isIndexFile =
    path.extname(url.pathname).trim() === "" && url.protocol.startsWith("http");
  const specialProtocol = !url.protocol.startsWith("http");
  const host = (url.host || pageUrl.host).replace(":", "");
  const pathname = (url.pathname || pageUrl.pathname).replace(":", "");
  const defaultFilePath = `${output}/${host}/${pathname}`;

  if (isIndexFile) {
    return `${defaultFilePath}/index.html`;
  }

  if (specialProtocol) {
    const extension = url.protocol.split(":")[0];

    if (extension === "blob") {
      return `${defaultFilePath}.png`;
    }
    return `${defaultFilePath}.${extension}`;
  }

  return defaultFilePath;
}

async function start(urlToFetch) {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    pipe: true,
  });
  const page = await browser.newPage();
  let accessedUrl = "about:blank";

  page.on("response", async (response) => {
    const url = new URL(response.url());

    if (!configs.excludeSites.includes(url.host)) {
      const filePath = getFilePath(page, url);

      try {
        accessedUrl = await saveAccessedUrl(page, accessedUrl);

        await fse.outputFile(filePath, await response.buffer());
      } catch (error) {
        console.error(error);
      }
    }
  });

  await page.goto(urlToFetch, { waitUntil: "networkidle2" });
}

start(
  "https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs25sea&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F"
);
