import { IBundle } from "./parse";

export function removeRedirectAssets(bundle: IBundle) {
  if (!bundle?.configs.redirect) {
    return;
  }

  const redirect = bundle.configs.redirect;
  const storage = bundle.storage;

  for (let i = 0, l = redirect.length; i < l; i += 2) {
    const uuid = redirect[i];

    delete storage[uuid];
  }

  return bundle;
}
