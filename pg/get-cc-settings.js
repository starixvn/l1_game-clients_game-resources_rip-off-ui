function getCCSettings(htmlContent) {
  const regex = /window._CCSettings\s*=\s*(?<content>[\s\S]*?);/gi;
  const scriptContent = regex.exec(htmlContent);
  const settings = scriptContent?.groups?.content ?? "{}";

  return JSON.parse(settings);
}

module.exports = getCCSettings;
