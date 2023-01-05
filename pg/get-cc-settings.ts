import { readFileSync } from "fs";

export interface CCVersion {
  config: string;
  index: string;
}

export interface CCSettings {
  bundleVers: Record<string, CCVersion>;
}

export function parseCCSettings(htmlContent: string): CCSettings {
  const regex = /window._CCSettings\s*=\s*(?<content>[\s\S]*?);/gi;
  const scriptContent = regex.exec(htmlContent);
  const settings = scriptContent?.groups?.content ?? "{}";

  return JSON.parse(settings);
}

export function getCCSettings(indexPath: string) {
  try {
    const html = readFileSync(indexPath, "utf-8");

    return parseCCSettings(html);
  } catch (error) {
    throw new Error(`Load HTML Failed: ${indexPath}`);
  }
}
