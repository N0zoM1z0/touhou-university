// Render only explicitly marked institutional copy. Visitor-authored text is
// never passed through a source-text dictionary during a language switch.
export function renderKeyedCopy(root, dictionary) {
  const elements = [
    ...(root?.matches?.("[data-i18n]") ? [root] : []),
    ...(root?.querySelectorAll?.("[data-i18n]") || []),
  ];
  for (const element of elements) {
    const value = dictionary[element.dataset.i18n];
    if (value !== undefined) element.textContent = value;
  }
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT);
  for (let comment = walker.nextNode(); comment; comment = walker.nextNode()) {
    const key = /^\s*i18n:([\w.-]+)\s*$/.exec(comment.nodeValue)?.[1];
    const node = comment.nextSibling;
    if (!key || node?.nodeType !== Node.TEXT_NODE || dictionary[key] === undefined) continue;
    const leading = node.nodeValue.match(/^\s*/)[0];
    const trailing = node.nodeValue.match(/\s*$/)[0];
    node.nodeValue = leading + dictionary[key] + trailing;
  }
  const attributes = ["aria-label", "placeholder", "alt", "title", "content"];
  for (const attribute of attributes) {
    const selector = `[data-i18n-${attribute}]`;
    const nodes = [...(root.matches?.(selector) ? [root] : []), ...root.querySelectorAll(selector)];
    for (const element of nodes) {
      const key = element.getAttribute(`data-i18n-${attribute}`);
      if (dictionary[key] !== undefined) element.setAttribute(attribute, dictionary[key]);
    }
  }
}
