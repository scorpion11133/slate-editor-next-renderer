import { RepoTypes } from "./translations.types";

export function translationsService(repoTypes: RepoTypes) {
  const cache: Record<string, string> = {};
  const keyFullPathHashTable = new Map<string, string>();

  function translatePath(obj: Record<string, any>, fullPath: string): string {
    const pathParts = fullPath.split(".");
    const currentKey = pathParts[0];
    const restOfPath = pathParts.slice(1);

    if (pathParts.length === 2) {
      keyFullPathHashTable.set(pathParts[1], fullPath);
    }

    if (obj[currentKey]) {
      if (Array.isArray(obj[currentKey])) {
        return obj[currentKey];
      }
      if (typeof obj[currentKey] === "object") {
        return translatePath(obj[currentKey], restOfPath.join("."));
      } else {
        return obj[currentKey];
      }
    } else {
      return `Translation for the {{${keyFullPathHashTable.get(
        currentKey,
      )}}} doesn't exist`;
    }
  }

  function getTranslation(
    path: string,
    variables?: Record<string, any>,
  ): string | Array<any> {
    if (cache[path]) {
      return cache[path];
    }

    let translation = translatePath(repoTypes, path);

    if (variables) {
      for (const key in variables) {
        const variableKey = `{{${key}}}`;
        translation = translation.replace(variableKey, variables[key]);
      }
    }

    cache[path] = translation;

    return translation;
  }

  return getTranslation;
}
