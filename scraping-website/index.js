const puppeteer = require("puppeteer");
const { URL } = require("url");
const fse = require("fs-extra");
const path = require("path");

async function start(urlToFetch) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  page.on("response", async (response) => {
    const url = new URL(response.url());
    let filePath = path.resolve(`./output/${url.host}/${url.pathname}`);

    if (path.extname(url.pathname).trim() === "") {
      filePath = `${filePath}/index.html`;
    }

    try {
      await fse.outputFile(filePath, await response.buffer());
    } catch (error) {
      console.error(error);
    }
  });

  await page.goto(urlToFetch, { waitUntil: "networkidle2" });
}

start("https://google.com");
