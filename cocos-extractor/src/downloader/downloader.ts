import { createWriteStream, existsSync, mkdirSync, unlinkSync } from "fs";
import { get } from "https";
import { dirname, join } from "path";

export const defaultOutputPath = join(__dirname, "output");

async function downloadAndWriteFile(path: string, destination: string) {
  existsSync(destination) && unlinkSync(destination);

  const writeStream = createWriteStream(destination, {});
  return new Promise<string>((resolve, reject) => {
    get(path, (response) => {
      response.pipe(writeStream);

      writeStream.on("finish", () => {
        writeStream.close();
        resolve(destination);
      });
    }).on("error", (error) => {
      writeStream.close();

      reject(error);
    });
  });
}

async function downloadWithRetry(
  path: string,
  destination: string,
  retry: number,
  tried = 1
) {
  if (retry === tried) {
    throw new Error(`Can't download file: ${path}`);
  }

  if (tried !== 1) {
    console.info(`Retried ${tried}/${retry} downloading file ${path}`);
  }

  try {
    const file = await downloadAndWriteFile(path, destination);

    return file;
  } catch (error) {
    console.error(error);

    return downloadWithRetry(path, destination, retry, tried + 1);
  }
}

export function download(
  path: string,
  output: string = defaultOutputPath,
  keepPath: boolean = true
): Promise<string> {
  const uri = new URL(path);
  const destination = keepPath ? join(output, uri.pathname) : output;

  if (existsSync(destination)) {
    return Promise.resolve(destination);
  }

  mkdirSync(dirname(destination), { recursive: true });

  return downloadWithRetry(path, destination, 5);
}
