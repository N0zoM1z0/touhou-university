export function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

// The PO catalog owns the issued default copy too. Editing a translation does
// not require duplicating the edit in the readable source-markup fallback.
export function renderDefaultCopy(source, dictionary) {
  const translated = (key) => {
    if (!Object.hasOwn(dictionary, key)) throw new Error(`Unknown markup translation: ${key}`);
    return escapeHtml(dictionary[key]);
  };
  return source
    .replace(/(<([a-z][\w-]*)\b[^>]*\bdata-i18n="([\w.-]+)"[^>]*>)([^<]*)(<\/\2>)/gi,
      (_, open, tag, key, fallback, close) => open + translated(key) + close)
    .replace(/(<!--\s*i18n:([\w.-]+)\s*-->)([^<]*)/g,
      (_, marker, key, fallback) => marker + fallback.match(/^\s*/)[0] + translated(key) + fallback.match(/\s*$/)[0])
    .replace(/<[a-z][^>]*>/gi, (tag) => {
      for (const match of tag.matchAll(/\bdata-i18n-(aria-label|placeholder|alt|title|content)="([\w.-]+)"/g)) {
        const [, attribute, key] = match;
        const attributePattern = new RegExp(`(^|\\s)${attribute}="[^"]*"`);
        if (!attributePattern.test(tag)) throw new Error(`Missing ${attribute} for ${key}`);
        tag = tag.replace(attributePattern, (_, space) => `${space}${attribute}="${translated(key)}"`);
      }
      return tag;
    });
}
