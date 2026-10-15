// Shared by generated catalogs, browser renderers and the offline Node build.
export const catalogLocales = ["zh-Hant", "ja", "en"];

export function formatCatalogMessage(value, variables = {}) {
  return value.replace(/\{([a-zA-Z][a-zA-Z0-9_]*)\}/g, (match, name) =>
    Object.hasOwn(variables, name) ? String(variables[name]) : match,
  );
}

export function bindCatalog(records, scope) {
  return (key, variables) => {
    if (!Object.hasOwn(records, key)) throw new Error(`Unknown translation: ${scope}/${key}`);
    const record = records[key];
    if (variables === undefined) return record;
    return Object.fromEntries(catalogLocales.map((locale) => [
      locale, formatCatalogMessage(record[locale], variables[locale] || variables),
    ]));
  };
}
